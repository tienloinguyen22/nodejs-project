import { IsAuditable } from '../../../../../core';

export interface DeviceToken extends IsAuditable {
  _id: string;
  token: string;
  user: string; // User ID
}
