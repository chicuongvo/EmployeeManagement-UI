import { Form, Tabs, type TabsProps } from "antd";
import { MdEditSquare, MdSaveAs } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";

import PageTitle from "@/components/common/shared/PageTitle";
import { PageContainer } from "@ant-design/pro-components";
import GeneralInformation from "./components/GeneralInformation";
import { useEmployeeDetailContext } from "./EmployeeDetailContex";
import type {
  EMPLOYEE,
  Gender,
  Education,
  MaritalStatus,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
} from "@/apis/employee/model/Employee";
import type { AddressValue } from "@/apis/address/model/Address";
import { useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import BasicInformation from "./components/BasicInformation";
import CircleButton from "@/components/common/button/CircleButton";
import { useCreateEmployee } from "@/apis/employee/createUpdateEmployee";
import { useUpdateEmployee } from "@/apis/employee/createUpdateEmployee";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import PerformanceSection from "./components/PerformanceSection";
import WorkHistoryTable from "./components/WorkHistoryTable";
import ContractTable from "./components/ContractTable";

export const TABS = {
  GENERAL_INFO: "1",
  WORK_HISTORY: "2",
  CONTRACT: "3",
} as const;

const Index = () => {
  const {
    employee,
    isCreate,
    isEditable,
    refetchEmployee,
    setEditMode,
    editMode,
  } = useEmployeeDetailContext();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const isMeRoute = pathname.includes("/me");
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || TABS.GENERAL_INFO;

  const [changeInfoValue, setChangeInfoValue] = useState<Partial<EMPLOYEE>>({});
  useEffect(() => {
    if (employee) {
      form.setFieldsValue({
        employeeCode: employee.employeeCode,
        fullName: employee.fullName,
        avatar: employee.avatar,
        gender: employee.gender,
        birthday: employee.birthday ? dayjs(employee.birthday) : undefined,
        citizenId: employee.citizenId,
        citizenIdIssueDate: employee.citizenIdIssueDate
          ? dayjs(employee.citizenIdIssueDate)
          : undefined,
        citizenIdIssuePlace: employee.citizenIdIssuePlace,
        ethnicity: employee.ethnicity,
        religion: employee.religion,
        maritalStatus: employee.maritalStatus,
        phone: employee.phone,
        email: employee.email,
        permanentAddress: employee.permanentAddress,
        currentAddress: employee.currentAddress,
        education: employee.education,
        school: employee.school,
        major: employee.major,
        studyPeriod: employee.studyPeriod,
        degreeCertificate: employee.degreeCertificate,
        foreignLanguageLevel: employee.foreignLanguageLevel,
        itSkillLevel: employee.itSkillLevel,
        siNo: employee.siNo,
        hiNo: employee.hiNo,
        bankAccount: employee.bankAccount,
        resumeLink: employee.resumeLink,
        healthCertificate: employee.healthCertificate,
        positionId: employee.positionId,
        departmentId: employee.departmentId,
        directManagerId: employee.directManagerId,
        citizenIdFrontImage: employee.citizenIdFrontImage,
        citizenIdBackImage: employee.citizenIdBackImage,
        onboardDate: employee.onboardDate
          ? dayjs(employee.onboardDate)
          : undefined,
      });
    }
  }, [employee, form]);

  const initialGeneralInfoValues = useMemo(() => {
    if (!employee) return {};

    return {
      employeeCode: employee.employeeCode,
      fullName: employee.fullName,
      avatar: employee.avatar,
      gender: employee.gender,
      birthday: employee.birthday ? dayjs(employee.birthday) : undefined,
      citizenId: employee.citizenId,
      citizenIdIssueDate: employee.citizenIdIssueDate
        ? dayjs(employee.citizenIdIssueDate)
        : undefined,
      citizenIdIssuePlace: employee.citizenIdIssuePlace,
      ethnicity: employee.ethnicity,
      religion: employee.religion,
      maritalStatus: employee.maritalStatus,
      phone: employee.phone,
      email: employee.email,
      permanentAddress: employee.permanentAddress,
      currentAddress: employee.currentAddress,
      education: employee.education,
      school: employee.school,
      major: employee.major,
      studyPeriod: employee.studyPeriod,
      degreeCertificate: employee.degreeCertificate,
      foreignLanguageLevel: employee.foreignLanguageLevel,
      itSkillLevel: employee.itSkillLevel,
      siNo: employee.siNo,
      hiNo: employee.hiNo,
      bankAccount: employee.bankAccount,
      resumeLink: employee.resumeLink,
      healthCertificate: employee.healthCertificate,
      positionId: employee.positionId,
      departmentId: employee.departmentId,
      directManagerId: employee.directManagerId,
      directManager: employee.directManager,
      positionName: employee.position?.name,
      departmentName: employee.department?.name,
      workStatus: employee.workStatus,
      isActive: employee.isActive,
      createdAt: employee.createdAt,
      citizenIdFrontImage: employee.citizenIdFrontImage,
      citizenIdBackImage: employee.citizenIdBackImage,
      onboardDate: employee.onboardDate
        ? dayjs(employee.onboardDate)
        : undefined,
    };
  }, [employee]);

  const { mutate: createEmployee, isPending: isLoadingCreateEmployee } =
    useCreateEmployee({
      onSuccess: (res: any) => {
        refetchEmployee();
        navigate(`/management/employees/${res.data.id}`);
      },
    });

  const { mutate: updateEmployee, isPending: isLoadingUpdateEmployee } =
    useUpdateEmployee(Number(employee?.id) || 0, {
      onSuccess: () => {
        refetchEmployee();
        setEditMode(false);
      },
    });

  const handleReset = useCallback(() => {
    if (isCreate) {
      navigate("/management/employees");
      return;
    }
    if (editMode) {
      setEditMode(false);
    }
    form.setFieldsValue(initialGeneralInfoValues);
  }, [
    isCreate,
    navigate,
    editMode,
    setEditMode,
    form,
    initialGeneralInfoValues,
  ]);

  const handleFormValuesChange = useCallback(
    (_: unknown, allFields: Partial<EMPLOYEE>) => {
      setChangeInfoValue({
        ...allFields,
      });
    },
    [setChangeInfoValue],
  );

  console.log("changeInfoValue", changeInfoValue);

  const handleCreateUpdateEmployee = useCallback(() => {
    // Get form values to include departmentId and positionId
    const formValues = form.getFieldsValue();

    // Convert birthday from dayjs to ISO string
    const birthdayString = changeInfoValue.birthday
      ? dayjs(changeInfoValue.birthday).toISOString()
      : undefined;

    const citizenIdIssueDateString = changeInfoValue.citizenIdIssueDate
      ? dayjs(changeInfoValue.citizenIdIssueDate).format("YYYY-MM-DD")
      : undefined;

    const onboardDateString = changeInfoValue.onboardDate
      ? dayjs(changeInfoValue.onboardDate).format("YYYY-MM-DD")
      : undefined;

    const convertAddressToString = (
      address: string | AddressValue | undefined,
    ): string | undefined => {
      if (!address) return undefined;
      if (typeof address === "string") return address;
      if (typeof address === "object" && "fullAddress" in address) {
        return address.fullAddress;
      }
      return undefined;
    };

    const permanentAddressString = convertAddressToString(
      changeInfoValue.permanentAddress,
    );
    const currentAddressString = convertAddressToString(
      changeInfoValue.currentAddress,
    );

    if (isCreate) {
      // Prepare create payload
      const createPayload: CreateEmployeeRequest = {
        fullName: changeInfoValue.fullName as string,
        avatar: changeInfoValue.avatar,
        gender: changeInfoValue.gender as Gender,
        birthday: birthdayString as string,
        citizenId: changeInfoValue.citizenId as string,
        citizenIdIssueDate: citizenIdIssueDateString,
        citizenIdIssuePlace: changeInfoValue.citizenIdIssuePlace,
        phone: changeInfoValue.phone as string,
        email: changeInfoValue.email as string,
        ethnicity: changeInfoValue.ethnicity,
        religion: changeInfoValue.religion,
        education: changeInfoValue.education as Education | undefined,
        major: changeInfoValue.major,
        siNo: changeInfoValue.siNo,
        hiNo: changeInfoValue.hiNo,
        resumeLink: changeInfoValue.resumeLink,
        bankAccount: changeInfoValue.bankAccount,
        maritalStatus: changeInfoValue.maritalStatus as
          | MaritalStatus
          | undefined,
        permanentAddress: permanentAddressString,
        currentAddress: currentAddressString,
        school: changeInfoValue.school,
        studyPeriod: changeInfoValue.studyPeriod,
        degreeCertificate: changeInfoValue.degreeCertificate,
        foreignLanguageLevel: changeInfoValue.foreignLanguageLevel,
        itSkillLevel: changeInfoValue.itSkillLevel,
        healthCertificate: changeInfoValue.healthCertificate,
        departmentId:
          formValues.departmentId || employee?.departmentId || undefined,
        positionId: formValues.positionId || employee?.positionId || 0,
        directManagerId:
          formValues.directManagerId || employee?.directManagerId || undefined,
        citizenIdFrontImage: changeInfoValue.citizenIdFrontImage,
        citizenIdBackImage: changeInfoValue.citizenIdBackImage,
        onboardDate: onboardDateString,
      };

      createEmployee(createPayload);
    } else {
      // Prepare update payload - only include changed fields
      const updatePayload: UpdateEmployeeRequest = {};

      if (changeInfoValue.fullName !== undefined) {
        updatePayload.fullName = changeInfoValue.fullName;
      }
      if (changeInfoValue.avatar !== undefined) {
        updatePayload.avatar = changeInfoValue.avatar;
      }
      if (changeInfoValue.gender !== undefined) {
        updatePayload.gender = changeInfoValue.gender as Gender;
      }
      if (birthdayString) {
        updatePayload.birthday = birthdayString;
      }
      if (changeInfoValue.citizenId !== undefined) {
        updatePayload.citizenId = changeInfoValue.citizenId;
      }
      if (citizenIdIssueDateString) {
        updatePayload.citizenIdIssueDate = citizenIdIssueDateString;
      }
      if (changeInfoValue.citizenIdIssuePlace !== undefined) {
        updatePayload.citizenIdIssuePlace = changeInfoValue.citizenIdIssuePlace;
      }
      if (changeInfoValue.phone !== undefined) {
        updatePayload.phone = changeInfoValue.phone;
      }
      if (changeInfoValue.email !== undefined) {
        updatePayload.email = changeInfoValue.email;
      }
      if (changeInfoValue.ethnicity !== undefined) {
        updatePayload.ethnicity = changeInfoValue.ethnicity;
      }
      if (changeInfoValue.religion !== undefined) {
        updatePayload.religion = changeInfoValue.religion;
      }
      if (changeInfoValue.education !== undefined) {
        updatePayload.education = changeInfoValue.education as Education;
      }
      if (changeInfoValue.major !== undefined) {
        updatePayload.major = changeInfoValue.major;
      }
      if (changeInfoValue.siNo !== undefined) {
        updatePayload.siNo = changeInfoValue.siNo;
      }
      if (changeInfoValue.hiNo !== undefined) {
        updatePayload.hiNo = changeInfoValue.hiNo;
      }
      if (changeInfoValue.resumeLink !== undefined) {
        updatePayload.resumeLink = changeInfoValue.resumeLink;
      }
      if (changeInfoValue.bankAccount !== undefined) {
        updatePayload.bankAccount = changeInfoValue.bankAccount;
      }
      if (changeInfoValue.maritalStatus !== undefined) {
        updatePayload.maritalStatus =
          changeInfoValue.maritalStatus as MaritalStatus;
      }
      if (changeInfoValue.permanentAddress !== undefined) {
        updatePayload.permanentAddress = permanentAddressString;
      }
      if (changeInfoValue.currentAddress !== undefined) {
        updatePayload.currentAddress = currentAddressString;
      }
      if (changeInfoValue.school !== undefined) {
        updatePayload.school = changeInfoValue.school;
      }
      if (changeInfoValue.studyPeriod !== undefined) {
        updatePayload.studyPeriod = changeInfoValue.studyPeriod;
      }
      if (changeInfoValue.degreeCertificate !== undefined) {
        updatePayload.degreeCertificate = changeInfoValue.degreeCertificate;
      }
      if (changeInfoValue.foreignLanguageLevel !== undefined) {
        updatePayload.foreignLanguageLevel =
          changeInfoValue.foreignLanguageLevel;
      }
      if (changeInfoValue.itSkillLevel !== undefined) {
        updatePayload.itSkillLevel = changeInfoValue.itSkillLevel;
      }
      if (changeInfoValue.healthCertificate !== undefined) {
        updatePayload.healthCertificate = changeInfoValue.healthCertificate;
      }
      if (formValues.departmentId !== undefined) {
        updatePayload.departmentId = formValues.departmentId;
      }
      if (formValues.positionId !== undefined) {
        updatePayload.positionId = formValues.positionId;
      }
      if (formValues.directManagerId !== undefined) {
        updatePayload.directManagerId = formValues.directManagerId;
      }
      if (formValues.workStatus !== undefined) {
        updatePayload.workStatus = formValues.workStatus;
      }
      if (changeInfoValue.citizenIdFrontImage !== undefined) {
        updatePayload.citizenIdFrontImage = changeInfoValue.citizenIdFrontImage;
      }
      if (changeInfoValue.citizenIdBackImage !== undefined) {
        updatePayload.citizenIdBackImage = changeInfoValue.citizenIdBackImage;
      }
      if (onboardDateString !== undefined) {
        updatePayload.onboardDate = onboardDateString;
      }

      updateEmployee(updatePayload);
    }
  }, [
    changeInfoValue,
    isCreate,
    form,
    employee,
    createEmployee,
    updateEmployee,
  ]);

  const disableSubmit = useMemo(() => {
    if (isCreate) {
      const hasAllRequiredFields =
        changeInfoValue.fullName &&
        changeInfoValue.gender &&
        changeInfoValue.birthday &&
        changeInfoValue.citizenId &&
        changeInfoValue.avatar &&
        changeInfoValue.phone &&
        changeInfoValue.email &&
        changeInfoValue.citizenIdIssueDate &&
        changeInfoValue.citizenIdIssuePlace &&
        changeInfoValue.onboardDate &&
        changeInfoValue.permanentAddress &&
        changeInfoValue.currentAddress &&
        changeInfoValue.siNo &&
        changeInfoValue.hiNo &&
        changeInfoValue.bankAccount &&
        changeInfoValue.resumeLink &&
        changeInfoValue.healthCertificate;

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
            name="general-information"
            labelCol={{
              style: { fontWeight: "500", width: 160, display: "flex" },
            }}
            initialValues={initialGeneralInfoValues}
            onValuesChange={handleFormValuesChange}
          >
            <div className="flex flex-row gap-4 w-full px-6 my-3 ">
              {!isCreate && (
                <div className="w-[300px] flex-shrink-0 flex-col gap-3">
                  <BasicInformation />
                  <PerformanceSection />
                </div>
              )}
              <GeneralInformation
                changeInfoValue={changeInfoValue}
                initialValues={initialGeneralInfoValues as Partial<EMPLOYEE>}
                setChangeInfoValue={setChangeInfoValue}
              />
            </div>
          </Form>
        ),
      },
    ];

    // Only show work history and contract tabs when not in create mode (employee exists)
    if (!isCreate && employee) {
      items.push({
        key: TABS.WORK_HISTORY,
        label: "Lịch sử công việc",
        children: <WorkHistoryTable />,
      });
      items.push({
        key: TABS.CONTRACT,
        label: "Hợp đồng",
        children: <ContractTable />,
      });
    }

    return items;
  }, [
    form,
    initialGeneralInfoValues,
    handleFormValuesChange,
    isCreate,
    employee,
    changeInfoValue,
    setChangeInfoValue,
  ]);

  const renderActionButton = useCallback(() => {
    // Only show action buttons on general info tab
    if (tab !== TABS.GENERAL_INFO) {
      return null;
    }

    if (isEditable) {
      return (
        <div className="w-fit mx-auto min-h-14 px-8 rounded-full bg-gray-300/20 backdrop-blur-md flex gap-2 justify-center items-center shadow-lg">
          <CircleButton
            icon={<MdSaveAs size={32} className="icon-hover-effect" />}
            key="save"
            color="green"
            onClick={handleCreateUpdateEmployee}
            disabled={disableSubmit}
            loading={isLoadingCreateEmployee || isLoadingUpdateEmployee}
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
    // if ([STATUS.PENDING, STATUS.ACTIVE].includes(Number(pom?.status) || 0)) {
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
    // }
    // return null;
  }, [
    tab,
    isEditable,
    isCreate,
    disableSubmit,
    handleCreateUpdateEmployee,
    handleReset,
    isLoadingCreateEmployee,
    isLoadingUpdateEmployee,
    setEditMode,
  ]);

  const breadcrumbItems = useMemo(() => {
    if (isMeRoute) {
      return [
        {
          title: "Thông tin cá nhân",
        },
        {
          title: "Hồ sơ cá nhân",
        },
      ];
    }
    return [
      {
        title: "Hồ sơ nhân viên",
      },
      {
        title: "Chi tiết nhân viên",
        href: "/management/employees?limit=10&page=1&tab=1",
      },
      {
        title: isCreate ? "Thêm mới nhân viên" : "Chi tiết nhân viên",
      },
    ];
  }, [isMeRoute, isCreate]);

  const pageTitle = useMemo(() => {
    if (isMeRoute) {
      return "Hồ sơ cá nhân";
    }
    return isCreate ? "Thêm mới nhân viên" : "Chi tiết nhân viên";
  }, [isMeRoute, isCreate]);

  return (
    <PageContainer
      //   loading={isLoadingPOM || isLoadingMeasurement}
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