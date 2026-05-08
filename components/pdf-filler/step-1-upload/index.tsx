import { Upload, FileCheck } from "lucide-react";
import { useStep1Upload } from "./useStep1Upload";

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

// ─── Sub-components ───────────────────────────────────────────────────────────

function Header() {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-foreground mb-2">Upload PDF</h2>
      <p className="text-sm text-muted-foreground">
        Select a PDF file with form fields to fill
      </p>
    </div>
  );
}

interface DropZoneProps {
  isDragging: boolean;
  onDragOver: React.DragEventHandler<HTMLLabelElement>;
  onDragLeave: React.DragEventHandler<HTMLLabelElement>;
  onDrop: React.DragEventHandler<HTMLLabelElement>;
  children: React.ReactNode;
}

function DropZone({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  children,
}: DropZoneProps) {
  return (
    <div className="relative">
      {children}
      <label
        htmlFor="pdf-upload"
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`
          block w-full p-8 border-2 border-dashed rounded-lg cursor-pointer
          text-center transition-colors
          ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/50 hover:border-primary/50 hover:bg-muted/50"
          }
        `}
      >
        <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
        <p className="font-medium text-foreground mb-1">
          Click to upload or drag and drop
        </p>
        <p className="text-xs text-muted-foreground">PDF files only</p>
      </label>
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive"
    >
      {message}
    </div>
  );
}

function SuccessBanner({ fileName }: { fileName: string }) {
  return (
    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 rounded-lg">
      <div className="h-8 w-8 rounded bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
        <FileCheck className="h-4 w-4 text-green-700 dark:text-green-400" />
      </div>
      <p className="text-sm font-medium text-green-800 dark:text-green-300 truncate">
        {fileName}
      </p>
    </div>
  );
}

function SampleDownload() {
  return (
    <div className="text-center space-y-1">
      <p className="text-xs text-muted-foreground">
        Need a sample PDF to test?
      </p>

      <p className="text-xs text-muted-foreground pt-1">
        Your PDF file will be processed securely
      </p>
    </div>
  );
}
