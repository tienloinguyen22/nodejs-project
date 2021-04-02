import { Genders, ISODate } from '../../../core';

export interface LoginPayload {
  idToken: string;
  fullName: string;
  email: string;
  phoneNo: string;
  avatarUrl: string;
  dob: ISODate;
  address: string;
  gender: Genders;
}
