import { PageContainer } from "@ant-design/pro-components";
import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PageTitle from "@/components/common/shared/PageTitle";
import { MeetingForm } from "@/components/meeting/MeetingForm";
import { createMeeting } from "@/api/meeting.api";
import type { CreateMeetingRequest } from "@/types/Meeting";
import { MdSaveAs } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import CircleButton from "@/components/common/button/CircleButton";

const CreateMeetingPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    scheduledAt: any;
    participantIds: number[];
  }>({
    title: "",
    scheduledAt: null,
    participantIds: [],
  });

  const handleCreate = async (data: CreateMeetingRequest) => {
    try {
      setIsLoading(true);
      await createMeeting(data);
      toast.success("Tạo cuộc họp thành công!");
      navigate("/employee/meetings"); // Navigate to list page instead of detail (detail page not implemented yet)
    } catch (error: any) {
      console.error("Error creating meeting:", error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi tạo cuộc họp"
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = useCallback(() => {
    navigate("/employee/meetings");
  }, [navigate]);

  const handleFormDataChange = useCallback((data: typeof formData) => {
    setFormData(data);
  }, []);

  const disableSubmit = useMemo(() => {
    const hasAllRequiredFields =
      formData.title.trim() && formData.scheduledAt;
    return !hasAllRequiredFields;
  }, [formData]);

  const handleCreateMeeting = useCallback(() => {
    const form = document.getElementById("meeting-form") as HTMLFormElement;
    if (form) {
      form.requestSubmit();
    }
  }, []);

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
              href: "/employee/meetings",
            },
            {
              title: "Tạo cuộc họp mới",
            },
          ],
        },
      }}
      title={<PageTitle title="Tạo cuộc họp mới" />}
    >
      <div className="px-6 my-3">
        <MeetingForm
          initialData={null}
          onSubmit={handleCreate}
          onCancel={handleCancel}
          isLoading={isLoading}
          mode="create"
          hideSubmitButton={true}
          onFormDataChange={handleFormDataChange}
        />
      </div>
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="w-fit mx-auto min-h-14 px-8 rounded-full bg-gray-300/20 backdrop-blur-md flex gap-2 justify-center items-center shadow-lg">
          <CircleButton
            icon={<MdSaveAs size={32} className="icon-hover-effect" />}
            key="save"
            color="green"
            type="button"
            onClick={handleCreateMeeting}
            disabled={isLoading || disableSubmit}
            loading={isLoading}
          >
            Tạo cuộc họp
          </CircleButton>
          <CircleButton
            onClick={handleCancel}
            icon={<IoMdCloseCircle size={32} className="icon-hover-effect" />}
            key="close"
            type="button"
            color="red"
          >
            Hủy
          </CircleButton>
        </div>
      </div>
    </PageContainer>
  );
};

export default CreateMeetingPage;
