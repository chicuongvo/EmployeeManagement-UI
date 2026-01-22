import { PageContainer } from "@ant-design/pro-components";
import { useState, useMemo, useEffect, useCallback } from "react";
import { Tabs, Empty, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PageTitle from "@/components/common/shared/PageTitle";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { getAllMeetings, updateMeeting, updateParticipantStatus } from "@/api/meeting.api";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import type { MeetingResponse } from "@/types/Meeting";
import MeetingCard from "./components/MeetingCard";
import PrimaryButton from "@/components/common/button/PrimaryButton";

const MeetingPage = () => {
  const navigate = useNavigate();
  const { userProfile } = useUser();
  const [, setLoading] = useState(false);
  
  // Check if user is Host (Sếp) - Manager role or position name contains "Manager"
  const isHost = useMemo(() => {
    if (!userProfile) return false;
    const positionName = userProfile.position?.name?.toLowerCase() || "";
    const role = userProfile.role?.toLowerCase() || "";
    return positionName.includes("manager") || role.includes("manager") || role === "admin";
  }, [userProfile]);
  
  // Set default tab based on user role
  const [activeTab, setActiveTab] = useState<string>(() => {
    // Initialize based on isHost, but we can't use isHost here since it's a useMemo
    // So we'll initialize to "upcoming" and update in useEffect
    return "upcoming";
  });
  
  // Update activeTab when isHost changes (only once on mount or when isHost changes)
  useEffect(() => {
    if (!isHost) {
      setActiveTab("my-meetings");
    } else {
      setActiveTab("upcoming");
    }
  }, [isHost]);

  // Fetch meetings from API
  const { data: meetingsData, refetch } = useQuery({
    queryKey: ["meetings"],
    queryFn: async () => {
      try {
        const response = await getAllMeetings({});
        console.log("Frontend - getAllMeetings response:", response);
        if (response && typeof response === "object" && "data" in response) {
          const meetings = response.data || [];
          console.log("Frontend - extracted meetings:", meetings.length, meetings);
          return meetings;
        }
        console.warn("Frontend - invalid response structure:", response);
        return [];
      } catch (error: any) {
        // If API doesn't exist yet, return empty array
        if (error.response?.status === 404) {
          return [];
        }
        console.error("Error fetching meetings:", error);
        return [];
      }
    },
    refetchInterval: 5000, // Refetch every 5 seconds to get updated status
  });

  const allMeetings = meetingsData || [];
  console.log("Frontend - allMeetings:", allMeetings.length, allMeetings);

  // Filter meetings by user role (before tab filtering)
  // Note: Backend already filters meetings by participants, so we just use allMeetings directly
  const filteredMeetings = useMemo(() => {
    return allMeetings;
  }, [allMeetings]);



  const handleViewMeeting = useCallback((meetingId: string) => {
    navigate(`/employee/meetings/${meetingId}`);
  }, [navigate]);

  const handleJoinMeeting = useCallback(async (meetingId: string, callId: string) => {
    try {
      setLoading(true);
      
      // Update participant status to ACCEPTED when joining
      if (userProfile?.id) {
        try {
          console.log("MeetingPage - Updating participant status:", { meetingId, userId: userProfile.id });
          await updateParticipantStatus(meetingId, userProfile.id, "ACCEPTED");
          console.log("MeetingPage - Participant status updated successfully");
        } catch (error) {
          console.error("MeetingPage - Error updating participant status:", error);
          // Continue even if update fails
        }
      }
      
      // Update meeting status to ONGOING when joining
      try {
        await updateMeeting(meetingId, { status: "ONGOING" });
        refetch();
      } catch (error) {
        console.error("Error updating meeting status:", error);
        // Continue even if update fails
      }
      
      // Navigate to video call with callId
      navigate(`/employee/video-call?callId=${callId}&meetingId=${meetingId}`);
    } catch (error: any) {
      message.error("Không thể tham gia cuộc họp. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, [navigate, userProfile, refetch]);
  

  // Helper function to filter meetings by time (upcoming/past)
  const filterMeetingsByTime = (meetings: MeetingResponse[], tabKey: string) => {
    const now = dayjs();
    console.log("Frontend - filterMeetingsByTime:", { tabKey, meetingsCount: meetings.length, now: now.format() });
    
    if (tabKey === "upcoming" || tabKey === "my-meetings") {
      const filtered = meetings.filter((m) => {
        if (!m.scheduledAt) return m.status === "SCHEDULED" || m.status === "ONGOING";
        const scheduled = dayjs(m.scheduledAt);
        const result = scheduled.isAfter(now) || m.status === "ONGOING" || m.status === "SCHEDULED";
        console.log("Frontend - meeting filter check:", { 
          id: m.id, 
          title: m.title, 
          scheduledAt: m.scheduledAt, 
          status: m.status,
          isAfter: scheduled.isAfter(now),
          result 
        });
        return result;
      });
      console.log("Frontend - upcoming/my-meetings filtered:", filtered.length);
      return filtered;
    } else {
      // Past tab
      const filtered = meetings.filter((m) => {
        if (!m.scheduledAt) return m.status === "COMPLETED" || m.status === "CANCELLED";
        const scheduled = dayjs(m.scheduledAt);
        const result = scheduled.isBefore(now) || m.status === "COMPLETED" || m.status === "CANCELLED";
        return result;
      });
      console.log("Frontend - past filtered:", filtered.length);
      return filtered;
    }
  };

  const tabItems = useMemo(() => {
    console.log("Frontend - tabItems useMemo - filteredMeetings:", filteredMeetings.length, filteredMeetings);
    console.log("Frontend - tabItems useMemo - isHost:", isHost);
    if (isHost) {
      const upcomingMeetings = filterMeetingsByTime(filteredMeetings, "upcoming");
      const pastMeetings = filterMeetingsByTime(filteredMeetings, "past");

      return [
        {
          key: "upcoming",
          label: "Sắp tới",
          children: (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingMeetings.length === 0 ? (
                <div className="col-span-full">
                  <Empty description="Chưa có cuộc họp sắp tới" />
                </div>
              ) : (
                upcomingMeetings.map((meeting) => (
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
          ),
        },
        {
          key: "past",
          label: "Đã qua",
          children: (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pastMeetings.length === 0 ? (
                <div className="col-span-full">
                  <Empty description="Chưa có cuộc họp đã qua" />
                </div>
              ) : (
                pastMeetings.map((meeting) => (
                  <MeetingCard
                    key={meeting.id}
                    meeting={meeting}
                    isHost={true}
                    onView={handleViewMeeting}
                    showParticipants={true}
                    participantsCount={meeting.participantsCount || 0}
                    totalParticipants={meeting.totalParticipants || 0}
                  />
                ))
              )}
            </div>
          ),
        },
      ];
    } else {
      // Employee view - My Meetings
      // Show only upcoming meetings (filter by time)
      const myMeetings = filterMeetingsByTime(filteredMeetings, "my-meetings");
      console.log("Frontend - Employee view - filteredMeetings:", filteredMeetings.length, "after filter:", myMeetings.length);
      return [
        {
          key: "my-meetings",
          label: "Cuộc họp của tôi",
          children: (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myMeetings.length === 0 ? (
                <div className="col-span-full">
                  <Empty description="Bạn chưa có cuộc họp nào" />
                </div>
              ) : (
                myMeetings.map((meeting) => {
                  console.log("Frontend - Rendering meeting card:", meeting.id, meeting.title);
                  return (
                    <MeetingCard
                      key={meeting.id}
                      meeting={meeting}
                      isHost={false}
                      onView={handleViewMeeting}
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
    }
  }, [isHost, filteredMeetings, handleViewMeeting, handleJoinMeeting]);

  return (
    <PageContainer
      header={{
        breadcrumb: {
          items: [
            {
              title: "Hồ sơ nhân sự",
            },
            {
              title: "Cuộc họp",
            },
          ],
        },
      }}
      title={<PageTitle title={isHost ? "Cuộc họp" : "Cuộc họp của tôi"} />}
      extra={
        isHost
          ? [
              <Link to="/employee/meetings/add-new" key="create-meeting">
                <PrimaryButton
                  icon={<PlusOutlined className="icon-hover-effect" />}
                  color="green"
                  className="font-primary"
                >
                  Tạo cuộc họp
                </PrimaryButton>
              </Link>,
            ]
          : undefined
      }
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

export default MeetingPage;
