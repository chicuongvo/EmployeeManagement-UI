import { PageContainer } from "@ant-design/pro-components";
import { useCallback, useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import PageTitle from "@/components/common/shared/PageTitle";
import { useUpdateRequestDetailContext } from "./UpdateRequestDetailContext";
import { UpdateRequestForm } from "@/components/update-request/UpdateRequestForm";
import {
  createUpdateRequest,
  updateUpdateRequest,
  reviewRequest,
} from "@/services/update-request";
import type {
  CreateUpdateRequestRequest,
  UpdateUpdateRequestRequest,
} from "@/types/UpdateRequest";
import { MdEditSquare, MdSaveAs } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
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
  const isFromManagement = pathname.includes("/management/");
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
      setFormData((prev) => ({
        ...prev,
        requestedById: userProfile.id,
      }));
    }
  }, [isCreate, isFromMyRequests, userProfile?.id]);

  const handleCreate = async (
    data: CreateUpdateRequestRequest | UpdateUpdateRequestRequest,
  ) => {
    try {
      setIsLoading(true);
      const result = await createUpdateRequest(
        data as CreateUpdateRequestRequest,
      );
      toast.success("Tạo yêu cầu cập nhật thành công!");

      if (isFromMyRequests) {
        // Nếu tạo từ trang "Đơn yêu cầu của tôi" thì quay lại danh sách của tôi
        navigate("/employee/my-update-requests");
      } else if (isFromManagement) {
        // Ngữ cảnh quản lý: đi tới trang chi tiết management
        navigate(`/management/update-requests/${result.id}`);
        refetchUpdateRequest();
      } else {
        // Ngữ cảnh employee: đi tới trang chi tiết employee
        navigate(`/employee/update-requests/${result.id}`);
        refetchUpdateRequest();
      }
    } catch (error: unknown) {
      console.error("Error creating update request:", error);
      let errorMessage = "Có lỗi xảy ra khi tạo yêu cầu cập nhật";
      if (error && typeof error === "object" && "response" in error) {
        const response = (
          error as { response?: { data?: { message?: string } } }
        ).response;
        if (response?.data?.message) {
          errorMessage = response.data.message;
        }
      }
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (
    data: CreateUpdateRequestRequest | UpdateUpdateRequestRequest,
  ) => {
    if (!updateRequest?.id) return;
    try {
      setIsLoading(true);
      await updateUpdateRequest(
        updateRequest.id,
        data as UpdateUpdateRequestRequest,
      );
      toast.success("Cập nhật yêu cầu thành công!");
      setEditMode(false);
      refetchUpdateRequest();
    } catch (error: unknown) {
      console.error("Error updating update request:", error);
      let errorMessage = "Có lỗi xảy ra khi cập nhật yêu cầu";
      if (error && typeof error === "object" && "response" in error) {
        const response = (
          error as { response?: { data?: { message?: string } } }
        ).response;
        if (response?.data?.message) {
          errorMessage = response.data.message;
        }
      }
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleReview = useCallback(
    async (status: "APPROVED" | "NOT_APPROVED") => {
      if (!updateRequest?.id) return;
      try {
        setIsLoading(true);
        await reviewRequest(updateRequest.id, { status });
        toast.success(
          `Yêu cầu đã được ${status === "APPROVED" ? "phê duyệt" : "từ chối"}`,
        );
        refetchUpdateRequest();
      } catch (error: unknown) {
        console.error("Error reviewing update request:", error);
        let errorMessage = "Có lỗi xảy ra khi xử lý yêu cầu";
        if (error && typeof error === "object" && "response" in error) {
          const response = (
            error as { response?: { data?: { message?: string } } }
          ).response;
          if (response?.data?.message) {
            errorMessage = response.data.message;
          }
        }
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [updateRequest?.id, refetchUpdateRequest],
  );

  const handleCancel = useCallback(() => {
    if (isCreate) {
      if (isFromMyRequests) {
        navigate("/employee/my-update-requests");
      } else if (isFromManagement) {
        navigate("/management/update-requests");
      } else {
        navigate("/employee/update-requests");
      }
      return;
    }
    if (editMode) {
      setEditMode(false);
      return;
    }
    // Đang ở màn chi tiết (không edit): quay lại danh sách tương ứng
    if (isFromMyRequests) {
      navigate("/employee/my-update-requests");
    } else if (isFromManagement) {
      navigate("/management/update-requests");
    } else {
      navigate("/employee/update-requests");
    }
  }, [
    isCreate,
    navigate,
    editMode,
    setEditMode,
    isFromMyRequests,
    isFromManagement,
  ]);

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

  // Ở module "Đơn yêu cầu của tôi" thì chỉ cho xem, không cho sửa (trừ khi đang tạo mới)
  // Ở module Management thì cho phép sửa tất cả
  const allowEdit = useMemo(() => {
    if (isCreate) return true; // Khi tạo mới thì luôn cho phép edit
    if (isFromManagement) return true; // Management có thể sửa tất cả
    return !isFromMyRequests; // Employee context: chỉ cho edit nếu không phải từ "Đơn yêu cầu của tôi"
  }, [isFromMyRequests, isFromManagement, isCreate]);

  const handleCreateUpdateRequest = useCallback(() => {
    // Trigger form submit - UpdateRequestForm will handle the submit logic internally
    const form = document.getElementById(
      "update-request-form",
    ) as HTMLFormElement;
    if (form) {
      form.requestSubmit();
    }
  }, []);

  const canEdit = useMemo(() => {
    if (!allowEdit) return false;
    if (isCreate) return true;
    if (isFromManagement) return true; // Management có thể sửa tất cả trạng thái
    return updateRequest?.status === "PENDING"; // Employee chỉ sửa được PENDING
  }, [allowEdit, isCreate, isFromManagement, updateRequest?.status]);

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

    // Nếu là Management và status là PENDING, hiển thị nút Approve/Reject
    if (isFromManagement && !isCreate && updateRequest?.status === "PENDING") {
      return (
        <div className="w-fit mx-auto min-h-14 px-8 rounded-full bg-gray-300/20 backdrop-blur-md flex gap-2 justify-center items-center shadow-lg">
          <CircleButton
            icon={
              <CheckCircleOutlined size={32} className="icon-hover-effect" />
            }
            key="approve"
            color="green"
            type="button"
            onClick={() => handleReview("APPROVED")}
            disabled={isLoading}
            loading={isLoading}
          >
            Phê duyệt
          </CircleButton>
          <CircleButton
            icon={
              <CloseCircleOutlined size={32} className="icon-hover-effect" />
            }
            key="reject"
            color="red"
            type="button"
            onClick={() => handleReview("NOT_APPROVED")}
            disabled={isLoading}
          >
            Từ chối
          </CircleButton>
          {canEdit && (
            <CircleButton
              onClick={() => {
                setEditMode(true);
              }}
              icon={<MdEditSquare size={32} className="icon-hover-effect" />}
              key="edit"
              type="button"
              color="blue"
            >
              Sửa
            </CircleButton>
          )}
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
  }, [
    isEditable,
    isCreate,
    isFromMyRequests,
    isFromManagement,
    isLoading,
    disableSubmit,
    handleCancel,
    setEditMode,
    handleCreateUpdateRequest,
    handleReview,
    updateRequest?.status,
    canEdit,
  ]);

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
              title: isFromManagement ? "Quản lý nhân sự" : "Hồ sơ nhân sự",
            },
            {
              title: isFromMyRequests
                ? "Đơn yêu cầu của tôi"
                : isFromManagement
                  ? "Quản lí yêu cầu cập nhật"
                  : "Yêu cầu cập nhật",
              href: isFromMyRequests
                ? "/employee/my-update-requests?tab=1"
                : isFromManagement
                  ? "/management/update-requests"
                  : "/employee/update-requests?limit=10&page=1&tab=1",
            },
            {
              title: isCreate ? "Thêm mới" : "Chi tiết",
            },
          ],
        },
      }}
      title={
        <PageTitle
          title={`${isCreate ? "Thêm mới" : "Chi tiết"} yêu cầu cập nhật`}
        />
      }
    >
      <div className="px-6 my-3">
        <UpdateRequestForm
          initialData={updateRequest || null}
          onSubmit={isCreate ? handleCreate : handleUpdate}
          onCancel={handleCancel}
          isLoading={isLoading}
          mode={isCreate ? "create" : "edit"}
          isEditable={allowEdit}
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
