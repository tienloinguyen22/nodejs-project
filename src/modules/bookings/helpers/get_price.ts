import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../../../core';
/* eslint-disable no-restricted-syntax */
import { Pet } from '../../pets/aggregates/pets/interfaces';
import { PriceTypes } from '../../services/aggregates/services/interfaces';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getPrice = (pet: Pet, prices: any): number => {
  if (prices.priceType === PriceTypes.FIXED) {
    return prices.price;
  }

  let price = 0;
  for (const item of prices.priceConfigs) {
    if (item.minWeight <= pet.weight && (!item.maxWeight || (item.maxWeight && item.maxWeight > pet.weight))) {
      price = item.price;
    }
  }

  if (!price) {
    throw new ApiError(`Can't calculate price`, StatusCodes.BAD_REQUEST);
  }

  return price;
};
