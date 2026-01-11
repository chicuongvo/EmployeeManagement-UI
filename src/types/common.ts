export interface BaseResponse<T> {
  message: string;
  code: number;
  error_detail?: string;
  data?: T;
}
