export type MeetingStatus = "SCHEDULED" | "ONGOING" | "COMPLETED" | "CANCELLED";

export type ParticipantStatus = "PENDING" | "ACCEPTED" | "DECLINED";

export type MeetingParticipant = {
  employeeId: number;
  status: ParticipantStatus;
  employee: {
    id: number;
    fullName: string;
    email: string;
    employeeCode: string;
  };
};

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
  participantIds?: number[];
  participantsCount?: number;
  totalParticipants?: number;
  participants?: MeetingParticipant[];
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
  participantIds?: number[]; // IDs of employees allowed to join the meeting
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
