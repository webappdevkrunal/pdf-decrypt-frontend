import { useState, useRef, DragEvent } from "react";

const ACCEPTED_TYPE = "application/pdf";

interface UseStep1UploadProps {
  onFileSelect: (file: File) => void;
}

export function useStep1Upload({ onFileSelect }: UseStep1UploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSelect = (file: File | undefined | null) => {
    if (!file) return;

    if (file.type !== ACCEPTED_TYPE) {
      setError("Invalid file type. Please upload a PDF.");
      return;
    }

    setError(null);
    onFileSelect(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateAndSelect(e.target.files?.[0]);
    // Reset so the same file can be re-selected after an error
    e.target.value = "";
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    validateAndSelect(e.dataTransfer.files?.[0]);
  };

  return {
    error,
    isDragging,
    inputRef,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}
