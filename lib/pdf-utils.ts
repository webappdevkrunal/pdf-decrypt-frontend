import {
  PDFDocument,
  PDFTextField,
  PDFCheckBox,
  PDFDropdown,
  PDFRadioGroup,
  PDFName,
  PDFDict,
  PDFArray,
  PDFRef,
} from "pdf-lib";
import { buildG28FieldMap } from "./g28-field-map";
import { Attorney, Client } from "./types";

// Suppress pdf-lib's encrypted object warnings — expected when loading G-28
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  const msg = typeof args[0] === "string" ? args[0] : "";
  if (
    msg.includes("Trying to parse invalid object") ||
    msg.includes("Invalid object ref") ||
    msg.includes("Removing XFA form data")
  ) {
    return;
  }
  originalWarn(...args);
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PDFFieldInfo {
  name: string;
  type: string;
  value: string;
}

// ─── Decrypt ──────────────────────────────────────────────────────────────────

async function decryptIfNeeded(pdfBytes: Uint8Array): Promise<Uint8Array> {
  const probe = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  if (!probe.isEncrypted) return pdfBytes;

  console.log("PDF is encrypted — sending to decrypt service");

  const res = await fetch("https://pdf-server-q20x.onrender.com/decrypt-pdf", {
    method: "POST",
    body: pdfBytes.buffer as ArrayBuffer, // ← fix: unwrap to ArrayBuffer
    headers: { "Content-Type": "application/pdf" },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Decrypt API failed: ${err.error ?? res.statusText}`);
  }

  return new Uint8Array(await res.arrayBuffer());
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function resolveAcroForm(pdfDoc: PDFDocument) {
  const context = pdfDoc.context;
  const catalog = context.lookup(context.trailerInfo.Root) as PDFDict;
  const acroFormRef = catalog.get(PDFName.of("AcroForm"));
  const acroForm =
    acroFormRef instanceof PDFRef
      ? (context.lookup(acroFormRef) as PDFDict | undefined)
      : (acroFormRef as PDFDict | undefined);
  return { context, acroForm };
}

function collectFieldTree(
  context: ReturnType<typeof resolveAcroForm>["context"],
  array: PDFArray,
): void {
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

// ─── Extract Fields ───────────────────────────────────────────────────────────

export async function extractPDFFields(
  pdfBytes: Uint8Array,
): Promise<PDFFieldInfo[]> {
  const bytes = await decryptIfNeeded(pdfBytes);
  const pdfDoc = await PDFDocument.load(bytes, {
    ignoreEncryption: true,
    throwOnInvalidObject: false,
    capNumbers: true,
  });

  const { context, acroForm } = resolveAcroForm(pdfDoc);
  if (!acroForm) return [];

  const rawFields = acroForm.lookup(PDFName.of("Fields"));
  if (!(rawFields instanceof PDFArray)) return [];
  collectFieldTree(context, rawFields);

  const form = pdfDoc.getForm();
  return form.getFields().map((field) => {
    let type = "unknown";
    let value = "";

    if (field instanceof PDFTextField) {
      type = "text";
      value = field.getText() ?? "";
    } else if (field instanceof PDFCheckBox) {
      type = "checkbox";
      value = field.isChecked() ? "true" : "false";
    } else if (field instanceof PDFDropdown) {
      type = "dropdown";
      value = field.getSelected().join(", ");
    } else if (field instanceof PDFRadioGroup) {
      type = "radio";
      value = field.getSelected() ?? "";
    }

    return { name: field.getName(), type, value };
  });
}

// ─── Fill PDF ─────────────────────────────────────────────────────────────────

export async function fillG28PDF(
  pdfBytes: Uint8Array,
  attorney: Attorney,
  client: Client,
  options: {
    agency: "USCIS" | "ICE" | "CBP";
    agencyFormNumber: string;
    extentOfAppearance: number;
  },
): Promise<Uint8Array> {
  const bytes = await decryptIfNeeded(pdfBytes);
  const pdfDoc = await PDFDocument.load(bytes, {
    ignoreEncryption: true,
    throwOnInvalidObject: false,
    capNumbers: true,
  });

  const { context, acroForm } = resolveAcroForm(pdfDoc);
  if (!acroForm) return pdfDoc.save();

  const rawFields = acroForm.lookup(PDFName.of("Fields"));
  if (rawFields instanceof PDFArray) collectFieldTree(context, rawFields);

  const today = new Date().toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  const fieldMap = buildG28FieldMap(attorney, client, {
    ...options,
    generationDate: today,
  });

  const form = pdfDoc.getForm();

  for (const { pdfField, value } of fieldMap) {
    try {
      const field = form.getField(pdfField);

      if (field instanceof PDFTextField) {
        const max = field.getMaxLength();
        const text = String(value);
        field.setText(max ? text.slice(0, max) : text);
      } else if (field instanceof PDFCheckBox) {
        value === true ? field.check() : field.uncheck();
        field.updateAppearances();
      } else if (field instanceof PDFDropdown) {
        field.select(String(value));
      } else if (field instanceof PDFRadioGroup) {
        field.select(String(value));
      }
    } catch (err) {
      console.warn(
        `[fill] Skipped "${pdfField}":`,
        err instanceof Error ? err.message : err,
      );
    }
  }

  form.updateFieldAppearances();
  return pdfDoc.save();
}

// ─── Download ─────────────────────────────────────────────────────────────────

export function downloadPDF(pdfBytes: Uint8Array, filename: string): void {
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], {
    type: "application/pdf",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
