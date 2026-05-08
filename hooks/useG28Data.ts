import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Attorney, Client } from "@/lib/types";

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null && "message" in err) {
    return String((err as { message: unknown }).message);
  }
  return "An unknown error occurred";
}

export function useG28Data() {
  const [attorney, setAttorney] = useState<Attorney | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const { data: attorney, error: attorneyError } = await supabase
          .from("attorneys")
          .select("*")
          .limit(1)
          .single();

        if (attorneyError) throw attorneyError;
        setAttorney(attorney);

        const { data: clients, error: clientsError } = await supabase
          .from("clients")
          .select("*")
          .eq("attorney_id", attorney.id)
          .order("created_at", { ascending: false });

        if (clientsError) throw clientsError;
        setClients(clients ?? []);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function logGeneration(
    clientId: string,
    agency: string,
    formNumber: string,
    extent: number,
  ) {
    if (!attorney) return;

    const { error } = await supabase.from("pdf_history").insert({
      attorney_id: attorney.id,
      client_id: clientId,
      form_type: "G-28",
      agency,
      agency_form_number: formNumber,
      extent_of_appearance: extent,
    });

    if (error) console.error("[logGeneration] Insert failed:", error.message);
  }

  return { attorney, clients, loading, error, logGeneration };
}