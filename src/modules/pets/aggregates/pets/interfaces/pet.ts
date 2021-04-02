import { IsAuditable, ISODate } from '@app/core';
import { PetSpecies } from './pet_species';
import { Breed } from '../../breeds/interfaces';
import { PetGenders } from './pet_genders';

export interface Pet extends IsAuditable {
  _id: string;
  name: string;
  species: PetSpecies;
  breed: Breed;
  avatarUrl: string;
  dob: ISODate;
  gender: PetGenders;
  weight: number; // kg
  allergies: string;
  vetName: string;
  vetPhoneNo: string;
  vetAddress: string;
  vaccinationDue: ISODate;
  dewormDue: ISODate;
  proofOfCurrentVaccinations: string[];
}
