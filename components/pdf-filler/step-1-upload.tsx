import { Upload } from "lucide-react";

interface Step1UploadProps {
  onFileSelect: (file: File) => void;
  fileName?: string;
}

export function Step1Upload({ onFileSelect, fileName }: Step1UploadProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      onFileSelect(file);
    } else {
      alert("Please select a valid PDF file");
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Upload PDF
          </h2>
          <p className="text-sm text-muted-foreground">
            Select a PDF file with form fields to fill
          </p>
        </div>

        <div className="relative">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id="pdf-upload"
          />
          <label
            htmlFor="pdf-upload"
            className="block w-full p-8 border-2 border-dashed border-muted-foreground/50 rounded-lg cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors text-center"
          >
            <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
            <p className="font-medium text-foreground mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">PDF files only</p>
          </label>
        </div>

        {fileName && (
          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 rounded-lg">
            <div className="h-8 w-8 rounded bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-700 dark:text-green-400 font-semibold text-sm flex-shrink-0">
              ✓
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-green-800 dark:text-green-300 truncate">
                {fileName}
              </p>
            </div>
          </div>
        )}

        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-2">
            Need a sample PDF to test? 
          </p>
          <a
            href="/sample-form.pdf"
            download="sample-form.pdf"
            className="text-xs font-medium text-primary hover:underline"
          >
            Download Sample Form
          </a>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Your PDF file will be processed securely
        </p>
      </div>
    </div>
  );
}
