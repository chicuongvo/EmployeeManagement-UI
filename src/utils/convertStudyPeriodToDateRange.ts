import dayjs, { type Dayjs } from "dayjs";

/**
 * Converts study period string format "DD/MM/YYYY - DD/MM/YYYY" to date range array
 * Similar to convertToDateRange but for string format
 * @param studyPeriod - String in format "DD/MM/YYYY - DD/MM/YYYY"
 * @returns Array of [startDate, endDate] or [undefined, undefined] if invalid
 */
export const convertStudyPeriodToDateRange = (
  studyPeriod?: string | null
): [Dayjs | undefined, Dayjs | undefined] => {
  if (!studyPeriod || typeof studyPeriod !== "string") {
    return [undefined, undefined];
  }

  // Parse string format: "DD/MM/YYYY - DD/MM/YYYY"
  const parts = studyPeriod.split(" - ");
  if (parts.length !== 2) {
    return [undefined, undefined];
  }

  try {
    const startDate = dayjs(parts[0].trim(), "DD/MM/YYYY");
    const endDate = dayjs(parts[1].trim(), "DD/MM/YYYY");

    if (
      startDate.isValid() &&
      endDate.isValid() &&
      startDate.isBefore(endDate)
    ) {
      return [startDate, endDate];
    }
  } catch (error) {
    console.error("Error parsing study period:", error);
  }

  return [undefined, undefined];
};

