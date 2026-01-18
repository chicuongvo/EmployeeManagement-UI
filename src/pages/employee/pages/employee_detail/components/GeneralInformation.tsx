/* eslint-disable react-refresh/only-export-components */
import React, { useCallback, useMemo } from "react";
import {
  Card,
  Collapse,
  DatePicker,
  Form,
  Input,
  Select,
  type InputProps,
} from "antd";
import type { TextAreaProps } from "antd/es/input";
import { useEmployeeDetailContext } from "../EmployeeDetailContex";
import type { EMPLOYEE, WorkStatus as WorkStatusType } from "@/apis/employee/model/Employee";
import ImageUpload from "@/components/common/form/ImageUpload";
import FileUpload from "@/components/common/form/FileUpload";
import SelectListEthnicity from "@/components/common/form/SelectListEthnicity";
import AutoCompleteReligion from "@/components/common/form/AutoCompleteReligion";
import AddressInput from "@/components/common/form/AddressInput";
import type { AddressValue } from "@/apis/address/model/Address";
import dayjs from "dayjs";
import SelectListDepartment from "@/components/common/form/SelectListDepartment";
import SelectListPosition from "@/components/common/form/SelectListPosition";
import { Link } from "react-router-dom";
// import ChangeStatus from "@/components/common/status/ChangeStatus";
import { WorkStatus } from "@/components/common/status";

const { TextArea } = Input;

export const FORM_FIELDS = {
  // ===== System & Identity =====
  ID: "id",
  EMPLOYEE_CODE: "employee_code",
  ROLE: "role",
  IS_ACTIVE: "is_active",
  PASSWORD: "password",
  CREATED_AT: "created_at",

  // ===== Personal Information =====
  FULL_NAME: "fullName",
  AVATAR: "avatar",
  GENDER: "gender",
  BIRTHDAY: "birthday",
  CITIZEN_ID: "citizenId",
  CITIZEN_ID_FRONT_IMAGE: "citizenIdFrontImage",
  CITIZEN_ID_BACK_IMAGE: "citizenIdBackImage",
  CITIZEN_ID_ISSUE_DATE: "citizenIdIssueDate",
  CITIZEN_ID_ISSUE_PLACE: "citizenIdIssuePlace",
  ETHNICITY: "ethnicity",
  RELIGION: "religion",
  MARITAL_STATUS: "maritalStatus",

  // ===== Contact Information =====
  PHONE: "phone",
  EMAIL: "email",
  PERMANENT_ADDRESS: "permanentAddress",
  CURRENT_ADDRESS: "currentAddress",

  // ===== Education & Skills =====
  EDUCATION: "education",
  MAJOR: "major",
  SCHOOL: "school",
  STUDY_PERIOD: "studyPeriod",
  DEGREE_CERTIFICATE: "degreeCertificate",
  FOREIGN_LANGUAGE_LEVEL: "foreignLanguageLevel",
  IT_SKILL_LEVEL: "itSkillLevel",

  // ===== Insurance & Finance =====
  SI_NO: "siNo",
  HI_NO: "hiNo",
  BANK_ACCOUNT: "bankAccount",

  // ===== Documents =====
  RESUME_LINK: "resumeLink",
  HEALTH_CERTIFICATE: "healthCertificate",

  // ===== Work Information (non-FK) =====
  WORK_STATUS: "workStatus",

  DEPARTMENT_ID: "departmentId",
  POSITION_ID: "positionId",
  ONBOARD_DATE: "onboardDate",
} as const;

const SYSTEM_FIELDS = [
  FORM_FIELDS.EMPLOYEE_CODE,
  FORM_FIELDS.CREATED_AT,
  FORM_FIELDS.IS_ACTIVE,
  FORM_FIELDS.EMPLOYEE_CODE,
  FORM_FIELDS.CREATED_AT,
  FORM_FIELDS.WORK_STATUS,
];

const CREATE_HIDDEN_FIELDS = [...SYSTEM_FIELDS];

const UPDATE_HIDDEN_FIELDS: string[] = [];

interface Props {
  changeInfoValue: Partial<EMPLOYEE>;
  initialValues: Partial<EMPLOYEE>;
  setChangeInfoValue: (value: Partial<EMPLOYEE>) => void;
}

