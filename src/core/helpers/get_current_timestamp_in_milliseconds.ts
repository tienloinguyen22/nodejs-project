import moment from 'moment';

export const getCurrentTimestampInMilliseconds = (): number => moment().valueOf();
