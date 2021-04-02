import { IsAuditable } from '@app/core';

export interface Permission {
  permission: string;
  scope: string;
}

export interface Role extends IsAuditable {
  _id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isActive: boolean;
}
