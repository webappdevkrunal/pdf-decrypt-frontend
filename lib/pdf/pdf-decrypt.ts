import { PDFDocument } from "pdf-lib";

const DECRYPT_API_URL = "https://pdf-server-q20x.onrender.com/decrypt-pdf";

export async function decryptIfNeeded(
  pdfBytes: Uint8Array,
): Promise<Uint8Array> {
  const probe = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  if (!probe.isEncrypted) return pdfBytes;

  console.log("[pdf-decrypt] PDF is encrypted — sending to decrypt service");

  const body = pdfBytes.buffer.slice(
    pdfBytes.byteOffset,
    pdfBytes.byteOffset + pdfBytes.byteLength,
  ) as ArrayBuffer;

  const res = await fetch(DECRYPT_API_URL, {
    method: "POST",
    body,
    headers: { "Content-Type": "application/pdf" },
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(
      `[pdf-decrypt] Decrypt API failed: ${err.error ?? res.statusText}`,
    );
  }

  return new Uint8Array(await res.arrayBuffer());
}
