"use client";

import { Card } from "@/components/ui/card";
import { Step1Upload } from "./step-1-upload";
import { Step2Fill } from "./step-2-fill";
import { Step3Download } from "./step-3-download";
import { StepIndicator } from "./step-indicator";
import { usePDFFiller } from "@/components/pdf-filler/usePDFFiller";

export function PDFFiller() {
  const {
    currentStep,
    uploadedFile,
    filledPDFBytes,
    isLoading,
    error,
    selectedClientId,
    setSelectedClientId,
    clients,
    dataLoading,
    handleFileSelect,
    handleFillPDF,
    handleDownload,
    handleReset,
  } = usePDFFiller();

  if (dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-sm animate-pulse">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen from-background to-muted/20 flex items-center justify-center p-4">
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
