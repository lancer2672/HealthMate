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
