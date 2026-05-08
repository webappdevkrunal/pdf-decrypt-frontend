// lib/g28-pdf-fields.ts
// All G-28 PDF field names in one place.
// If USCIS releases a new form version, only this file changes.

export const G28 = {
  attorney: {
    familyName:       "form1[0].#subform[0].Pt1Line2a_FamilyName[0]",
    givenName:        "form1[0].#subform[0].Pt1Line2b_GivenName[0]",
    middleName:       "form1[0].#subform[0].Pt1Line2c_MiddleName[0]",
    uscisAccount:     "form1[0].#subform[0].#area[0].Pt1Line1_USCISOnlineAcctNumber[0]",
    fullName:         "form1[0].#subform[0].Line3_NameofAttorneyOrRep[0]",
    licensingAuth:    "form1[0].#subform[0].Pt2Line1a_LicensingAuthority[0]",
    barNumber:        "form1[0].#subform[0].Pt2Line1b_BarNumber[0]",
    firmName:         "form1[0].#subform[0].Pt2Line1d_NameofFirmOrOrganization[0]",
    orgName:          "form1[0].#subform[0].Line2b_NameofOrganization[0]",
    orgExpiry:        "form1[0].#subform[0].Line2c_DateExpires[0]",

    // type checkboxes — index matches order: attorney, accredited_rep, associated, law_student
    typeCheckbox:     (i: number) => `form1[0].#subform[0].CheckBox${i + 1}[0]`,
    sanctionsYes:     "form1[0].#subform[0].Checkbox1dAm[0]",
    sanctionsNo:      "form1[0].#subform[0].Checkbox1dAmNot[0]",

    street:           "form1[0].#subform[0].Line3a_StreetNumber[0]",
    unitCheckbox:     (i: number) => `form1[0].#subform[0].Line3b_Unit[${i}]`,
    unitNumber:       "form1[0].#subform[0].Line3b_AptSteFlrNumber[0]",
    city:             "form1[0].#subform[0].Line3c_CityOrTown[0]",
    state:            "form1[0].#subform[0].Line3d_State[0]",
    zip:              "form1[0].#subform[0].Line3e_ZipCode[0]",
    province:         "form1[0].#subform[0].Line3f_Province[0]",
    postalCode:       "form1[0].#subform[0].Line3g_PostalCode[0]",
    country:          "form1[0].#subform[0].Line3h_Country[0]",

    phone:            "form1[0].#subform[0].Line4_DaytimeTelephoneNumber[0]",
    mobile:           "form1[0].#subform[0].Line7_MobileTelephoneNumber[0]",
    fax:              "form1[0].#subform[0].Pt1ItemNumber7_FaxNumber[0]",
    email:            "form1[0].#subform[0].Line6_EMail[0]",
  },

  eligibility: {
    uscisCheck:       "form1[0].#subform[1].Line1a_USCIS[0]",
    uscisForm:        "form1[0].#subform[1].Line1b_ListFormNumber[0]",
    iceCheck:         "form1[0].#subform[1].Line2a_ICE[0]",
    iceMatter:        "form1[0].#subform[1].Line2b_ListMatter[0]",
    cbpCheck:         "form1[0].#subform[1].Line3a_CBP[0]",
    cbpMatter:        "form1[0].#subform[1].Line3b_ListSpecificMatter[0]",
    extentCheckbox:   (i: number) => `form1[0].#subform[1].Line4_Checkbox[${i}]`,
  },

  client: {
    familyName:       "form1[0].#subform[1].Pt3Line5a_FamilyName[0]",
    givenName:        "form1[0].#subform[1].Pt3Line5b_GivenName[0]",
    middleName:       "form1[0].#subform[1].Pt3Line5c_MiddleName[0]",
    receiptNumber:    "form1[0].#subform[1].Pt3Line4_ReceiptNumber[0]",
    aNumber:          "form1[0].#subform[1].Pt3Line9_ANumber[0]",
    uscisAccount:     "form1[0].#subform[1].#area[1].Pt3Line8_USCISOnlineAcctNumber[0]",
    entityName:       "form1[0].#subform[1].Pt3Line7a_NameOfEntity[0]",
    entityTitle:      "form1[0].#subform[1].Pt3Line7b_TitleofEntity[0]",

    phone:            "form1[0].#subform[1].Line9_DaytimeTelephoneNumber[0]",
    mobile:           "form1[0].#subform[1].Line10_MobileTelephoneNumber[0]",
    email:            "form1[0].#subform[1].Line11_EMail[0]",

    street:           "form1[0].#subform[1].Line12a_StreetNumberName[0]",
    unitCheckbox:     (i: number) => `form1[0].#subform[1].Line12b_Unit[${i}]`,
    unitNumber:       "form1[0].#subform[1].Line12b_AptSteFlrNumber[0]",
    city:             "form1[0].#subform[1].Line12c_CityOrTown[0]",
    state:            "form1[0].#subform[1].Line12d_State[0]",
    zip:              "form1[0].#subform[1].Line12e_ZipCode[0]",
    province:         "form1[0].#subform[1].Line12f_Province[0]",
    postalCode:       "form1[0].#subform[1].Line12g_PostalCode[0]",
    country:          "form1[0].#subform[1].Line12h_Country[0]",
  },

  signatures: {
    attorneyDate:     "form1[0].#subform[2].Line3_Date[0]",
    attorneySignDate: "form1[0].#subform[2].Pt4Line2b_DateofSignature[0]",
    clientSignDate:   "form1[0].#subform[2].Pt5Line2b_DateofSignature[0]",
    typeCheckbox:     (i: number) => `form1[0].#subform[2].Pt4Line2${["a","b","c"][i]}_CheckBox2${["a","b","c"][i]}[0]`,
  },

  supplemental: {
    familyName:       "form1[0].#subform[3].Pt3Line5a_FamilyName[1]",
    givenName:        "form1[0].#subform[3].Pt3Line5b_GivenName[1]",
    middleName:       "form1[0].#subform[3].Pt3Line5c_MiddleName[1]",
  },
} as const;