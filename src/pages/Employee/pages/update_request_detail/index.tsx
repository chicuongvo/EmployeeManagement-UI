import { PageContainer } from "@ant-design/pro-components";
import { useCallback, useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import PageTitle from "@/components/common/shared/PageTitle";
import { useUpdateRequestDetailContext } from "./UpdateRequestDetailContext";
import { UpdateRequestForm } from "@/components/update-request/UpdateRequestForm";
import { createUpdateRequest, updateUpdateRequest } from "@/services/update-request";
import type { CreateUpdateRequestRequest, UpdateUpdateRequestRequest } from "@/types/UpdateRequest";
import { MdEditSquare, MdSaveAs } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import CircleButton from "@/components/common/button/CircleButton";
import { useUser } from "@/hooks/useUser";

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
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");
  const location = useLocation();
  const pathname = location.pathname;
  const isFromMyRequests =
    from === "my" || pathname.includes("my-update-requests");
  const { userProfile } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<{
    content: string;
    requestedById: number;
  }>({
    content: updateRequest?.content || "",
    requestedById: updateRequest?.requestedById || 0,
  });

  // Nếu tạo từ trang "Đơn yêu cầu của tôi" thì mặc định người yêu cầu là user hiện tại
  useEffect(() => {
    if (isCreate && isFromMyRequests && userProfile?.id) {
      setFormData(prev => ({
        ...prev,
        requestedById: userProfile.id,
      }));
    }
  }, [isCreate, isFromMyRequests, userProfile?.id]);

  const handleCreate = async (
    data: CreateUpdateRequestRequest | UpdateUpdateRequestRequest
  ) => {
    try {
      setIsLoading(true);
      const result = await createUpdateRequest(
        data as CreateUpdateRequestRequest
      );
      toast.success("Tạo yêu cầu cập nhật thành công!");

      if (isFromMyRequests) {
        // Nếu tạo từ trang "Đơn yêu cầu của tôi" thì quay lại danh sách của tôi
        navigate("/employee/my-update-requests");
      } else {
        // Ngữ cảnh quản trị: đi tới trang chi tiết
        navigate(`/employee/update-requests/${result.id}`);
        refetchUpdateRequest();
      }
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
      navigate(isFromMyRequests ? "/employee/my-update-requests" : "/employee/update-requests");
      return;
    }
    if (editMode) {
      setEditMode(false);
      return;
    }
    // Đang ở màn chi tiết (không edit): quay lại danh sách tương ứng
    navigate(isFromMyRequests ? "/employee/my-update-requests" : "/employee/update-requests");
  }, [isCreate, navigate, editMode, setEditMode, isFromMyRequests]);

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

  // Ở module "Đơn yêu cầu của tôi" thì chỉ cho xem, không cho sửa
  const allowEdit = useMemo(() => !isFromMyRequests, [isFromMyRequests]);

  const handleCreateUpdateRequest = useCallback(() => {
    // Trigger form submit - UpdateRequestForm will handle the submit logic internally
    const form = document.getElementById("update-request-form") as HTMLFormElement;
    if (form) {
      form.requestSubmit();
    }
  }, []);

  const canEdit = useMemo(() => {
    if (!allowEdit) return false;
    if (isCreate) return true;
    return updateRequest?.status === "PENDING";
  }, [allowEdit, isCreate, updateRequest?.status]);

  const renderActionButton = useCallback(() => {
    // Nếu là trang "Đơn yêu cầu của tôi" ở chế độ xem chi tiết, chỉ có nút Đóng
    if (!isCreate && isFromMyRequests) {
      return (
        <div className="w-fit mx-auto min-h-14 px-8 rounded-full bg-gray-300/20 backdrop-blur-md flex gap-2 justify-center items-center shadow-lg">
          <CircleButton
            onClick={handleCancel}
            icon={<IoMdCloseCircle size={32} className="icon-hover-effect" />}
            key="close"
            type="button"
            color="red"
          >
            Đóng
          </CircleButton>
        </div>
      );
    }

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
  }, [isEditable, isCreate, isFromMyRequests, isLoading, disableSubmit, handleCancel, setEditMode, handleCreateUpdateRequest, canEdit]);

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
              title: isFromMyRequests ? "Đơn yêu cầu của tôi" : "Yêu cầu cập nhật",
              href: isFromMyRequests
                ? "/employee/my-update-requests?tab=1"
                : "/employee/update-requests?limit=10&page=1&tab=1",
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
          isEditable={isEditable && allowEdit}
          hideSubmitButton={true}
          onFormDataChange={handleFormDataChange}
          lockRequestedBy={isCreate && isFromMyRequests}
          requestedByDisplay={
            isCreate && isFromMyRequests && userProfile?.id
              ? {
                  id: userProfile.id,
                  fullName: userProfile.fullName,
                  email: userProfile.email,
                }
              : null
          }
        />
      </div>
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        {renderActionButton()}
      </div>
    </PageContainer>
  );
};

export default Index;
