export const calculateLateCheckoutFee = (lateCheckoutTime: number, roomRate: number): number => {
  if (lateCheckoutTime > 0 && lateCheckoutTime <= 2) {
    return Math.ceil(lateCheckoutTime) * 30000;
  }
  if (lateCheckoutTime > 2 && lateCheckoutTime <= 6) {
    return roomRate / 2;
  }
  if (lateCheckoutTime > 6) {
    return roomRate;
  }
  return 0;
};
