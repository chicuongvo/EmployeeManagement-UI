export type MeetingStatus = "SCHEDULED" | "ONGOING" | "COMPLETED" | "CANCELLED";

export type MeetingResponse = {
  id: string;
  callId: string;
  title: string;
  description?: string | null;
  status: MeetingStatus;
  scheduledAt?: string | null;
  createdAt: string;
  createdById: number;
  departmentId?: number | null;
  departmentName?: string | null;
  createdBy?: {
    id: number;
    fullName: string;
    email: string;
  } | null;
};

export type CreateMeetingRequest = {
  title: string;
  description?: string;
  callId?: string; // Optional: if not provided, will be generated
  scheduledAt?: string;
  departmentId?: number;
  status?: MeetingStatus;
};

export type UpdateMeetingRequest = Partial<CreateMeetingRequest> & {
  status?: MeetingStatus;
};

export type MeetingQueryParams = {
  status?: MeetingStatus;
  departmentId?: number;
  createdById?: number;
  page?: number;
  limit?: number;
  sort?: string;
};
