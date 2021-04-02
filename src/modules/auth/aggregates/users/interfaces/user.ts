import { IsAuditable, ISODate, Genders, LoginTypes } from '@app/core';
import { Role } from '../../roles/interfaces';

export interface User extends IsAuditable {
  _id: string;
  fullName: string;
  email: string;
  phoneNo: string;
  avatarUrl: string;
  dob: ISODate;
  address: string;
  gender: Genders;
  numberOfPets: number;
  roles: Role[];
  loginType: LoginTypes;
  firebaseId: string;
  isActive: boolean;
}
