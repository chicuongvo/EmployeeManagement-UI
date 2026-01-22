import { PageContainer } from "@ant-design/pro-components";
import { useCallback, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PageTitle from "@/components/common/shared/PageTitle";
import { useContractDetailContext } from "./ContractDetailContext";
import { ContractForm } from "@/components/contract/ContractForm";
import { createContract, updateContract } from "@/services/contract";
import type { CreateContractRequest, UpdateContractRequest } from "@/types/Contract";
import type { ContractType, ContractStatus } from "@/types/Contract";
import { MdEditSquare, MdSaveAs } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import CircleButton from "@/components/common/button/CircleButton";

const Index = () => {
  const {
    contract,
    isCreate,
    isEditable,
    setEditMode,
    editMode,
    refetchContract,
    isLoadingContract,
  } = useContractDetailContext();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const isFromMyContracts = pathname.includes("my-contracts");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<{
    contractCode: string;
    type: ContractType;
    startDate: string;
    endDate: string;
    signedDate: string;
    status: ContractStatus;
    dailySalary: string;
    allowance: string;
    note: string;
    employeeId: string;
    signedById: string;
  }>({
    contractCode: contract?.contractCode || "",
    type: (contract?.type || "FULL_TIME") as ContractType,
    startDate: contract?.startDate ? contract.startDate.split("T")[0] : "",
    endDate: contract?.endDate ? contract.endDate.split("T")[0] : "",
    signedDate: contract?.signedDate ? contract.signedDate.split("T")[0] : "",
    status: (contract?.status || "DRAFT") as ContractStatus,
    dailySalary: contract?.dailySalary?.toString() || "",
    allowance: contract?.allowance?.toString() || "",
    note: contract?.note || "",
    employeeId: contract?.employeeId?.toString() || "",
    signedById: contract?.signedById?.toString() || "",
  });

  const handleCreate = async (
    data: CreateContractRequest | UpdateContractRequest | FormData
  ) => {
    try {
      setIsLoading(true);
      const result = await createContract(
        data as CreateContractRequest | FormData
      );
      toast.success("Tạo hợp đồng thành công!");

      if (isFromMyContracts) {
        // Nếu tạo trong ngữ cảnh "Hợp đồng của tôi" (sau này nếu có), quay về danh sách của tôi
        navigate("/employee/my-contracts");
      } else {
        navigate(`/employee/contracts/${result.id}`);
        refetchContract();
      }
    } catch (error: any) {
      console.error("Error creating contract:", error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi tạo hợp đồng"
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (
    data: CreateContractRequest | UpdateContractRequest | FormData
  ) => {
    if (!contract?.id) return;
    try {
      setIsLoading(true);
      await updateContract(
        contract.id,
        data as UpdateContractRequest | FormData
      );
      toast.success("Cập nhật hợp đồng thành công!");
      setEditMode(false);
      refetchContract();
    } catch (error: any) {
      console.error("Error updating contract:", error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi cập nhật hợp đồng"
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = useCallback(() => {
    if (isCreate) {
      navigate(isFromMyContracts ? "/employee/my-contracts" : "/employee/contracts");
      return;
    }
    if (editMode) {
      setEditMode(false);
      return;
    }
    // Đang ở màn chi tiết (không edit): quay lại danh sách tương ứng
    navigate(isFromMyContracts ? "/employee/my-contracts" : "/employee/contracts");
  }, [isCreate, navigate, editMode, setEditMode, isFromMyContracts]);

  const handleFormDataChange = useCallback((data: typeof formData) => {
    setFormData(data);
  }, []);

  const disableSubmit = useMemo(() => {
    if (isCreate) {
      const hasAllRequiredFields =
        formData.startDate &&
        formData.endDate &&
        formData.signedDate &&
        formData.dailySalary &&
        formData.allowance &&
        formData.employeeId &&
        formData.signedById;
      return !hasAllRequiredFields;
    }
    return false;
  }, [formData, isCreate]);

  const handleCreateUpdateContract = useCallback(() => {
    // Trigger form submit - ContractForm will handle the submit logic internally
    const form = document.getElementById("contract-form") as HTMLFormElement;
    if (form) {
      form.requestSubmit();
    }
  }, []);

  const renderActionButton = useCallback(() => {
    // Trang "Hợp đồng của tôi": chỉ xem, không cho sửa
    if (!isCreate && isFromMyContracts) {
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
            onClick={handleCreateUpdateContract}
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
    isFromMyContracts,
    isLoading,
    disableSubmit,
    handleCancel,
    setEditMode,
    handleCreateUpdateContract,
  ]);

  if (isLoadingContract) {
    return (
      <PageContainer>
        <div>Loading...</div>
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
              title: isFromMyContracts ? "Hợp đồng của tôi" : "Hợp đồng",
              href: isFromMyContracts
                ? "/employee/my-contracts?tab=1"
                : "/employee/contracts?limit=10&page=1&tab=1",
            },
            {
              title: isCreate ? "Thêm mới" : "Chi tiết",
            },
          ],
        },
      }}
      title={<PageTitle title={`${isCreate ? "Thêm mới" : "Chi tiết"} hợp đồng`} />}
    >
      <div className="px-6 my-3">
        <ContractForm
          initialData={contract || null}
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