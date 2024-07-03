export interface ILdapResponse {
  token: string;
  refreshToken: string;
}

export interface IProfile {
  idp: string;
  id: string;
  user: string;
  biogName: string;
  biogNameEng: string;
  firstnameEng: string;
  lastnameEng: string;
  email: string;
  biogUnitname: string;
  biogPosnameAcm: string;
  biogPosnameFull: string;
  department: string;
  gender: number;
  biogRankId: string;
  biogCdep: string;
}
