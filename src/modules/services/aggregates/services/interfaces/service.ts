import { IsAuditable } from '@app/core';
import { PriceTypes } from './price_types';

export interface Description {
  en: string;
  vi: string;
}

export interface RoomType {
  _id: string;
  name: string;
  price: number;
  minWeight: number;
  maxWeight: number;
}

export interface RoomOption {
  _id: string;
  name: string;
  shortDescription: Description;
  description: Description;
  roomTypes: RoomType[];
  extraCares: ExtraCare[];
}

export interface PriceConfig {
  _id: string;
  price: number;
  minWeight: number;
  maxWeight: number;
}

export interface ExtraCare {
  _id: string;
  name: string;
  priceType: PriceTypes;
  price: number;
  priceConfigs: PriceConfig[];
  quantityPerDay: number;
  unit: string;
}

export interface Service extends IsAuditable {
  _id: string;
  name: string;
  shortDescription: Description;
  description: Description;
  roomOptions: RoomOption[];
  priceType: PriceTypes;
  price: number;
  priceConfigs: PriceConfig[];
  extraCares: ExtraCare[];
  isActive: boolean;
}
