import { IsAuditable } from '@app/core';
import { Description } from '../../../../services/aggregates/services/interfaces';

export interface Branch extends IsAuditable {
  _id: string;
  name: string;
  location: string;
  avatarImageUrl: string;
  locationImageUrl: string;
  description: Description;
  phoneNumber: string;
  availableServices: string[]; // Service IDs
  isActive: boolean;
}
