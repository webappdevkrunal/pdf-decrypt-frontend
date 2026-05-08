import {
  PDFTextField,
  PDFCheckBox,
  PDFDropdown,
  PDFRadioGroup,
  PDFName,
  PDFArray,
} from "pdf-lib";
import { decryptIfNeeded } from "./pdf-decrypt";
import {
  resolveAcroForm,
  collectFieldTree,
  loadPDFSilently,
} from "./pdf-acroform";
import { G28_REVERSE_MAP } from "../g28-field-lookup";

export type PDFFieldType =
  | "text"
  | "checkbox"
  | "dropdown"
  | "radio"
  | "unknown";

export interface PDFFieldInfo {
  name: string;
  type: PDFFieldType;
  value: string;
  mappingKey?: string;
}

export async function extractPDFFields(
  pdfBytes: Uint8Array,
): Promise<PDFFieldInfo[]> {
  const bytes = await decryptIfNeeded(pdfBytes);
  const pdfDoc = await loadPDFSilently(bytes);

  const { context, acroForm } = resolveAcroForm(pdfDoc);
  if (!acroForm) return [];

  const rawFields = acroForm.lookup(PDFName.of("Fields"));
  if (!(rawFields instanceof PDFArray)) return [];

  collectFieldTree(context, rawFields);

  return pdfDoc
    .getForm()
    .getFields()
    .map((field): PDFFieldInfo => {
      const name = field.getName();
      const mappingKey = G28_REVERSE_MAP.get(name);

      if (field instanceof PDFTextField) {
        return { name, type: "text", value: field.getText() ?? "", mappingKey };
      }
      if (field instanceof PDFCheckBox) {
        return {
          name,
          type: "checkbox",
          value: String(field.isChecked()),
          mappingKey,
        };
      }
      if (field instanceof PDFDropdown) {
        return {
          name,
          type: "dropdown",
          value: field.getSelected().join(", "),
          mappingKey,
        };
      }
      if (field instanceof PDFRadioGroup) {
        return {
          name,
          type: "radio",
          value: field.getSelected() ?? "",
          mappingKey,
        };
      }
      return { name, type: "unknown", value: "", mappingKey };
    });
}
