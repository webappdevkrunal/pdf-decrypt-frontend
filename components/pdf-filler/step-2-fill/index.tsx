"use client";

import { Loader2, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Client } from "@/lib/types";
import { useStep2Fill } from "./useStep2Fill";

interface Step2FillProps {
  pdfFile: File;
  onFill: () => Promise<void>;
  isLoading?: boolean;
  clients: Client[];
  selectedClientId: string;
  onClientChange: (id: string) => void;
}

export function Step2Fill({
  pdfFile,
  onFill,
  isLoading = false,
}: Step2FillProps) {
  const { fields, isExtracting, extractionError } = useStep2Fill({ pdfFile });

  const mappedCount = fields.filter((f) => f.mappingKey).length;
  const unmappedCount = fields.length - mappedCount;

  if (isExtracting) return <ExtractingState />;
  if (extractionError) return <ErrorState message={extractionError} />;

  return (
    <div className="w-full max-w-2xl space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-3xl font-bold text-foreground">Fill PDF</h2>
        <p className="text-sm text-muted-foreground">
          Review the form fields extracted from your PDF
        </p>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-background border border-border">
          <div className="text-sm text-muted-foreground mb-1">Total Fields</div>
          <div className="text-2xl font-bold text-foreground">
            {fields.length}
          </div>
        </div>
        <div className="p-4 rounded-lg bg-background border border-border">
          <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            Mapped
          </div>
          <div className="text-2xl font-bold text-foreground">
            {mappedCount}
          </div>
        </div>
        <div className="p-4 rounded-lg bg-background border border-border">
          <div className="text-sm text-muted-foreground mb-1 flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            Unmapped
          </div>
          <div className="text-2xl font-bold text-foreground">
            {unmappedCount}
          </div>
        </div>
      </div>

      {/* Form Fields List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            Form Fields
          </h3>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {fields.length} fields
          </span>
        </div>

        <div className="rounded-lg border border-border overflow-hidden bg-background divide-y divide-border max-h-80 overflow-y-auto">
          {fields.length > 0 ? (
            fields.map((field) => {
              const isMapped = !!field.mappingKey;
              return (
                <div
                  key={field.name}
                  className="p-4 hover:bg-muted/40 transition-colors flex items-start justify-between gap-4"
                >
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      {isMapped ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                      )}
                      <span
                        className={`font-medium text-sm ${
                          isMapped ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {isMapped ? field.mappingKey : "No mapping"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground/70 truncate">
                      Field: {field.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs px-2.5 py-1 bg-muted rounded-md text-muted-foreground font-medium">
                      {field.type}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <p className="text-sm">No fields found in PDF</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <Button
        onClick={onFill}
        disabled={isLoading || fields.length === 0}
        size="lg"
        className="w-full h-12 text-base font-medium"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Filling PDF...
          </>
        ) : (
          <>
            <CheckCircle2 className="mr-2 h-5 w-5" />
            Fill PDF with Data
          </>
        )}
      </Button>
    </div>
  );
}

function ExtractingState() {
  return (
    <div className="w-full max-w-2xl space-y-8 text-center py-8">
      <div className="space-y-3">
        <div className="flex justify-center mb-4">
          <div className="p-6 rounded-full bg-muted">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-foreground">Analyzing PDF</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Extracting form fields from your PDF. This may take a moment...
        </p>
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="w-full max-w-2xl space-y-4">
      <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h2 className="font-semibold text-destructive">Error</h2>
            <p className="text-sm text-destructive/80">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
