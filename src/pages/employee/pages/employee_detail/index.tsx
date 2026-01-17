import { Form } from "antd";
// import GeneralInformation from "./components/GeneralInformation";
// import { usePOMDetailContext } from "./POMDetailContext";
// import { PageContainer } from "@ant-design/pro-components";
// import { useTranslation } from "react-i18next";
// import PageTitle from "@/components/shared/PageTitle";
// import CircleButton from "@/components/button/CircleButton";
import { MdEditSquare, MdSaveAs } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
// import { STATUS } from "@/constant/status";
// import Loading from "@/components/loading/Loading";
// import { useCallback, useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { POM_QUERY_KEY } from "@/constant/queryKey";
// import { useQueryClient } from "@tanstack/react-query";
// import MeasurementInformation from "./components/MeasurementInformation";
// import { MEASUREMENT } from "@/apis/measurements/models/Measurement";
// import { useCreatePOM, useUpdatePOM } from "@/apis/pom/createUpdatePOM";
// import { RESPONSE_CODE } from "@/constant/responseCode";
// import { v4 as uuid } from "uuid";
// import { getRelativeUrl } from "@/utils/getRelativeUrl";
// import { convertPrivateToPublicUrl } from "@/utils/convertPrivateToPublicUrl";

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
import { useNavigate } from "react-router-dom";
import PerformanceSection from "./components/PerformanceSection";

// export interface MeasurementInfo extends Partial<MEASUREMENT> {
//   uuid?: string;
//   isNew?: boolean;
//   isDeleted?: boolean;
//   isUpdated?: boolean;
//   oldData?: Partial<MEASUREMENT>;
// }

