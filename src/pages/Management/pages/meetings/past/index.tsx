import { PageContainer } from "@ant-design/pro-components";
import { useState, useMemo, useCallback } from "react";
import { Empty, message } from "antd";
import PageTitle from "@/components/common/shared/PageTitle";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import {
  getAllMeetings,
  updateMeeting,
  updateParticipantStatus,
} from "@/api/meeting.api";
import { useQuery } from "@tanstack/react-query";
import type { MeetingResponse } from "@/types/Meeting";
import MeetingCard from "@/pages/Employee/pages/meeting/components/MeetingCard";

const ManagementPastMeetingsPage = () => {
  const navigate = useNavigate();
  const { userProfile } = useUser();
  const [, setLoading] = useState(false);

  // Fetch meetings from API - only meetings created by this user (host)
  const { data: meetingsData, refetch } = useQuery({
    queryKey: ["management-past-meetings"],
    queryFn: async () => {
      try {
        const response = await getAllMeetings({});
        console.log("Management Past - getAllMeetings response:", response);
        if (response && typeof response === "object" && "data" in response) {
          const meetings = response.data || [];
          // Filter only meetings created by current user (host)
          const hostMeetings = meetings.filter(
            (meeting: MeetingResponse) =>
              meeting.createdById === userProfile?.id,
          );
          console.log(
            "Management Past - host meetings:",
            hostMeetings.length,
            hostMeetings,
          );
          return hostMeetings;
        }
        console.warn("Management Past - invalid response structure:", response);
        return [];
      } catch (error: unknown) {
        if ((error as unknown).response?.status === 404) {
          return [];
        }
        console.error("Error fetching past meetings:", error);
        return [];
      }
    },
    refetchInterval: 5000,
    enabled: !!userProfile?.id,
  });

  const allMeetings = meetingsData || [];

  const handleViewMeeting = useCallback(
    (meetingId: string) => {
      navigate(`/management/meetings/${meetingId}`);
    },
    [navigate],
  );

  const handleJoinMeeting = useCallback(
    async (meetingId: string, callId: string) => {
      try {
        setLoading(true);

        // Update participant status to ACCEPTED when joining
        if (userProfile?.id) {
          try {
            console.log("Management Past - Updating participant status:", {
              meetingId,
              userId: userProfile.id,
            });
            await updateParticipantStatus(
              meetingId,
              userProfile.id,
              "ACCEPTED",
            );
            console.log(
              "Management Past - Participant status updated successfully",
            );
          } catch (error) {
            console.error(
              "Management Past - Error updating participant status:",
              error,
            );
          }
        }

        // Update meeting status to ONGOING when joining
        try {
          await updateMeeting(meetingId, { status: "ONGOING" });
          refetch();
        } catch (error) {
          console.error("Error updating meeting status:", error);
        }

        // Navigate to video call with callId
        navigate(
          `/management/video-call?callId=${callId}&meetingId=${meetingId}`,
        );
      } catch (error: unknown) {
        message.error("Không thể tham gia cuộc họp. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    },
    [navigate, userProfile, refetch],
  );

  // Filter past meetings only - based on status, not time
  const pastMeetings = useMemo(() => {
    return allMeetings.filter((m) => {
      // Show meetings that are COMPLETED or CANCELLED
      return m.status === "COMPLETED" || m.status === "CANCELLED";
    });
  }, [allMeetings]);

  return (
    <PageContainer
      header={{
        breadcrumb: {
          items: [
            {
              title: "Quản lý nhân sự",
            },
            {
              title: "Cuộc họp đã kết thúc",
            },
          ],
        },
      }}
      title={<PageTitle title="Cuộc họp đã kết thúc" />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pastMeetings.length === 0 ? (
          <div className="col-span-full">
            <Empty description="Chưa có cuộc họp đã kết thúc" />
          </div>
        ) : (
          pastMeetings.map((meeting) => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
              isHost={true}
              onView={handleViewMeeting}
              onJoin={handleJoinMeeting}
              showParticipants={true}
              participantsCount={meeting.participantsCount || 0}
              totalParticipants={meeting.totalParticipants || 0}
            />
          ))
        )}
      </div>
    </PageContainer>
  );
};

export default ManagementPastMeetingsPage;
