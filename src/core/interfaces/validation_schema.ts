import { ObjectShape } from 'yup/lib/object';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ValidationSchema {
  body?: ObjectShape;
  params?: ObjectShape;
  query?: ObjectShape;
}
