interface ErrorBannerProps {
  message: string;
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive"
    >
      {message}
    </div>
  );
}
