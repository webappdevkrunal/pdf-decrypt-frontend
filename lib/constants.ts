export type Step = 1 | 2 | 3;

export const FILL_OPTIONS = {
  agency: "USCIS" as const,
  agencyFormNumber: "I-485",
  extentOfAppearance: 0,
} as const;
