import {UrlApi} from './constant';

export const transformUserData = user => {
  return {
    ...user,
    avatar: user.avatar ? `${UrlApi}\\${user.avatar}` : null,
  };
};
export const transformDrinkProgressData = progress => {
  const totalAmount = progress.sessions.reduce((acc, item, i) => {
    return acc + item.amount;
  }, 0);
  console.log('totalAmount', totalAmount);
  return {
    ...progress,
    totalAmount,
  };
};
