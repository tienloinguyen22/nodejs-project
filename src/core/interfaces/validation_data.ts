/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ValidationData {
  body?: { [key: string]: any };
  params?: { [key: string]: any };
  query?: { [key: string]: any };
}
