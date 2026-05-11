import { FileCheck } from "lucide-react";

interface SuccessBannerProps {
  fileName: string;
}

export function SuccessBanner({ fileName }: SuccessBannerProps) {
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
