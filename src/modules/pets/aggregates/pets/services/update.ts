import { Response, Request } from 'express';
import * as yup from 'yup';
import { validatePayload, regex, ApiError, addModificationInfo } from '@app/core';
import { StatusCodes } from 'http-status-codes';
import { PetSpecies, PetGenders } from '../interfaces';
import { breedsRepository } from '../../breeds/breeds.repository';
import { petsRepository } from '../pets.repository';

export const update = async (req: Request, res: Response, next: Function): Promise<void> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { body, query } = req as any;
    const { id } = req.params;

    // 1. Validate existed pet
    const existedPet = await petsRepository.findOne({
      ...query,
      _id: id,
    });
    if (!existedPet) {
      throw new ApiError('Pet not found', StatusCodes.NOT_FOUND);
    }

    // 2. Validate body
    await validatePayload(
      {
        name: yup.string().nullable(true),
        species: yup
          .string()
          .nullable(true)
          .oneOf([PetSpecies.CAT, PetSpecies.DOG], 'Invalid species'),
        breed: yup
          .string()
          .nullable(true)
          .test('EXISTED_BREED', 'Breed not found', async (breed: string) => {
            const existedBreed = await breedsRepository.findOne({
              _id: breed,
              isActive: true,
            });
            return Boolean(existedBreed);
          }),
        avatarUrl: yup
          .string()
          .nullable(true)
          .matches(regex.imageExt, 'Invalid image URL'),
        dob: yup.string().required('DOB is required'),
        gender: yup
          .string()
          .nullable(true)
          .oneOf([PetGenders.NEUTERIZED, PetGenders.FEMALE, PetGenders.MALE], 'Invalid pet gender'),
        weight: yup
          .number()
          .nullable(true)
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

    // 3. Update
    const newPetInfo = await petsRepository.update({
      _id: id,
      ...body,
      ...addModificationInfo(req),
    });
    res.status(StatusCodes.OK).json(newPetInfo);
  } catch (error) {
    next(error);
  }
};
