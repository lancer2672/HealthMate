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

export const getStartOfMonthTimeStamp = month => {
  const now = new Date();
  const date = new Date(now.getUTCFullYear(), month, 1);
  date.setHours(0, 0, 0, 0);
  const timestamp = date.getTime();
  return timestamp;
};
