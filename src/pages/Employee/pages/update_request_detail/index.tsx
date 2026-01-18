import { PageContainer } from "@ant-design/pro-components";
import { useCallback, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PageTitle from "@/components/common/shared/PageTitle";
import { useUpdateRequestDetailContext } from "./UpdateRequestDetailContext";
import { UpdateRequestForm } from "@/components/update-request/UpdateRequestForm";
import { createUpdateRequest, updateUpdateRequest } from "@/services/update-request";
import type { CreateUpdateRequestRequest, UpdateUpdateRequestRequest } from "@/types/UpdateRequest";
import { MdEditSquare, MdSaveAs } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import CircleButton from "@/components/common/button/CircleButton";

const Index = () => {
  const {
    updateRequest,
    isCreate,
    isEditable,
    setEditMode,
    editMode,
    refetchUpdateRequest,
    isLoadingUpdateRequest,
  } = useUpdateRequestDetailContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<{
    content: string;
    requestedById: number;
  }>({
    content: updateRequest?.content || "",
    requestedById: updateRequest?.requestedById || 0,
  });

  const handleCreate = async (
    data: CreateUpdateRequestRequest | UpdateUpdateRequestRequest
  ) => {
    try {
      setIsLoading(true);
      const result = await createUpdateRequest(data as CreateUpdateRequestRequest);
      toast.success("Tạo yêu cầu cập nhật thành công!");
      navigate(`/employee/update-requests/${result.id}`);
      refetchUpdateRequest();
    } catch (error: any) {
      console.error("Error creating update request:", error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi tạo yêu cầu cập nhật"
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (
    data: CreateUpdateRequestRequest | UpdateUpdateRequestRequest
  ) => {
    if (!updateRequest?.id) return;
    try {
      setIsLoading(true);
      await updateUpdateRequest(updateRequest.id, data as UpdateUpdateRequestRequest);
      toast.success("Cập nhật yêu cầu thành công!");
      setEditMode(false);
      refetchUpdateRequest();
    } catch (error: any) {
      console.error("Error updating update request:", error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi cập nhật yêu cầu"
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = useCallback(() => {
    if (isCreate) {
      navigate("/employee/update-requests");
      return;
    }
    if (editMode) {
      setEditMode(false);
    }
  }, [isCreate, navigate, editMode, setEditMode]);

  const handleFormDataChange = useCallback((data: typeof formData) => {
    setFormData(data);
  }, []);

  const disableSubmit = useMemo(() => {
    if (isCreate) {
      const hasAllRequiredFields =
        formData.content && formData.requestedById > 0;
      return !hasAllRequiredFields;
    }
    return false;
  }, [formData, isCreate]);

  const handleCreateUpdateRequest = useCallback(() => {
    // Trigger form submit - UpdateRequestForm will handle the submit logic internally
    const form = document.getElementById("update-request-form") as HTMLFormElement;
    if (form) {
      form.requestSubmit();
    }
  }, []);

  const canEdit = useMemo(() => {
    if (isCreate) return true;
    return updateRequest?.status === "PENDING";
  }, [isCreate, updateRequest?.status]);

  const renderActionButton = useCallback(() => {
    if (isEditable) {
      return (
        <div className="w-fit mx-auto min-h-14 px-8 rounded-full bg-gray-300/20 backdrop-blur-md flex gap-2 justify-center items-center shadow-lg">
          <CircleButton
            icon={<MdSaveAs size={32} className="icon-hover-effect" />}
            key="save"
            color="green"
            type="button"
            onClick={handleCreateUpdateRequest}
            disabled={isLoading || disableSubmit}
            loading={isLoading}
          >
            Lưu
          </CircleButton>
          <CircleButton
            onClick={handleCancel}
            icon={<IoMdCloseCircle size={32} className="icon-hover-effect" />}
            key="close"
            type="button"
            color="red"
          >
            {isCreate ? "Hủy" : "Đóng"}
          </CircleButton>
        </div>
      );
    }
    // Chỉ hiển thị nút Sửa nếu có thể edit (status === PENDING)
    if (!canEdit) {
      return null;
    }
    return (
      <div className="w-fit mx-auto min-h-14 px-8 rounded-full bg-gray-300/20 backdrop-blur-md flex gap-2 justify-center items-center shadow-lg">
        <CircleButton
          onClick={() => {
            setEditMode(true);
          }}
          icon={<MdEditSquare size={32} className="icon-hover-effect" />}
          key="edit"
          type="button"
          color="green"
        >
          Sửa
        </CircleButton>
      </div>
    );
  }, [isEditable, isCreate, isLoading, disableSubmit, handleCancel, setEditMode, handleCreateUpdateRequest, canEdit]);

  if (isLoadingUpdateRequest) {
    return (
      <PageContainer>
        <div>Đang tải...</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      header={{
        breadcrumb: {
          items: [
            {
              title: "Hồ sơ nhân sự",
            },
            {
              title: "Yêu cầu cập nhật",
              href: "/employee/update-requests?limit=10&page=1&tab=1",
            },
            {
              title: isCreate ? "Thêm mới" : "Chi tiết",
            },
          ],
        },
      }}
      title={<PageTitle title={`${isCreate ? "Thêm mới" : "Chi tiết"} yêu cầu cập nhật`} />}
    >
      <div className="px-6 my-3">
        <UpdateRequestForm
          initialData={updateRequest || null}
          onSubmit={isCreate ? handleCreate : handleUpdate}
          onCancel={handleCancel}
          isLoading={isLoading}
          mode={isCreate ? "create" : "edit"}
          isEditable={isEditable}
          hideSubmitButton={true}
          onFormDataChange={handleFormDataChange}
        />
      </div>
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        {renderActionButton()}
      </div>
    </PageContainer>
  );
};

export default Index;
