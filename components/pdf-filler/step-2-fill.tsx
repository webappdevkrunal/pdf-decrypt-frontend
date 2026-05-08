"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { extractPDFFields, PDFFieldInfo } from "@/lib/pdf-utils";
import { Client } from "@/lib/types";

interface Step2FillProps {
  pdfFile: File;
  onFill: () => Promise<void>;
  isLoading?: boolean;
  clients: Client[]; // add
  selectedClientId: string; // add
  onClientChange: (id: string) => void; // add
}

export function Step2Fill({
  pdfFile,
  onFill,
  isLoading = false,
  clients,
  selectedClientId,
  onClientChange,
}: Step2FillProps) {
  const [fields, setFields] = useState<PDFFieldInfo[]>([]);
  const [loadingFields, setLoadingFields] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const extractFields = async () => {
      try {
        const bytes = await pdfFile.arrayBuffer();
        const pdfFields = await extractPDFFields(new Uint8Array(bytes));
        setFields(pdfFields);
        setLoadingFields(false);
      } catch (err) {
        console.log("[v0] Error extracting fields:", err);
        setError("Failed to extract form fields from PDF");
        setLoadingFields(false);
      }
    };

    extractFields();
  }, [pdfFile]);

  if (loadingFields) {
    return (
      <div className="w-full max-w-md">
        <div className="space-y-6 text-center">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Analyzing PDF
            </h2>
            <p className="text-sm text-muted-foreground">
              Extracting form fields from your PDF...
            </p>
          </div>
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Error</h2>
            <p className="text-sm text-destructive">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Fill PDF</h2>
          <p className="text-sm text-muted-foreground">
            Click the button below to fill the PDF with sample data
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium text-sm text-foreground mb-3">
              Form Fields Found ({fields.length})
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {fields.map((field) => (
                <div
                  key={field.name}
                  className="text-xs text-muted-foreground p-2 bg-background rounded border border-muted"
                >
                  <span className="font-medium">{field.name}</span>
                  <span className="text-muted-foreground/60">
                    {" "}
                    • {field.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Button
          onClick={() => onFill()} // Trigger parent fill function
          disabled={isLoading || fields.length === 0}
          size="lg"
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Filling PDF...
            </>
          ) : (
            "Fill PDF with Data"
          )}
        </Button>
      </div>
    </div>
  );
}