const GeneralInformation = (_props: Props) => {
  const { isCreate, isEditable } = useEmployeeDetailContext();

  const getAddressValue = useCallback((
    address: string | AddressValue | undefined
  ): AddressValue | undefined => {
    if (!address) return undefined;
    if (typeof address === "object" && "provinceCode" in address) {
      return address as AddressValue;
    }
    return undefined;
  }, []);

  // Memoize gender options
  const genderOptions = useMemo(() => [
    { value: "MALE", label: "Nam" },
    { value: "FEMALE", label: "Nữ" },
    { value: "OTHER", label: "Khác" },
  ], []);

  // Memoize marital status options
  const maritalStatusOptions = useMemo(() => [
    { value: "SINGLE", label: "Độc thân" },
    { value: "MARRIED", label: "Đã kết hôn" },
    { value: "DIVORCED", label: "Ly dị" },
    { value: "WIDOWED", label: "Góa" },
  ], []);

  // Memoize education options
  const educationOptions = useMemo(() => [
    { value: "HIGH_SCHOOL", label: "Trung học phổ thông" },
    { value: "ASSOCIATE_DEGREE", label: "Cao đẳng" },
    { value: "BACHELOR_DEGREE", label: "Đại học" },
    { value: "MASTER_DEGREE", label: "Thạc sĩ" },
    { value: "DOCTORATE_DEGREE", label: "Tiến sĩ" },
    { value: "POST_DOCTORAL", label: "Sau tiến sĩ" },
    { value: "VOCATIONAL_TRAINING", label: "Dạy nghề" },
    { value: "OTHER", label: "Khác" },
  ], []);

  // Helper function to get form field config
  const getFieldConfig = useCallback((
    name: string,
    label: string,
    component: React.ReactNode,
    required = false
  ) => ({
    name,
    label,
    component,
    required,
  }), []);

  const renderInput = useCallback((
    label: string,
    value: string,
    inputType:
      | "text"
      | "email"
      | "password"
      | "number"
      | "tel"
      | "url"
      | "search"
      | "date"
      | "time"
      | "datetime-local"
      | "month"
      | "week"
      | "color"
      | "file"
      | "range"
      | "textarea" = "text",
    inputProps: InputProps | TextAreaProps = {}
  ) => {
    if (!isCreate && !isEditable) {
      return <span>{value || "-"}</span>;
    }

    if (inputType === "textarea") {
      const textAreaProps = inputProps as Omit<InputProps, "type"> &
        TextAreaProps;
      return (
        <TextArea placeholder={label} defaultValue={value} {...textAreaProps} />
      );
    }

    return (
      <Input
        placeholder={label}
        defaultValue={value}
        type={inputType}
        {...(inputProps as InputProps)}
      />
    );
  }, [isCreate, isEditable]);

  const renderSelect = useCallback((
    value: any,
    options: { value: any; label: string }[],
    placeholder: string,
    allowClear = false
  ) => {
    if (!isEditable) {
      const selectedOption = options.find(opt => opt.value === value);
      return <span>{selectedOption?.label || "-"}</span>;
    }
    return (
      <Select
        placeholder={placeholder}
        options={options}
        allowClear={allowClear}
      />
    );
  }, [isEditable, _props.initialValues]);

  const renderDatePicker = useCallback((
    value: any,
    format = "DD/MM/YYYY",
    placeholder: string
  ) => {
    if (!isEditable) {
      return <span>{value ? dayjs(value).format(format) : "-"}</span>;
    }
    return (
      <DatePicker
        format={format}
        placeholder={placeholder}
        className="w-full"
      />
    );
  }, [isEditable, _props.initialValues]);

  const renderImageUpload = useCallback((
    urlImage: string | undefined,
    onChange: (url: string | undefined) => void
  ) => {
    if (!isEditable) {
      return urlImage ? <img src={urlImage} alt="" className="w-[100px]" /> : <span>-</span>;
    }
    return <ImageUpload urlImage={urlImage} onChange={(url) => onChange(url ?? undefined)} />;
  }, [isEditable, _props.initialValues]);

  const renderFileUpload = useCallback((
    urlFile: string | undefined,
    placeholder: string,
    onChange: (url: string | undefined) => void
  ) => {
    if (!isEditable) {
      return <FileUpload urlFile={urlFile} placeholder={placeholder} disabled />;
    }
    return (
      <FileUpload
        urlFile={urlFile}
        placeholder={placeholder}
        onChange={(url) => onChange(url ?? undefined)}
      />
    );
  }, [isEditable, _props.initialValues]);

  const renderSelectListEthnicity = useCallback((
    value: string | undefined,
    onChange: (value: string) => void
  ) => {
    if (!isEditable) {
      return <span>{value || "-"}</span>;
    }
    return (
      <SelectListEthnicity
        placeholder="Chọn dân tộc"
        value={value}
        onChange={onChange}
      />
    );
  }, [isEditable, _props.initialValues]);

  const renderAutoCompleteReligion = useCallback((
    value: string | undefined,
    onChange: (value: string) => void
  ) => {
    if (!isEditable) {
      return <span>{value || "-"}</span>;
    }
    return (
      <AutoCompleteReligion
        placeholder="Chọn tôn giáo"
        value={value}
        onChange={onChange}
      />
    );
  }, [isEditable, _props.initialValues]);

  const renderDepartmentPositionField = useCallback((
    type: "department" | "position",
    id: number
  ) => {
    return isEditable ? (
      type === "department" ? (
        <SelectListDepartment
          placeholder="Chọn phòng ban"
          value={_props.initialValues.departmentId ?? undefined}
          onChange={(value: number) => {
            _props.setChangeInfoValue({
              ..._props.changeInfoValue,
              departmentId: value ?? undefined,
            });
          }}
        />
      ) : (
        <SelectListPosition
          placeholder="Chọn vị trí"
          value={_props.initialValues.positionId ?? undefined}
          onChange={(value: number) => {
            _props.setChangeInfoValue({
              ..._props.changeInfoValue,
              positionId: value ?? undefined,
            });
          }}
        />
      )
    ) : (
      (() => {
        const name = _props.initialValues[
          `${type}Name` as keyof typeof _props.initialValues
        ] as string | undefined;

        return name ? (
          <Link to={`/${type}/${id}`} className="text-green">
            {name}
          </Link>
        ) : (
          <span>-</span>
        );
      })()
    );
  }, [isEditable, _props.initialValues]);

  const renderAddress = useCallback((
    address: string | AddressValue | undefined,
    onChange: (value: AddressValue | undefined) => void
  ) => {
    return isEditable ? (
      <AddressInput
        placeholder={{
          province: "Chọn tỉnh/thành phố",
          district: "Chọn quận/huyện",
          ward: "Chọn phường/xã",
          specificAddress: "Nhập địa chỉ chi tiết",
        }}
        value={getAddressValue(address)}
        // defaultValue={extractAddressForDefaultValue(address)}
        onChange={onChange}
      />
    ) : (
      <span>{typeof address === "string" ? address : ""}</span>
    );
  }, [isEditable, getAddressValue, _props.initialValues]);

  const renderWorkStatus = useCallback((
    value: WorkStatusType | undefined,
    onChange: (value: WorkStatusType) => void
  ) => {
    if (!value) return <span>-</span>;

    return (
      <WorkStatus
        status={value}
      // enabledDropdown={isEditable}
      />
    );
  }, [isEditable, _props.initialValues]);

  const systemFields = useMemo(() => [
    getFieldConfig(
      FORM_FIELDS.EMPLOYEE_CODE,
      "Mã nhân viên",
      <span>{_props.initialValues.employeeCode || "-"}</span>
    ),
    getFieldConfig(
      FORM_FIELDS.CREATED_AT,
      "Ngày tạo",
      <span>
        {_props.initialValues.createdAt ? dayjs(_props.initialValues.createdAt).format("DD/MM/YYYY HH:mm:ss") : "-"}
      </span>
    ),
    getFieldConfig(
      FORM_FIELDS.DEPARTMENT_ID,
      "Phòng ban",
      renderDepartmentPositionField(
        "department",
        _props.initialValues.departmentId ?? 0
      )
    ),
    getFieldConfig(
      FORM_FIELDS.POSITION_ID,
      "Vị trí",
      renderDepartmentPositionField(
        "position",
        _props.initialValues.positionId ?? 0
      )
    ),
    getFieldConfig(
      FORM_FIELDS.WORK_STATUS,
      "Trạng thái làm việc",
      renderWorkStatus(
        _props.initialValues.workStatus,
        (value: WorkStatusType) => {
          _props.setChangeInfoValue({
            ..._props.changeInfoValue,
            workStatus: value,
          });
        }
      )
    ),
    getFieldConfig(
      FORM_FIELDS.ONBOARD_DATE,
      "Ngày nhận việc",
      renderDatePicker(
        _props.initialValues.onboardDate,
        "DD/MM/YYYY",
        "Chọn ngày nhận việc"
      ),
      true
    ),
  ], [isEditable, _props.initialValues, renderDepartmentPositionField, renderSelect, renderWorkStatus, renderDatePicker, _props.initialValues]);

  const personalFields = useMemo(() => [
    getFieldConfig(
      FORM_FIELDS.FULL_NAME,
      "Họ và tên",
      renderInput("Nhập họ và tên", _props.initialValues.fullName ?? ""),
      true
    ),
    getFieldConfig(
      FORM_FIELDS.GENDER,
      "Giới tính",
      renderSelect(
        _props.initialValues.gender,
        genderOptions,
        "Chọn giới tính"
      ),
      true
    ),
    getFieldConfig(
      FORM_FIELDS.BIRTHDAY,
      "Ngày sinh",
      renderDatePicker(
        _props.initialValues.birthday,
        "DD/MM/YYYY",
        "Chọn ngày sinh"
      ),
      true
    ),
    getFieldConfig(
      FORM_FIELDS.CITIZEN_ID,
      "CCCD/CMND",
      renderInput("Nhập số CCCD/CMND", _props.initialValues.citizenId ?? ""),
      true
    ),
    getFieldConfig(
      FORM_FIELDS.CITIZEN_ID_FRONT_IMAGE,
      "CCCD mặt trước",
      renderImageUpload(
        _props.initialValues.citizenIdFrontImage,
        (url) => {
          _props.setChangeInfoValue({
            ..._props.changeInfoValue,
            citizenIdFrontImage: url ?? undefined,
          });
        }
      ),
      true
    ),
    getFieldConfig(
      FORM_FIELDS.CITIZEN_ID_BACK_IMAGE,
      "CCCD mặt sau",
      renderImageUpload(
        _props.initialValues.citizenIdBackImage,
        (url) => {
          _props.setChangeInfoValue({
            ..._props.changeInfoValue,
            citizenIdBackImage: url ?? undefined,
          });
        }
      ),
      true
    ),
    getFieldConfig(
      FORM_FIELDS.CITIZEN_ID_ISSUE_DATE,
      "Ngày cấp",
      renderDatePicker(
        _props.initialValues.citizenIdIssueDate,
        "DD/MM/YYYY",
        "Chọn ngày cấp"
      ),
      true
    ),
    getFieldConfig(
      FORM_FIELDS.CITIZEN_ID_ISSUE_PLACE,
      "Nơi cấp",
      renderInput("Nhập nơi cấp", _props.initialValues.citizenIdIssuePlace ?? ""),
      true
    ),
    getFieldConfig(
      FORM_FIELDS.ETHNICITY,
      "Dân tộc",
      renderSelectListEthnicity(
        _props.initialValues.ethnicity ?? undefined,
        (value: string) => {
          _props.setChangeInfoValue({
            ..._props.changeInfoValue,
            ethnicity: value ?? undefined,
          });
        }
      )
    ),
    getFieldConfig(
      FORM_FIELDS.RELIGION,
      "Tôn giáo",
      renderAutoCompleteReligion(
        _props.initialValues.religion ?? undefined,
        (value: string) => {
          _props.setChangeInfoValue({
            ..._props.changeInfoValue,
            religion: value ?? undefined,
          });
        }
      )
    ),
    getFieldConfig(
      FORM_FIELDS.MARITAL_STATUS,
      "Tình trạng hôn nhân",
      renderSelect(
        _props.initialValues.maritalStatus,
        maritalStatusOptions,
        "Chọn tình trạng hôn nhân",
        true
      )
    ),
    getFieldConfig(
      FORM_FIELDS.AVATAR,
      "Ảnh đại diện",
      renderImageUpload(
        _props.initialValues.avatar,
        (url) => {
          _props.setChangeInfoValue({
            ..._props.changeInfoValue,
            avatar: url ?? undefined,
          });
        }
      ),
      true
    ),
  ], [isEditable, _props, genderOptions, maritalStatusOptions, renderInput, renderSelect, renderDatePicker, renderSelectListEthnicity, renderAutoCompleteReligion, renderImageUpload]);

  // Contact Information Fields
  const contactFields = useMemo(() => [
    getFieldConfig(
      FORM_FIELDS.PHONE,
      "Số điện thoại",
      renderInput("Nhập số điện thoại", _props.initialValues.phone ?? ""),
      true
    ),
    getFieldConfig(
      FORM_FIELDS.EMAIL,
      "Email",
      renderInput("Nhập email", _props.initialValues.email ?? ""),
      true
    ),
    getFieldConfig(
      FORM_FIELDS.PERMANENT_ADDRESS,
      "Địa chỉ thường trú",
      renderAddress(
        _props.initialValues.permanentAddress,
        (value: AddressValue | undefined) => {
          _props.setChangeInfoValue({
            ..._props.changeInfoValue,
            permanentAddress: value?.fullAddress ?? undefined,
          });
        }
      ),
      true
    ),
    getFieldConfig(
      FORM_FIELDS.CURRENT_ADDRESS,
      "Địa chỉ hiện tại",
      renderAddress(
        _props.initialValues.currentAddress,
        (value: AddressValue | undefined) => {
          _props.setChangeInfoValue({
            ..._props.changeInfoValue,
            currentAddress: value?.fullAddress ?? undefined,
          });
        }
      ),
      true
    ),
  ], [isEditable, _props.initialValues]);

  // Education & Skills Fields
  const educationFields = useMemo(() => [
    getFieldConfig(
      FORM_FIELDS.EDUCATION,
      "Trình độ học vấn",
      renderSelect(
        _props.initialValues.education,
        educationOptions,
        "Chọn trình độ học vấn"
      )
    ),
    getFieldConfig(
      FORM_FIELDS.SCHOOL,
      "Trường",
      renderInput("Nhập tên trường", _props.initialValues.school ?? "")
    ),
    getFieldConfig(
      FORM_FIELDS.MAJOR,
      "Chuyên ngành",
      renderInput("Nhập chuyên ngành", _props.initialValues.major ?? "")
    ),
    getFieldConfig(
      FORM_FIELDS.DEGREE_CERTIFICATE,
      "Bằng cấp",
      renderFileUpload(
        _props.initialValues.degreeCertificate,
        "Tải lên",
        (url) => {
          _props.setChangeInfoValue({
            ..._props.changeInfoValue,
            degreeCertificate: url ?? undefined,
          });
        }
      )
    ),
    getFieldConfig(
      FORM_FIELDS.FOREIGN_LANGUAGE_LEVEL,
      "Trình độ ngoại ngữ",
      renderInput("Nhập trình độ ngoại ngữ", _props.initialValues.foreignLanguageLevel ?? "")
    ),
    getFieldConfig(
      FORM_FIELDS.IT_SKILL_LEVEL,
      "Trình độ tin học",
      renderInput("Nhập trình độ tin học", _props.initialValues.itSkillLevel ?? "")
    ),
  ], [isEditable, _props, educationOptions, renderSelect, renderInput, renderFileUpload]);

  // Insurance & Finance Fields
  const insuranceFields = useMemo(() => [
    getFieldConfig(
      FORM_FIELDS.SI_NO,
      "Số thẻ BHXH",
      renderInput("Nhập số sổ BHXH", _props.initialValues.siNo ?? ""),
      true
    ),
    getFieldConfig(
      FORM_FIELDS.HI_NO,
      "Số thẻ BHYT",
      renderInput("Nhập số thẻ BHYT", _props.initialValues.hiNo ?? ""),
      true
    ),
    getFieldConfig(
      FORM_FIELDS.BANK_ACCOUNT,
      "Tài khoản ngân hàng",
      renderInput(
        "Tên ngân hàng, Tên tài khoản, Số tài khoản, Chi nhánh",
        _props.initialValues.bankAccount ?? "",
        "textarea",
        { rows: 3 }
      ),
      true
    ),
  ], [isEditable, _props.initialValues]);

  // Documents Fields
  const documentsFields = useMemo(() => [
    getFieldConfig(
      FORM_FIELDS.RESUME_LINK,
      "Sơ yếu lí lịch",
      renderFileUpload(
        _props.initialValues.resumeLink,
        "Tải lên",
        (url) => {
          _props.setChangeInfoValue({
            ..._props.changeInfoValue,
            resumeLink: url ?? undefined,
          });
        }
      ),
      true
    ),
    getFieldConfig(
      FORM_FIELDS.HEALTH_CERTIFICATE,
      "Giấy khám sức khỏe",
      renderFileUpload(
        _props.initialValues.healthCertificate,
        "Tải lên",
        (url) => {
          _props.setChangeInfoValue({
            ..._props.changeInfoValue,
            healthCertificate: url ?? undefined,
          });
        }
      ),
      true
    ),
  ], [isEditable, _props, renderFileUpload]);

  // Filter fields based on create/update mode
  const filterFields = useCallback((fields: typeof personalFields) => {
    if (isCreate) {
      return fields.filter(
        (field) =>
          !CREATE_HIDDEN_FIELDS.includes(
            field.name as (typeof CREATE_HIDDEN_FIELDS)[number]
          )
      );
    }
    return fields.filter(
      (field) =>
        !UPDATE_HIDDEN_FIELDS.includes(
          field.name as (typeof UPDATE_HIDDEN_FIELDS)[number]
        )
    );
  }, [isCreate]);

  const renderFormFields = useCallback((fields: typeof personalFields) => {
    const filteredFields = filterFields(fields);
    return (
      <div className="grid grid-cols-2 gap-x-16 gap-y-4 pb-2">
        {filteredFields.map((field) => (
          <Form.Item
            key={field.name}
            label={field.label}
            name={field.name}
            required={field.required}
          >
            {field.component}
          </Form.Item>
        ))}
      </div>
    );
  }, [filterFields, _props.initialValues]);

  const renderCollapse = useCallback((
    key: string,
    label: string,
    fields: typeof personalFields,
    className?: string
  ) => {
    return (
      <Collapse
        defaultActiveKey={[key]}
        bordered={false}
        className={`custom-collapse w-full ${className || ""}`}
        items={[
          {
            key,
            label: (
              <div className="relative">
                <b>{label}</b>
              </div>
            ),
            children: (
              <Card
                size="small"
                className="shadow-sm"
                styles={{ body: { padding: "16px" } }}
              >
                {renderFormFields(fields)}
              </Card>
            ),
          },
        ]}
      />
    );
  }, [renderFormFields]);

  const collapseList = useMemo(() => [
    {
      key: "0",
      label: "Thông tin hệ thống",
      fields: systemFields,
      //   hidden: isCreate,
    },
    {
      key: "1",
      label: "Thông tin cá nhân",
      fields: personalFields,
    },
    {
      key: "2",
      label: "Thông tin liên hệ",
      fields: contactFields,
    },
    {
      key: "3",
      label: "Học vấn & Kỹ năng",
      fields: educationFields,
    },
    {
      key: "4",
      label: "Bảo hiểm & Tài chính",
      fields: insuranceFields,
    },
    {
      key: "5",
      label: "Tài liệu",
      fields: documentsFields,
    },
  ], [systemFields, personalFields, contactFields, educationFields, insuranceFields, documentsFields]);

  return (
    <div className="w-full space-y-10 flex flex-col gap-5">
      {collapseList.map((collapse) =>
        renderCollapse(collapse.key, collapse.label, collapse.fields)
      )}
    </div>
  );
};

export default React.memo(GeneralInformation);