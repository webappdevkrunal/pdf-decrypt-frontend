import { useState } from "react";
import { fillG28PDF, downloadPDF } from "@/lib/pdf";
import { useG28Data } from "@/hooks/useG28Data";
import { FILL_OPTIONS, type Step } from "@/lib/constants";

export function usePDFFiller() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
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

  const effectiveClientId =
    clients.find((c) => c.id === selectedClientId)?.id ?? clients[0]?.id ?? "";

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
    setError(null);
    setCurrentStep(2);
  };

  const handleFillPDF = async () => {
    const client = clients.find((c) => c.id === effectiveClientId);
    if (!uploadedFile || !attorney || !client) return;

    setIsLoading(true);
    setError(null);

    try {
      const bytes = new Uint8Array(await uploadedFile.arrayBuffer());
      const filled = await fillG28PDF(bytes, attorney, client, FILL_OPTIONS);

      setFilledPDFBytes(filled);
      await logGeneration(
        client.id,
        FILL_OPTIONS.agency,
        FILL_OPTIONS.agencyFormNumber,
        FILL_OPTIONS.extentOfAppearance,
      );
      setCurrentStep(3);
    } catch (err) {
      console.error("[usePDFFiller] fillG28PDF failed:", err);
      setError("Failed to fill PDF. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!filledPDFBytes || !uploadedFile) return;
    const filename = uploadedFile.name.replace(/\.pdf$/i, "-filled.pdf");
    downloadPDF(filledPDFBytes, filename);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setUploadedFile(null);
    setFilledPDFBytes(null);
    setError(null);
    setSelectedClientId("");
  };

  return {
    currentStep,
    uploadedFile,
    filledPDFBytes,
    isLoading,
    error,
    selectedClientId: effectiveClientId,
    setSelectedClientId,
    attorney,
    clients,
    dataLoading,
    handleFileSelect,
    handleFillPDF,
    handleDownload,
    handleReset,
  };
}
