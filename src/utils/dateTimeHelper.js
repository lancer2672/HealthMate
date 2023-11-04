export const getCurrentDateTimeStamp = () => {
  const date = new Date();
  const today = new Date(
    date.getUTCFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const timestamp = today.getTime();
  return timestamp;
};
