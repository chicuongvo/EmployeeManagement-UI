import requestApi from "@/utils/requestApi";

export interface CheckInData {
  checkinTime: string | null;
  checkoutTime: string | null;
  [key: string]: unknown;
}

export interface CheckInResponse {
  code: string;
  data: {
    message: string;
    data: CheckInData;
  };
}

export interface CheckInRequest {
  date?: string; // Optional date in ISO format
}

export const checkIn = async (
  params?: CheckInRequest
): Promise<CheckInResponse> => {
  // Use axios config to pass query params
  const config = params?.date ? { params: { date: params.date } } : {};
  const response = await requestApi.post<CheckInResponse>(
    `/attendance-report-details/check-in`,
    {},
    config
  );
  return response;
};