const Index = () => {
  const {
    employee,
    isCreate,
    isEditable,
    refetchEmployee,
    setEditMode,
    editMode,
  } = useEmployeeDetailContext();
  //   const { t } = useTranslation();
  const navigate = useNavigate();
  //   const {
  //     pom,
  //     measurements,
  //     isEditable,
  //     isCreate,
  //     editMode,
  //     setEditMode,
  //     isLoadingPOM,
  //     isLoadingMeasurement,
  //     refetchPOM,
  //     refetchMeasurement,
  //   } = usePOMDetailContext();
  //   const queryClient = useQueryClient();
  const [form] = Form.useForm();

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
    };
  }, [employee]);

  //   const initialMeasurementInfoValues: MeasurementInfo[] = useMemo(
  //     () =>
  //       measurements?.map((item) => ({
  //         ...item,
  //         uuid: uuid(),
  //       })),
  //     [measurements]
  //   );

  //   const setInitialInfo = useCallback(() => {
  //     setChangeInfoValue(initialGeneralInfoValues);
  //     setMeasurementInformation(initialMeasurementInfoValues);
  //   }, [initialGeneralInfoValues, initialMeasurementInfoValues]);

  //   useEffect(() => {
  //     setInitialInfo();
  //   }, [setInitialInfo]);

  const { mutate: createEmployee, isPending: isLoadingCreateEmployee } =
    useCreateEmployee({
      onSuccess: (res: any) => {
        refetchEmployee();
        navigate(`/employee/employees/${res.data.id}`);
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
      navigate("/employee/employees");
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
    [setChangeInfoValue]
  );

  console.log("changeInfoValue", changeInfoValue);

  const handleCreateUpdateEmployee = useCallback(() => {
    // Get form values to include departmentId and positionId
    const formValues = form.getFieldsValue();

    // Convert birthday from dayjs to ISO string
    const birthdayString = changeInfoValue.birthday
      ? dayjs(changeInfoValue.birthday).toISOString()
      : undefined;

    // Convert address to string (handle both AddressValue object and string)
    const convertAddressToString = (
      address: string | AddressValue | undefined
    ): string | undefined => {
      if (!address) return undefined;
      if (typeof address === "string") return address;
      if (typeof address === "object" && "fullAddress" in address) {
        return address.fullAddress;
      }
      return undefined;
    };

    const permanentAddressString = convertAddressToString(
      changeInfoValue.permanentAddress
    );
    const currentAddressString = convertAddressToString(
      changeInfoValue.currentAddress
    );

    if (isCreate) {
      // Prepare create payload
      const createPayload: CreateEmployeeRequest = {
        fullName: changeInfoValue.fullName as string,
        avatar: changeInfoValue.avatar,
        gender: changeInfoValue.gender as Gender,
        birthday: birthdayString as string,
        citizenId: changeInfoValue.citizenId as string,
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
      if (formValues.workStatus !== undefined) {
        updatePayload.workStatus = formValues.workStatus;
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

  //   const handleCreateUpdateSize = useCallback(() => {
  //     const payload = {
  //       id: pom?.id,
  //       ...changeInfoValue,
  //       image_url: getRelativeUrl(changeInfoValue.image_url || ""),
  //     };

  //     if (isCreate) {
  //       createPOM({
  //         ...payload,
  //         measurement_ids:
  //           measurementInformation
  //             ?.filter((item) => item.isNew)
  //             ?.map((item) => item.id || 0) || [],
  //       });
  //     } else {
  //       updatePOM({
  //         ...payload,
  //         add_measurement_ids:
  //           measurementInformation
  //             ?.filter((item) => (item.isNew || item.isUpdated) && !!item.id)
  //             ?.map((item) => item.id || 0) || [],
  //         del_measurement_ids:
  //           measurementInformation
  //             ?.filter((item) => (item.isDeleted || !!item.oldData) && !!item.id)
  //             ?.map((item) => item.oldData?.id || item.id || 0) || [],
  //       });
  //     }
  //   }, [pom, changeInfoValue, measurementInformation, isCreate]);

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

  // console.log("disableSubmit", disableSubmit);
  // console.log(
  //   "fullName:",
  //   !!changeInfoValue.fullName,
  //   changeInfoValue.fullName
  // );
  // console.log("gender:", !!changeInfoValue.gender, changeInfoValue.gender);
  // console.log(
  //   "birthday:",
  //   !!changeInfoValue.birthday,
  //   changeInfoValue.birthday
  // );
  // console.log(
  //   "citizenId:",
  //   !!changeInfoValue.citizenId,
  //   changeInfoValue.citizenId
  // );
  // console.log("avatar:", !!changeInfoValue.avatar, changeInfoValue.avatar);
  // console.log("phone:", !!changeInfoValue.phone, changeInfoValue.phone);
  // console.log("email:", !!changeInfoValue.email, changeInfoValue.email);
  // console.log(
  //   "permanentAddress:",
  //   !!changeInfoValue.permanentAddress,
  //   changeInfoValue.permanentAddress
  // );
  // console.log(
  //   "currentAddress:",
  //   !!changeInfoValue.currentAddress,
  //   changeInfoValue.currentAddress
  // );
  // console.log("siNo:", !!changeInfoValue.siNo, changeInfoValue.siNo);
  // console.log("hiNo:", !!changeInfoValue.hiNo, changeInfoValue.hiNo);
  // console.log(
  //   "bankAccount:",
  //   !!changeInfoValue.bankAccount,
  //   changeInfoValue.bankAccount
  // );
  // console.log(
  //   "resumeLink:",
  //   !!changeInfoValue.resumeLink,
  //   changeInfoValue.resumeLink
  // );
  // console.log(
  //   "healthCertificate:",
  //   !!changeInfoValue.healthCertificate,
  //   changeInfoValue.healthCertificate
  // );

  const renderActionButton = useCallback(() => {
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
            // setEditMode(true);
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
    isEditable,
    isCreate,
    disableSubmit,
    handleCreateUpdateEmployee,
    handleReset,
    isLoadingCreateEmployee,
    isLoadingUpdateEmployee,
  ]);

  return (
    <PageContainer
      //   loading={isLoadingPOM || isLoadingMeasurement}
      header={{
        breadcrumb: {
          items: [
            {
              title: "Hồ sơ nhân viên",
            },
            {
              title: "Chi tiết nhân viên",
              href: "/employee/employees?limit=10&page=1&tab=1",
            },
            {
              title: isCreate ? "Thêm mới" : "Chi tiết",
            },
          ],
        },
      }}
      title={<PageTitle title={`${isCreate ? "Thêm mới" : "Chi tiết"}`} />}
    >
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
          {!isCreate &&
            <div className="w-[300px] flex-shrink-0 flex-col gap-3">
              <BasicInformation />
              <PerformanceSection />
            </div>}
          <GeneralInformation
            changeInfoValue={changeInfoValue}
            initialValues={initialGeneralInfoValues as Partial<EMPLOYEE>}
            setChangeInfoValue={setChangeInfoValue}
          />
        </div>
      </Form>
      {/* <MeasurementInformation
        form={measurementForm}
        measurementInformation={measurementInformation}
        setMeasurementInformation={setMeasurementInformation}
        initialMeasurementInfoValues={initialMeasurementInfoValues}
      />*/}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        {renderActionButton()}
      </div>
      {/* <Loading isLoading={isLoadingPOM || isLoadingMeasurement} /> */}
    </PageContainer>
  );
};

export default Index;
