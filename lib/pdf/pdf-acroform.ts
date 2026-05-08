import { PDFDocument, PDFName, PDFDict, PDFArray, PDFRef } from "pdf-lib";
import type { PDFContext } from "pdf-lib";

export interface ResolvedAcroForm {
  context: PDFContext;
  acroForm: PDFDict | undefined;
}

export const PDF_LOAD_OPTIONS = {
  ignoreEncryption: true,
  throwOnInvalidObject: false,
  capNumbers: true,
} as const;

export async function loadPDFSilently(bytes: Uint8Array) {
  const originalWarn = console.warn;
  console.warn = () => {};
  try {
    return await PDFDocument.load(bytes, PDF_LOAD_OPTIONS);
  } finally {
    console.warn = originalWarn;
  }
}

export function resolveAcroForm(pdfDoc: PDFDocument): ResolvedAcroForm {
  const context = pdfDoc.context;
  const catalog = context.lookup(context.trailerInfo.Root) as PDFDict;
  const acroFormRef = catalog.get(PDFName.of("AcroForm"));

  const acroForm =
    acroFormRef instanceof PDFRef
      ? (context.lookup(acroFormRef) as PDFDict | undefined)
      : (acroFormRef as PDFDict | undefined);

  return { context, acroForm };
}

export function collectFieldTree(context: PDFContext, array: PDFArray): void {
  for (const entry of array.asArray()) {
    const resolved =
      entry instanceof PDFRef
        ? (context.lookup(entry) as PDFDict | undefined)
        : (entry as PDFDict);

    if (!resolved) continue;

    const kids = resolved.lookup(PDFName.of("Kids"));
    if (kids instanceof PDFArray) collectFieldTree(context, kids);
  }
}
