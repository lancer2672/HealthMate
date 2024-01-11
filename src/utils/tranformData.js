import {GOAL, LIFE_STYLE} from 'src/constants';
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
export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const mappingLifeStyleValue = value => {
  switch (value) {
    case LIFE_STYLE.SEDENTARY:
      return 'Sedentary';
    case LIFE_STYLE.LIGHTLY_ACTIVE:
      return 'Lightly active';
    case LIFE_STYLE.MODERATELY_ACTIVE:
      return 'Moderately active';
    case LIFE_STYLE.VERY_ACTIVE:
      return 'Very active';
    case LIFE_STYLE.EXTREMELY_ACTIVE:
      return 'Extremely active';
    default:
      return '';
  }
};
export const mappingGoal = value => {
  switch (value) {
    case GOAL.FIT:
      return 'Keep fit';
    case GOAL.FITTER:
      return 'Get fitter';
    case GOAL.LOSE_WEIGHT:
      return 'Lose weight';
    default:
      return '';
  }
};
