import dayjs from "dayjs";

export const convertToDateRange = (
  fromTimestamp?: number,
  toTimestamp?: number
) => [
  fromTimestamp ? dayjs.unix(fromTimestamp) : undefined,
  toTimestamp ? dayjs.unix(toTimestamp) : undefined,
];
