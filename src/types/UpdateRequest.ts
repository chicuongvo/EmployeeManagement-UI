export type RequestStatus = "PENDING" | "APPROVED" | "NOT_APPROVED";

export type UpdateRequestResponse = {
  id: number;
  content: string;
  status: RequestStatus;
  requestedById: number;
  reviewedById?: number | null;
  createdAt?: string;
  updatedAt?: string;
  requestedBy?: {
    id: number;
    fullName: string;
    email: string;
  };
  reviewedBy?: {
    id: number;
    fullName: string;
    email: string;
  } | null;
};

export type CreateUpdateRequestRequest = {
  content: string;
  requestedById: number;
};

export type UpdateUpdateRequestRequest = {
  content?: string;
  reviewedById?: number;
  status?: RequestStatus;
};

export type AssignReviewerRequest = {
  reviewedById: number;
};

export type ReviewRequestRequest = {
  status: "APPROVED" | "NOT_APPROVED";
};

export type UpdateRequestQueryParams = {
  page?: number;
  limit?: number;
  status?: RequestStatus;
  requestedById?: number;
  reviewedById?: number;
};

