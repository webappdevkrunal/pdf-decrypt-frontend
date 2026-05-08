import {
  PDFForm,
  PDFTextField,
  PDFCheckBox,
  PDFDropdown,
  PDFRadioGroup,
  PDFName,
  PDFArray,
} from "pdf-lib";
import { buildG28FieldMap } from "@/lib/g28-field-map";
import type { Attorney, Client } from "@/lib/types";
import { decryptIfNeeded } from "./pdf-decrypt";
import {
  resolveAcroForm,
  collectFieldTree,
  loadPDFSilently,
} from "./pdf-acroform";

export interface FillG28Options {
  agency: "USCIS" | "ICE" | "CBP";
  agencyFormNumber: string;
  extentOfAppearance: number;
}

function getTodayFormatted(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}

function applyFieldValue(
  form: PDFForm,
  pdfField: string,
  value: unknown,
): void {
  const field = form.getField(pdfField);

  if (field instanceof PDFTextField) {
    const text = String(value);
    const max = field.getMaxLength();
    field.setText(max ? text.slice(0, max) : text);
    return;
  }
  if (field instanceof PDFCheckBox) {
    if (value === true) {
      field.check();
    } else {
      field.uncheck();
    }
    field.updateAppearances();
    return;
  }
  if (field instanceof PDFDropdown) {
    field.select(String(value));
    return;
  }
  if (field instanceof PDFRadioGroup) {
    field.select(String(value));
  }
}

export async function fillG28PDF(
  pdfBytes: Uint8Array,
  attorney: Attorney,
  client: Client,
  options: FillG28Options,
): Promise<Uint8Array> {
  const bytes = await decryptIfNeeded(pdfBytes);
  const pdfDoc = await loadPDFSilently(bytes);

  const { context, acroForm } = resolveAcroForm(pdfDoc);
  if (!acroForm) return pdfDoc.save();

  const rawFields = acroForm.lookup(PDFName.of("Fields"));
  if (rawFields instanceof PDFArray) collectFieldTree(context, rawFields);

  const fieldMap = buildG28FieldMap(attorney, client, {
    ...options,
    generationDate: getTodayFormatted(),
  });

  const form = pdfDoc.getForm();

  for (const { pdfField, value } of fieldMap) {
    try {
      applyFieldValue(form, pdfField, value);
    } catch (err) {
      console.warn(
        `[pdf-fill] Skipped field "${pdfField}":`,
        err instanceof Error ? err.message : err,
      );
    }
  }

  form.updateFieldAppearances();
  return pdfDoc.save();
}
