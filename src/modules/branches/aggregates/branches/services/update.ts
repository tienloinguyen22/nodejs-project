import { Response, Request } from 'express';
import * as yup from 'yup';
import { validatePayload, regex, ApiError, addModificationInfo } from '@app/core';
import { StatusCodes } from 'http-status-codes';
import { branchesRepository } from '../branches.repository';
import { servicesRepository } from '../../../../services/aggregates/services/services.repository';

export const update = async (req: Request, res: Response, next: Function): Promise<void> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { body, query } = req as any;
    const { id } = req.params;

    // 1. Validate existed pet
    const existedBranch = await branchesRepository.findOne({
      ...query,
      _id: id,
    });
    if (!existedBranch) {
      throw new ApiError('Branch not found', StatusCodes.NOT_FOUND);
    }

    // 2. Validate body
    await validatePayload(
      {
        name: yup.string().required('Location name is required'),
        location: yup.string().required('Location address is required'),
        description: yup.object().shape({
          en: yup.string().required('Location description is required'),
          vi: yup.string().required('Location description is required'),
        }),
        phoneNumber: yup
          .string()
          .required('Location phone number is required')
          .matches(regex.phoneNumber, 'Invalid phone number'),
        availableServices: yup
          .array()
          .of(yup.string())
          .test('EXISTED_SERVICES', 'Service not found', async (value: string[]) => {
            const services = await servicesRepository.findAll({ _id: { $in: value } });
            if (services.length !== value.length) {
              return false;
            }
            return true;
          }),
      },
      body,
    );

    // 3. Update
    const newBranchInfo = await branchesRepository.update({
      _id: id,
      ...body,
      ...addModificationInfo(req),
    });
    res.status(StatusCodes.OK).json(newBranchInfo);
  } catch (error) {
    next(error);
  }
};
