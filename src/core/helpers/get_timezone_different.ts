export const getTimezoneDifferent = (): number => {
  const clientTimezone = +7;
  const serverTimezone = new Date().getTimezoneOffset() / -60;
  return clientTimezone - serverTimezone;
};
