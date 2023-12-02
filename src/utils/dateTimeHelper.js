export const getCurrentDateTimeStamp = () => {
  const date = new Date();
  const today = new Date(
    date.getUTCFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const timestamp = today.getTime();
  return timestamp;
};

export const getStartDayISO = date => {
  const startDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0
  );
  return startDate.toISOString();
};

export const getEndDayISO = date => {
  const endDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59
  );
  return endDate.toISOString();
};

export const createTimeSetter = (hours, minutes, seconds) => () => {
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(seconds);
  return date;
};

export function convertSecondsToMinutesAndSeconds(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds} giây`;
  } else {
    return `${minutes} phút ${seconds} giây`;
  }
}
