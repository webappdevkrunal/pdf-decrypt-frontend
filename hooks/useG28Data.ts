// lib/hooks/useG28Data.ts
import { supabase } from "@/lib/supabase";
import { Attorney, Client, PdfHistory } from "@/lib/types";
import { useEffect, useState } from "react";

export function useG28Data() {
  const [attorney, setAttorney] = useState<Attorney | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [history, setHistory] = useState<PdfHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const { data: att, error: e1 } = await supabase
          .from("attorneys")
          .select("*")
          .limit(1)
          .single();
        if (e1) throw e1;
        setAttorney(att);

        const { data: cls, error: e2 } = await supabase
          .from("clients")
          .select("*")
          .eq("attorney_id", att.id)
          .order("created_at", { ascending: false });
        if (e2) throw e2;
        setClients(cls ?? []);

        const { data: hist, error: e3 } = await supabase
          .from("pdf_history")
          .select("*")
          .eq("attorney_id", att.id)
          .order("generated_at", { ascending: false });
        if (e3) throw e3;
        setHistory(hist ?? []);
      } catch (err: any) {
        setError(err.message);
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
    await supabase.from("pdf_history").insert({
      attorney_id: attorney.id,
      client_id: clientId,
      form_type: "G-28",
      agency,
      agency_form_number: formNumber,
      extent_of_appearance: extent,
    });
  }

  return { attorney, clients, history, loading, error, logGeneration };
}
