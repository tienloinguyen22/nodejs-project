import { Response, Request } from 'express';
import * as yup from 'yup';
import { validatePayload, regex, addCreationInfo, createObjectId } from '@app/core';
import { StatusCodes } from 'http-status-codes';
import { PetSpecies, PetGenders } from '../interfaces';
import { breedsRepository } from '../../breeds/breeds.repository';
import { petsRepository } from '../pets.repository';
import { usersRepository } from '../../../../auth/aggregates/users/users.repository';

export const create = async (req: Request, res: Response, next: Function): Promise<void> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { body, user } = req as any;

    // 1. Validate body
    await validatePayload(
      {
        name: yup.string().required('Pet name is required'),
        species: yup
          .string()
          .required('Species is required')
          .oneOf([PetSpecies.CAT, PetSpecies.DOG], 'Invalid species'),
        breed: yup
          .string()
          .required('Breed is required')
          .test('EXISTED_BREED', 'Breed not found', async (breed: string) => {
            const existedBreed = await breedsRepository.findOne({
              _id: breed,
              isActive: true,
            });
            return Boolean(existedBreed);
          }),
        avatarUrl: yup
          .string()
          .required('Avatar URL is required')
          .matches(regex.imageExt, 'Invalid image URL'),
        dob: yup.string().required('DOB is required'),
        gender: yup
          .string()
          .required('Gender is required')
          .oneOf([PetGenders.NEUTERIZED, PetGenders.MALE, PetGenders.FEMALE], 'Invalid pet gender'),
        weight: yup
          .number()
          .required('Weight is required')
          .min(0.5, 'Weight too small (>= 0.5kg)'),
        allergies: yup.string().nullable(true),
        vetName: yup.string().nullable(true),
        vetPhoneNo: yup
          .string()
          .nullable(true)
          .test('VALID_PHONE_NUMBER', 'Invalid vet phone number', (vetPhoneNo: string) => {
            if (!vetPhoneNo) {
              return true;
            }
            return regex.phoneNumber.test(vetPhoneNo);
          }),
        vetAddress: yup.string().nullable(true),
        vaccinationDue: yup
          .string()
          .nullable(true)
          .test('VALID_ISODATE', 'Invalid vaccination due', (vaccinationDue: string) => {
            if (!vaccinationDue) {
              return true;
            }
            return regex.isoDate.test(vaccinationDue);
          }),
        dewormDue: yup
          .string()
          .nullable(true)
          .test('VALID_ISODATE', 'Invalid deworm due', (dewormDue: string) => {
            if (!dewormDue) {
              return true;
            }
            return regex.isoDate.test(dewormDue);
          }),
        proofOfCurrentVaccinations: yup
          .array()
          .nullable(true)
          .of(yup.string())
          .test('VALID_IMAGE_URL', 'Invalid image URL', (proofOfCurrentVaccinations: string[]) => {
            if (!proofOfCurrentVaccinations) {
              return true;
            }

            let result = true;
            // eslint-disable-next-line no-restricted-syntax
            for (const item of proofOfCurrentVaccinations) {
              if (!regex.imageExt.test(item)) {
                result = false;
                break;
              }
            }
            return result;
          }),
      },
      body,
    );

    // 2. Increate user's pets count
    await usersRepository.update({
      _id: user._id,
      numberOfPets: user.numberOfPets ? user.numberOfPets + 1 : 1,
    });

    // 3. Create
    const newPet = await petsRepository.create({
      _id: createObjectId(),
      ...body,
      ...addCreationInfo(req),
    });
    res.status(StatusCodes.OK).json(newPet);
  } catch (error) {
    next(error);
  }
};
