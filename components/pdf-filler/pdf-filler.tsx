"use client";

import { useState } from "react";
import { Step1Upload } from "./step-1-upload";
import { Step2Fill } from "./step-2-fill";
import { Step3Download } from "./step-3-download";
import { StepIndicator } from "./step-indicator";
import { Card } from "@/components/ui/card";
import { fillG28PDF, downloadPDF } from "@/lib/pdf-utils";
import { useG28Data } from "@/hooks/useG28Data";

type CurrentStep = 1 | 2 | 3;

export function PDFFiller() {
  const [currentStep, setCurrentStep] = useState<CurrentStep>(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filledPDFBytes, setFilledPDFBytes] = useState<Uint8Array | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string>("");

  const {
    attorney,
    clients,
    loading: dataLoading,
    logGeneration,
  } = useG28Data();

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
    setError(null);
    setCurrentStep(2);
  };

  const handleFillPDF = async () => {
    if (!uploadedFile || !attorney) return;

    const client = clients.find((c) => c.id === selectedClientId) ?? clients[0];
    if (!client) {
      setError("No client found. Add a client in Supabase first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const bytes = new Uint8Array(await uploadedFile.arrayBuffer());
      const filled = await fillG28PDF(bytes, attorney, client, {
        agency: "USCIS",
        agencyFormNumber: "I-485",
        extentOfAppearance: 0,
      });
      setFilledPDFBytes(filled);
      await logGeneration(client.id, "USCIS", "I-485", 0);
      setCurrentStep(3);
    } catch (err) {
      console.error(err);
      setError("Failed to fill PDF.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!filledPDFBytes || !uploadedFile) return;
    downloadPDF(
      filledPDFBytes,
      uploadedFile.name.replace(".pdf", "-filled.pdf"),
    );
  };

  const handleReset = () => {
    setCurrentStep(1);
    setUploadedFile(null);
    setFilledPDFBytes(null);
    setError(null);
  };

  if (dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen from-background via-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <div className="p-8">
          <StepIndicator currentStep={currentStep} totalSteps={3} />

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex justify-center">
            {currentStep === 1 && (
              <Step1Upload
                onFileSelect={handleFileSelect}
                fileName={uploadedFile?.name}
              />
            )}

            {currentStep === 2 && uploadedFile && (
              <Step2Fill
                pdfFile={uploadedFile}
                onFill={handleFillPDF}
                isLoading={isLoading}
                clients={clients}
                selectedClientId={selectedClientId}
                onClientChange={setSelectedClientId}
              />
            )}

            {currentStep === 3 && uploadedFile && filledPDFBytes && (
              <Step3Download
                fileName={uploadedFile.name}
                onDownload={handleDownload}
                onReset={handleReset}
              />
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
