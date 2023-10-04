import {UrlApi} from './constant';

export const transformUserData = user => {
  return {
    ...user,
    avatar: user.avatar ? `${UrlApi}\\${user.avatar}` : null,
  };
};
