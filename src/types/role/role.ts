import { IsAuditable } from '../../core';
import { Permission } from './permission';

export interface Role extends IsAuditable {
  _id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isActive: boolean;
}
