const SUPPRESSED_WARNINGS = [
  "Trying to parse invalid object",
  "Invalid object ref",
  "Removing XFA form data",
] as const;

const _originalWarn = console.warn.bind(console);

export function suppressPdfLibWarnings(): void {
  console.warn = (...args: unknown[]) => {
    const message = typeof args[0] === "string" ? args[0] : "";
    const isSuppressed = SUPPRESSED_WARNINGS.some((w) => message.includes(w));
    if (!isSuppressed) _originalWarn(...args);
  };
}

export function restorePdfLibWarnings(): void {
  console.warn = _originalWarn;
}
