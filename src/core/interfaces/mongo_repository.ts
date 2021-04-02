import { RepositoryQuery } from '@app/core';
import { QueryCursor, Document } from 'mongoose';

export interface Repository<T> {
  find: (query: RepositoryQuery) => Promise<T[]>;
  findById: (id: string) => Promise<T | undefined>;
  findOne: (filters: unknown) => Promise<T | undefined>;
  findAll: (filters: unknown) => Promise<T[]>;
  findAllCursor: (filters: unknown) => Promise<QueryCursor<Document>>;
  count: (filters: unknown) => Promise<number>;
  create: (entity: T) => Promise<T>;
  update: (entity: { _id: string } & Partial<T>) => Promise<T>;
  upsert: (entity: { _id: string } & Partial<T>) => Promise<T>;
  del: (id: string) => Promise<void>;
}
