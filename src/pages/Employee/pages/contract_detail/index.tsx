import { PageContainer } from "@ant-design/pro-components";
import { useCallback, useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Form, Tabs, type TabsProps } from "antd";
import PageTitle from "@/components/common/shared/PageTitle";
import { useContractDetailContext } from "./ContractDetailContext";
import { createContract, updateContract } from "@/services/contract";
import type {
  CreateContractRequest,
  UpdateContractRequest,
} from "@/types/Contract";
import { MdEditSquare, MdSaveAs } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import CircleButton from "@/components/common/button/CircleButton";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import BasicInformation from "./components/BasicInformation";
import GeneralInformation from "./components/GeneralInformation";
import AttachmentSection from "./components/AttachmentSection";
import dayjs from "dayjs";

export const TABS = {
  GENERAL_INFO: "1",
  ATTACHMENT: "2",
} as const;

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
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || TABS.GENERAL_INFO;
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [changeInfoValue, setChangeInfoValue] = useState<
    Record<string, unknown>
  >({});

  const handleCreate = useCallback(
    async (data: CreateContractRequest | UpdateContractRequest | FormData) => {
      try {
        setIsLoading(true);
        const result = await createContract(
          data as CreateContractRequest | FormData,
        );
        toast.success("Tạo hợp đồng thành công!");

        if (isFromMyContracts) {
          navigate("/employee/my-contracts");
        } else {
          navigate(`/management/contracts/${result.id}`);
          refetchContract();
        }
      } catch (error: unknown) {
        console.error("Error creating contract:", error);
        const errorMessage =
          error && typeof error === "object" && "response" in error
            ? (error as { response?: { data?: { message?: string } } }).response
                ?.data?.message
            : undefined;
        toast.error(errorMessage || "Có lỗi xảy ra khi tạo hợp đồng");
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [isFromMyContracts, navigate, refetchContract],
  );

  const handleUpdate = useCallback(
    async (data: CreateContractRequest | UpdateContractRequest | FormData) => {
      if (!contract?.id) return;
      try {
        setIsLoading(true);
        await updateContract(
          contract.id,
          data as UpdateContractRequest | FormData,
        );
        toast.success("Cập nhật hợp đồng thành công!");
        setEditMode(false);
        refetchContract();
      } catch (error: unknown) {
        console.error("Error updating contract:", error);
        const errorMessage =
          error && typeof error === "object" && "response" in error
            ? (error as { response?: { data?: { message?: string } } }).response
                ?.data?.message
            : undefined;
        toast.error(errorMessage || "Có lỗi xảy ra khi cập nhật hợp đồng");
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [contract?.id, setEditMode, refetchContract],
  );

  // Initialize form values when contract data is available
  useEffect(() => {
    if (contract) {
      const initialValues = {
        type: contract.type,
        status: contract.status,
        employeeId: contract.employeeId,
        signedById: contract.signedById,
        signedDate: contract.signedDate
          ? dayjs(contract.signedDate)
          : undefined,
        startDate: contract.startDate ? dayjs(contract.startDate) : undefined,
        endDate: contract.endDate ? dayjs(contract.endDate) : undefined,
        note: contract.note,
      };
      form.setFieldsValue(initialValues);
      setChangeInfoValue(initialValues);
    }
  }, [contract, form]);

  const initialValues = useMemo(() => {
    if (!contract) return {};
    return {
      type: contract.type,
      status: contract.status,
      employeeId: contract.employeeId,
      signedById: contract.signedById,
      signedDate: contract.signedDate ? dayjs(contract.signedDate) : undefined,
      startDate: contract.startDate ? dayjs(contract.startDate) : undefined,
      endDate: contract.endDate ? dayjs(contract.endDate) : undefined,
      note: contract.note,
    };
  }, [contract]);

  const handleFormValuesChange = useCallback(
    (_: unknown, allFields: Record<string, unknown>) => {
      setChangeInfoValue({
        ...allFields,
      });
    },
    [setChangeInfoValue],
  );

  const handleReset = useCallback(() => {
    if (isCreate) {
      navigate(
        isFromMyContracts ? "/employee/my-contracts" : "/management/contracts",
      );
      return;
    }
    if (editMode) {
      setEditMode(false);
    }
    form.setFieldsValue(initialValues);
  }, [
    isCreate,
    navigate,
    editMode,
    setEditMode,
    form,
    initialValues,
    isFromMyContracts,
  ]);

  const handleCreateUpdateContract = useCallback(() => {
    // Get form values
    const formValues = form.getFieldsValue();

    // Convert dates from dayjs to strings - handle both dayjs objects and strings
    const startDateString = changeInfoValue.startDate
      ? dayjs.isDayjs(changeInfoValue.startDate)
        ? changeInfoValue.startDate.format("YYYY-MM-DD")
        : dayjs(changeInfoValue.startDate as string).format("YYYY-MM-DD")
      : undefined;
    const endDateString = changeInfoValue.endDate
      ? dayjs.isDayjs(changeInfoValue.endDate)
        ? changeInfoValue.endDate.format("YYYY-MM-DD")
        : dayjs(changeInfoValue.endDate as string).format("YYYY-MM-DD")
      : undefined;
    const signedDateString = changeInfoValue.signedDate
      ? dayjs.isDayjs(changeInfoValue.signedDate)
        ? changeInfoValue.signedDate.format("YYYY-MM-DD")
        : dayjs(changeInfoValue.signedDate as string).format("YYYY-MM-DD")
      : undefined;

    // Create FormData for file upload
    const formDataToSend = new FormData();

    // Add file if selected
    if (selectedFile) {
      formDataToSend.append("attachment", selectedFile);
    }

    // Add form fields
    if (formValues.type) formDataToSend.append("type", formValues.type);
    if (startDateString) formDataToSend.append("startDate", startDateString);
    if (endDateString) formDataToSend.append("endDate", endDateString);
    if (signedDateString) formDataToSend.append("signedDate", signedDateString);
    if (formValues.status) formDataToSend.append("status", formValues.status);
    if (formValues.note) formDataToSend.append("note", formValues.note);
    if (formValues.employeeId)
      formDataToSend.append("employeeId", formValues.employeeId.toString());
    if (formValues.signedById)
      formDataToSend.append("signedById", formValues.signedById.toString());

    if (isCreate) {
      handleCreate(formDataToSend);
    } else {
      handleUpdate(formDataToSend);
    }
  }, [
    changeInfoValue,
    isCreate,
    form,
    selectedFile,
    handleCreate,
    handleUpdate,
  ]);

  const disableSubmit = useMemo(() => {
    if (isCreate) {
      const hasAllRequiredFields =
        changeInfoValue.startDate &&
        changeInfoValue.endDate &&
        changeInfoValue.signedDate &&
        changeInfoValue.employeeId &&
        changeInfoValue.signedById;
      return !hasAllRequiredFields;
    }
    return false;
  }, [changeInfoValue, isCreate]);

  const handleChangeTab = (key: string) => {
    setSearchParams({ tab: key });
  };

  const tabs: TabsProps["items"] = useMemo(() => {
    const items: TabsProps["items"] = [
      {
        key: TABS.GENERAL_INFO,
        label: "Thông tin chung",
        children: (
          <Form
            form={form}
            layout="horizontal"
            name="contract-information"
            labelCol={{
              style: { fontWeight: "500", width: 160, display: "flex" },
            }}
            initialValues={initialValues}
            onValuesChange={handleFormValuesChange}
          >
            <div className="flex flex-row gap-4 w-full px-6 my-3">
              {!isCreate && (
                <div className="w-[300px] flex-shrink-0">
                  <BasicInformation contract={contract} />
                </div>
              )}
              <div className="flex-1">
                <GeneralInformation
                  contract={contract}
                  isEditable={isEditable}
                  mode={isCreate ? "create" : "edit"}
                />
              </div>
            </div>
          </Form>
        ),
      },
      {
        key: TABS.ATTACHMENT,
        label: "File đính kèm",
        children: (
          <div className="px-6 my-3">
            <AttachmentSection
              contract={contract}
              isEditable={isEditable}
              onFileChange={setSelectedFile}
            />
          </div>
        ),
      },
    ];

    return items;
  }, [
    form,
    initialValues,
    handleFormValuesChange,
    isCreate,
    contract,
    isEditable,
    setSelectedFile,
  ]);

  const renderActionButton = useCallback(() => {
    // Only show action buttons on general info tab
    if (tab !== TABS.GENERAL_INFO) {
      return null;
    }

    // Trang "Hợp đồng của tôi": chỉ xem, không cho sửa
    if (!isCreate && isFromMyContracts) {
      return (
        <div className="w-fit mx-auto min-h-14 px-8 rounded-full bg-gray-300/20 backdrop-blur-md flex gap-2 justify-center items-center shadow-lg">
          <CircleButton
            onClick={handleReset}
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
            onClick={handleReset}
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
    tab,
    isEditable,
    isCreate,
    isFromMyContracts,
    isLoading,
    disableSubmit,
    handleReset,
    setEditMode,
    handleCreateUpdateContract,
  ]);

  const breadcrumbItems = useMemo(() => {
    return [
      {
        title: "Hồ sơ nhân sự",
      },
      {
        title: isFromMyContracts ? "Hợp đồng của tôi" : "Hợp đồng",
        href: isFromMyContracts
          ? "/employee/my-contracts?tab=1"
          : "/management/contracts?limit=10&page=1&tab=1",
      },
      {
        title: isCreate ? "Thêm mới" : "Chi tiết",
      },
    ];
  }, [isFromMyContracts, isCreate]);

  const pageTitle = useMemo(() => {
    return `${isCreate ? "Thêm mới" : "Chi tiết"} hợp đồng`;
  }, [isCreate]);

  if (isLoadingContract) {
    return (
      <Spin
        indicator={<LoadingOutlined className="text-primary-100" spin />}
        size="small"
      />
    );
  }

  return (
    <PageContainer
      header={{
        breadcrumb: {
          items: breadcrumbItems,
        },
      }}
      title={<PageTitle title={pageTitle} />}
    >
      <Tabs
        type="card"
        activeKey={tab}
        className="tag-ticket-list report-tab"
        onChange={handleChangeTab}
        items={tabs}
      />
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        {renderActionButton()}
      </div>
    </PageContainer>
  );
};

export default Index;
