// lib/g28-field-map.ts
import { Attorney, Client } from "./types";
import { G28 } from "./g28-pdf-fields";

export interface FieldMapping {
  pdfField: string;
  value: string | boolean;
}

const UNIT_ORDER = ["Apt", "Ste", "Flr"] as const;
const ATTORNEY_TYPE_ORDER = [
  "attorney",
  "accredited_rep",
  "associated",
  "law_student",
] as const;

function unitCheckboxes(
  checkboxFn: (i: number) => string,
  unitType: "Apt" | "Ste" | "Flr" | null,
): FieldMapping[] {
  return UNIT_ORDER.map((u, i) => ({
    pdfField: checkboxFn(i),
    value: unitType === u,
  }));
}

export function buildG28FieldMap(
  attorney: Attorney,
  client: Client,
  options: {
    agency: "USCIS" | "ICE" | "CBP";
    agencyFormNumber: string;
    extentOfAppearance: number;
    generationDate: string;
  },
): FieldMapping[] {
  const f = G28; // shorthand

  return [
    // ── Attorney Name ───────────────────────────────────────────────────────
    { pdfField: f.attorney.familyName, value: attorney.family_name },
    { pdfField: f.attorney.givenName, value: attorney.given_name },
    { pdfField: f.attorney.middleName, value: attorney.middle_name ?? "" },

    // ── Attorney Info ───────────────────────────────────────────────────────
    { pdfField: f.attorney.uscisAccount, value: attorney.uscis_account ?? "" },
    {
      pdfField: f.attorney.fullName,
      value: `${attorney.given_name} ${attorney.family_name}`,
    },
    {
      pdfField: f.attorney.licensingAuth,
      value: attorney.licensing_authority ?? "",
    },
    { pdfField: f.attorney.barNumber, value: attorney.bar_number ?? "" },
    { pdfField: f.attorney.firmName, value: attorney.firm_name ?? "" },
    { pdfField: f.attorney.orgName, value: attorney.firm_name ?? "" },

    // ── Attorney Type ───────────────────────────────────────────────────────
    ...ATTORNEY_TYPE_ORDER.map((t, i) => ({
      pdfField: f.attorney.typeCheckbox(i),
      value: attorney.attorney_type === t,
    })),
    { pdfField: f.attorney.sanctionsNo, value: !attorney.subject_to_sanctions },
    { pdfField: f.attorney.sanctionsYes, value: attorney.subject_to_sanctions },

    // ── Attorney Address ────────────────────────────────────────────────────
    { pdfField: f.attorney.street, value: attorney.street ?? "" },
    ...unitCheckboxes(f.attorney.unitCheckbox, attorney.unit_type),
    { pdfField: f.attorney.unitNumber, value: attorney.unit_number ?? "" },
    { pdfField: f.attorney.city, value: attorney.city ?? "" },
    { pdfField: f.attorney.state, value: attorney.state ?? "" },
    { pdfField: f.attorney.zip, value: attorney.zip ?? "" },
    { pdfField: f.attorney.province, value: attorney.province ?? "" },
    { pdfField: f.attorney.postalCode, value: attorney.postal_code ?? "" },
    { pdfField: f.attorney.country, value: attorney.country ?? "" },

    // ── Attorney Contact ────────────────────────────────────────────────────
    { pdfField: f.attorney.phone, value: attorney.phone ?? "" },
    { pdfField: f.attorney.mobile, value: attorney.mobile ?? "" },
    { pdfField: f.attorney.fax, value: attorney.fax ?? "" },
    { pdfField: f.attorney.email, value: attorney.email ?? "" },

    // ── Eligibility ─────────────────────────────────────────────────────────
    { pdfField: f.eligibility.uscisCheck, value: options.agency === "USCIS" },
    {
      pdfField: f.eligibility.uscisForm,
      value: options.agency === "USCIS" ? options.agencyFormNumber : "",
    },
    { pdfField: f.eligibility.iceCheck, value: options.agency === "ICE" },
    {
      pdfField: f.eligibility.iceMatter,
      value: options.agency === "ICE" ? options.agencyFormNumber : "",
    },
    { pdfField: f.eligibility.cbpCheck, value: options.agency === "CBP" },
    {
      pdfField: f.eligibility.cbpMatter,
      value: options.agency === "CBP" ? options.agencyFormNumber : "",
    },
    ...[0, 1, 2, 3, 4].map((i) => ({
      pdfField: f.eligibility.extentCheckbox(i),
      value: options.extentOfAppearance === i,
    })),

    // ── Client ──────────────────────────────────────────────────────────────
    { pdfField: f.client.familyName, value: client.family_name },
    { pdfField: f.client.givenName, value: client.given_name },
    { pdfField: f.client.middleName, value: client.middle_name ?? "" },
    { pdfField: f.client.receiptNumber, value: client.receipt_number ?? "" },
    { pdfField: f.client.aNumber, value: client.a_number ?? "" },
    { pdfField: f.client.uscisAccount, value: client.uscis_account ?? "" },

    // ── Client Contact ──────────────────────────────────────────────────────
    { pdfField: f.client.phone, value: client.phone ?? "" },
    { pdfField: f.client.mobile, value: client.mobile ?? "" },
    { pdfField: f.client.email, value: client.email ?? "" },

    // ── Client Address ──────────────────────────────────────────────────────
    { pdfField: f.client.street, value: client.street ?? "" },
    ...unitCheckboxes(f.client.unitCheckbox, client.unit_type),
    { pdfField: f.client.unitNumber, value: client.unit_number ?? "" },
    { pdfField: f.client.city, value: client.city ?? "" },
    { pdfField: f.client.state, value: client.state ?? "" },
    { pdfField: f.client.zip, value: client.zip ?? "" },
    { pdfField: f.client.province, value: client.province ?? "" },
    { pdfField: f.client.postalCode, value: client.postal_code ?? "" },
    { pdfField: f.client.country, value: client.country ?? "" },

    // ── Signatures ──────────────────────────────────────────────────────────
    { pdfField: f.signatures.attorneyDate, value: options.generationDate },
    { pdfField: f.signatures.attorneySignDate, value: options.generationDate },
    { pdfField: f.signatures.clientSignDate, value: options.generationDate },
    ...[0, 1, 2].map((i) => ({
      pdfField: f.signatures.typeCheckbox(i),
      value: ATTORNEY_TYPE_ORDER[i] === attorney.attorney_type,
    })),

    // ── Supplemental ────────────────────────────────────────────────────────
    { pdfField: f.supplemental.familyName, value: client.family_name },
    { pdfField: f.supplemental.givenName, value: client.given_name },
    { pdfField: f.supplemental.middleName, value: client.middle_name ?? "" },
  ];
}
