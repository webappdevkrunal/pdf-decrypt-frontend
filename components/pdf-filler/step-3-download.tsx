import { Button } from "@/components/ui/button";
import { Download, CheckCircle } from "lucide-react";

interface Step3DownloadProps {
  fileName: string;
  onDownload: () => void;
  onReset: () => void;
}

export function Step3Download({
  fileName,
  onDownload,
  onReset,
}: Step3DownloadProps) {
  const outputFileName = fileName.replace(".pdf", "-filled.pdf");

  return (
    <div className="w-full max-w-md">
      <div className="space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 dark:bg-green-950/30 p-4">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            PDF Ready!
          </h2>
          <p className="text-sm text-muted-foreground">
            Your PDF has been filled successfully with the sample data
          </p>
        </div>

        <div className="p-4 bg-muted rounded-lg text-center">
          <p className="text-xs text-muted-foreground mb-1">Output File</p>
          <p className="font-medium text-foreground truncate">{outputFileName}</p>
        </div>

        <div className="space-y-2">
          <Button onClick={onDownload} size="lg" className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download Filled PDF
          </Button>
          <Button
            onClick={onReset}
            variant="outline"
            size="lg"
            className="w-full"
          >
            Fill Another PDF
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Your filled PDF is ready to download. All data has been merged into
          the form fields.
        </p>
      </div>
    </div>
  );
}
