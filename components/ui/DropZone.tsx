import { Upload } from "lucide-react";

interface DropZoneProps {
  isDragging: boolean;
  onDragOver: React.DragEventHandler<HTMLLabelElement>;
  onDragLeave: React.DragEventHandler<HTMLLabelElement>;
  onDrop: React.DragEventHandler<HTMLLabelElement>;
  children: React.ReactNode;
}

export function DropZone({
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
