import { TimestampInMilliseconds } from '@app/core';

/**
 * Interface for auditable objects with creation & modification info
 */
export interface IsAuditable {
  createdBy?: string;
  createdAt?: TimestampInMilliseconds;
  lastModifiedBy?: string;
  lastModifiedAt?: TimestampInMilliseconds;
}
