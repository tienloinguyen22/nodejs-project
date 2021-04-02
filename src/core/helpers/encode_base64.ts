/**
 * encode json object to base 64 string
 */
export const encodeBase64 = (obj: object): string => {
  return Buffer.from(JSON.stringify(obj), 'utf-8').toString('base64');
};
