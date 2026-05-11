import { Header } from "@/components/ui/Header";
import { useStep1Upload } from "./useStep1Upload";
import { DropZone } from "@/components/ui/DropZone";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { SuccessBanner } from "@/components/ui/SuccessBanner";
import { SampleDownload } from "@/components/ui/SampleDownload";

interface Step1UploadProps {
  onFileSelect: (file: File) => void;
  fileName?: string;
}

export function Step1Upload({ onFileSelect, fileName }: Step1UploadProps) {
  const {
    error,
    isDragging,
    inputRef,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useStep1Upload({ onFileSelect });

  return (
    <div className="w-full max-w-md space-y-6">
      <Header />

      <DropZone
        isDragging={isDragging}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
          id="pdf-upload"
          aria-label="Upload PDF file"
        />
      </DropZone>

      {error && <ErrorBanner message={error} />}
      {fileName && !error && <SuccessBanner fileName={fileName} />}

      <SampleDownload />
    </div>
  );
}
