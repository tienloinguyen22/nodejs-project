import moment from 'moment';

const DEFAULT_CHECKOUT_TIME = '12:00';

export const calculateLateCheckoutTime = (checkoutDateTime: string | undefined): number => {
  let lateCheckoutTime = 0;
  if (checkoutDateTime) {
    const defaultCheckoutTime = DEFAULT_CHECKOUT_TIME.split(':');
    const lateCheckoutTimeInMinutes = moment(checkoutDateTime).diff(
      moment(checkoutDateTime)
        .hour(Number(defaultCheckoutTime[0]))
        .minute(Number(defaultCheckoutTime[1])),
      'minute',
    );
    lateCheckoutTime = lateCheckoutTimeInMinutes / 60;
  }
  return lateCheckoutTime > 0 ? lateCheckoutTime : 0;
};
