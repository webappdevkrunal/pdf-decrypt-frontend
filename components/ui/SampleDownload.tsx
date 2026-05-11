export function SampleDownload() {
  return (
    <div className="text-center space-y-1">
      <a
        href="/g-28.pdf"
        download="g-28.pdf"
        className="text-xs text-primary hover:underline"
      >
        Need a sample PDF to test?
      </a>
      <p className="text-xs text-muted-foreground pt-1">
        Your PDF file will be processed securely
      </p>
    </div>
  );
}
