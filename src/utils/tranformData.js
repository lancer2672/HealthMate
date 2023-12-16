import {UrlApi} from './constant';

export const transformUserData = user => {
  return {
    ...user,
    avatar: user.avatar ? `${UrlApi}\\${user.avatar}` : null
  };
};
export const transformDrinkProgressData = progress => {
  const totalAmount = progress.sessions.reduce((acc, item, i) => {
    return acc + item.amount;
  }, 0);
  console.log('totalAmount', totalAmount);
  return {
    ...progress,
    totalAmount
  };
};

export const formatSongDuration = durationMillis => {
  const minutes = Math.floor(durationMillis / 1000 / 60);
  const seconds = Math.floor((durationMillis / 1000) % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};
