import { useState, useEffect } from "react";
import { extractPDFFields, PDFFieldInfo } from "@/lib/pdf";

interface UseStep2FillProps {
  pdfFile: File;
}

export function useStep2Fill({ pdfFile }: UseStep2FillProps) {
  const [fields, setFields] = useState<PDFFieldInfo[]>([]);
  const [isExtracting, setIsExtracting] = useState(true);
  const [extractionError, setExtractionError] = useState<string | null>(null);

  useEffect(() => {
    const extractFields = async () => {
      try {
        const bytes = await pdfFile.arrayBuffer();
        const pdfFields = await extractPDFFields(new Uint8Array(bytes));
        setFields(pdfFields);
      } catch (err) {
        console.error("[useStep2Fill] Failed to extract fields:", err);
        setExtractionError("Failed to extract form fields from PDF.");
      } finally {
        setIsExtracting(false);
      }
    };

    extractFields();
  }, [pdfFile]);

  return { fields, isExtracting, extractionError };
}
