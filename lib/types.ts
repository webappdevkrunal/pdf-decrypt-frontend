// lib/types.ts
export interface Attorney {
  id: string;
  family_name: string;
  given_name: string;
  middle_name: string | null;
  firm_name: string | null;
  licensing_authority: string | null;
  bar_number: string | null;
  street: string | null;
  unit_type: "Apt" | "Ste" | "Flr" | null;
  unit_number: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  province: string | null;
  postal_code: string | null;
  country: string | null;
  phone: string | null;
  mobile: string | null;
  fax: string | null;
  email: string | null;
  uscis_account: string | null;
  attorney_type: "attorney" | "accredited_rep" | "associated" | "law_student";
  subject_to_sanctions: boolean;
}

export interface Client {
  id: string;
  attorney_id: string;
  family_name: string;
  given_name: string;
  middle_name: string | null;
  a_number: string | null;
  uscis_account: string | null;
  receipt_number: string | null;
  street: string | null;
  unit_type: "Apt" | "Ste" | "Flr" | null;
  unit_number: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  province: string | null;
  postal_code: string | null;
  country: string | null;
  phone: string | null;
  mobile: string | null;
  email: string | null;
}

export interface PdfHistory {
  id: string;
  attorney_id: string;
  client_id: string;
  form_type: string;
  agency: "USCIS" | "ICE" | "CBP";
  agency_form_number: string | null;
  extent_of_appearance: number;
  generated_at: string;
}
