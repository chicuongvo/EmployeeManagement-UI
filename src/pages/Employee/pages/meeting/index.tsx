import { PageContainer } from "@ant-design/pro-components";
import { useState, useMemo, useCallback } from "react";
import { Tabs, Empty, message } from "antd";
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

const EmployeeMeetingsPage = () => {
  const navigate = useNavigate();
  const { userProfile } = useUser();
  const [, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("my-meetings");

  // Fetch meetings from API - only meetings where user is participant (not host)
  const { data: meetingsData, refetch } = useQuery({
    queryKey: ["employee-meetings"],
    queryFn: async () => {
      try {
        const response = await getAllMeetings({});
        console.log("Employee - getAllMeetings response:", response);
        if (response && typeof response === "object" && "data" in response) {
          const meetings = response.data || [];
          // Filter only meetings where user is participant (not the creator/host)
          const participantMeetings = meetings;
          console.log(
            "Employee - participant meetings:",
            participantMeetings.length,
            participantMeetings,
          );
          return participantMeetings;
        }
        console.warn("Employee - invalid response structure:", response);
        return [];
      } catch (error: unknown) {
        if (error.response?.status === 404) {
          return [];
        }
        console.error("Error fetching meetings:", error);
        return [];
      }
    },
    refetchInterval: 5000,
    enabled: !!userProfile?.id,
  });

  const allMeetings = meetingsData || [];

  const handleJoinMeeting = useCallback(
    async (meetingId: string, callId: string) => {
      try {
        setLoading(true);

        // Update participant status to ACCEPTED when joining
        if (userProfile?.id) {
          try {
            console.log("Employee - Updating participant status:", {
              meetingId,
              userId: userProfile.id,
            });
            await updateParticipantStatus(
              meetingId,
              userProfile.id,
              "ACCEPTED",
            );
            console.log("Employee - Participant status updated successfully");
          } catch (error) {
            console.error(
              "Employee - Error updating participant status:",
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

        // Navigate to employee video call
        navigate(
          `/employee/video-call?callId=${callId}&meetingId=${meetingId}`,
        );
      } catch (error: unknown) {
        message.error("Không thể tham gia cuộc họp. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    },
    [navigate, userProfile, refetch],
  );

  // Helper function to filter upcoming meetings for employees - based on status
  const filterUpcomingMeetings = (meetings: MeetingResponse[]) => {
    return meetings.filter((m) => {
      // Show meetings that are SCHEDULED or ONGOING
      return m.status === "SCHEDULED" || m.status === "ONGOING";
    });
  };

  const tabItems = useMemo(() => {
    // Employee view - Only show upcoming meetings they're invited to
    const myMeetings = filterUpcomingMeetings(allMeetings);
    console.log("Employee - My meetings:", myMeetings.length, myMeetings);

    return [
      {
        key: "my-meetings",
        label: "Cuộc họp sắp tới",
        children: (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myMeetings.length === 0 ? (
              <div className="col-span-full">
                <Empty description="Bạn chưa có cuộc họp nào" />
              </div>
            ) : (
              myMeetings.map((meeting) => {
                console.log(
                  "Employee - Rendering meeting card:",
                  meeting.id,
                  meeting.title,
                );
                return (
                  <MeetingCard
                    key={meeting.id}
                    meeting={meeting}
                    isHost={false}
                    onJoin={handleJoinMeeting}
                    showParticipants={true}
                    participantsCount={meeting.participantsCount || 0}
                    totalParticipants={meeting.totalParticipants || 0}
                  />
                );
              })
            )}
          </div>
        ),
      },
    ];
  }, [allMeetings, handleJoinMeeting]);

  return (
    <PageContainer
      header={{
        breadcrumb: {
          items: [
            {
              title: "Hồ sơ nhân sự",
            },
            {
              title: "Cuộc họp sắp tới",
            },
          ],
        },
      }}
      title={<PageTitle title="Cuộc họp sắp tới" />}
    >
      <Tabs
        type="card"
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
      />
    </PageContainer>
  );
};

export default EmployeeMeetingsPage;
