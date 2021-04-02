import { IsAuditable } from '@app/core';
import { PetSpecies } from '../../pets/interfaces';

export interface Breed extends IsAuditable {
  _id: string;
  name: string;
  species: PetSpecies;
  imageUrl: string;
  isActive: boolean;
}
