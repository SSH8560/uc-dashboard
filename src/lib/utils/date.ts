import dayjs from "dayjs";

export const toDateString = (date: Date) => {
  return dayjs(date).format("YYYY-MM-DD");
};
