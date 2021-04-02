/**
 * decode base 64 string to json object
 */
export const decodeBase64 = <T>(str: string): T => {
  return JSON.parse(Buffer.from(str, 'base64').toString('utf-8')) as T;
};
