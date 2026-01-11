import { Select, Input } from "antd";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useCallback, useRef } from "react";
import {
  getProvinces,
  getDistrictsByProvince,
  getWardsByDistrict,
  getProvinceName,
  getDistrictName,
  getWardName,
  type AddressValue,
} from "@/apis/address";
import type { TextAreaProps } from "antd/es/input";

const { TextArea } = Input;

interface AddressInputProps {
  value?: AddressValue;
  onChange?: (value: AddressValue) => void;
  defaultValue?: string; // Format: "Province, District, Ward"
  placeholder?: {
    province?: string;
    district?: string;
    ward?: string;
    specificAddress?: string;
  };
  showLabels?: boolean;
  className?: string;
  specificAddressProps?: TextAreaProps;
  required?: boolean;
}

// Helper function to format address as string
export const formatAddressString = (address: AddressValue): string => {
  if (!address) return "";

  const parts = [
    address.specificAddress,
    address.wardName,
    address.districtName,
    address.provinceName,
  ].filter(Boolean);

  return parts.join(", ") || address.fullAddress || "";
};

const AddressInput = ({
  value,
  onChange,
  defaultValue,
  placeholder = {},
  showLabels = true,
  className = "",
  specificAddressProps = {},
  required = true,
}: AddressInputProps) => {
  const [provinceCode, setProvinceCode] = useState<string | undefined>(
    value?.provinceCode
  );
  const [districtCode, setDistrictCode] = useState<string | undefined>(
    value?.districtCode
  );
  const [wardCode, setWardCode] = useState<string | undefined>(value?.wardCode);
  const [specificAddress, setSpecificAddress] = useState<string>(
    value?.specificAddress || ""
  );

  // Fetch provinces
  const { data: provinces = [] } = useQuery({
    queryKey: ["provinces"],
    queryFn: getProvinces,
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
  });

  // Fetch districts when province is selected
  const { data: districts = [] } = useQuery({
    queryKey: ["districts", provinceCode],
    queryFn: () => {
      if (!provinceCode) return Promise.resolve([]);
      return getDistrictsByProvince(provinceCode);
    },
    enabled: !!provinceCode,
    staleTime: 1000 * 60 * 60 * 24,
  });

  // Fetch wards when district is selected
  const { data: wards = [] } = useQuery({
    queryKey: ["wards", districtCode],
    queryFn: () => {
      if (!districtCode) return Promise.resolve([]);
      return getWardsByDistrict(districtCode);
    },
    enabled: !!districtCode,
    staleTime: 1000 * 60 * 60 * 24,
  });

  // Load names for existing codes (for edit mode)
  useEffect(() => {
    const loadNames = async () => {
      if (value?.provinceCode && !value?.provinceName) {
        const name = await getProvinceName(value.provinceCode);
        if (name && onChange) {
          onChange({
            ...value,
            provinceName: name,
          });
        }
      }
      if (value?.districtCode && !value?.districtName) {
        const name = await getDistrictName(value.districtCode);
        if (name && onChange) {
          onChange({
            ...value,
            districtName: name,
          });
        }
      }
      if (value?.wardCode && !value?.wardName) {
        const name = await getWardName(value.wardCode);
        if (name && onChange) {
          onChange({
            ...value,
            wardName: name,
          });
        }
      }
    };
    loadNames();
  }, [value, onChange]);

  // Sync with external value changes
  useEffect(() => {
    if (value) {
      setProvinceCode(value.provinceCode);
      setDistrictCode(value.districtCode);
      setWardCode(value.wardCode);
      setSpecificAddress(value.specificAddress || "");
    }
  }, [value]);

  // Parse and store defaultValue names
  const defaultValueNamesRef = useRef<{
    province: string;
    district: string;
    ward: string;
  } | null>(null);
  const defaultValueProcessedRef = useRef(false);

  // Parse defaultValue string on mount
  useEffect(() => {
    if (!defaultValue || value || defaultValueProcessedRef.current) {
      return;
    }

    const parts = defaultValue
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
    if (parts.length >= 3) {
      defaultValueNamesRef.current = {
        province: parts[0],
        district: parts[1],
        ward: parts[2],
      };
    }
  }, [defaultValue, value]);

  // Match and set province from defaultValue
  useEffect(() => {
    if (
      !defaultValueNamesRef.current ||
      value ||
      defaultValueProcessedRef.current ||
      provinces.length == 0
    ) {
      return;
    }

    const { province: provinceName } = defaultValueNamesRef.current;

    // Find matching province (case-insensitive)
    const matchedProvince = provinces.find(
      (p) => p.name.toLowerCase() == provinceName.toLowerCase()
    );

    if (matchedProvince && !provinceCode) {
      setProvinceCode(matchedProvince.code);
    }
  }, [defaultValue, value, provinces, provinceCode]);

  // Match and set district from defaultValue
  useEffect(() => {
    if (
      !defaultValueNamesRef.current ||
      value ||
      defaultValueProcessedRef.current ||
      !provinceCode ||
      districts.length === 0
    ) {
      return;
    }

    const { district: districtName } = defaultValueNamesRef.current;

    // Find matching district (case-insensitive)
    const matchedDistrict = districts.find(
      (d) => d.name.toLowerCase() == districtName.toLowerCase()
    );

    if (matchedDistrict && !districtCode) {
      setDistrictCode(matchedDistrict.code);
    }
  }, [defaultValue, value, provinceCode, districts, districtCode]);

  // Match and set ward from defaultValue
  useEffect(() => {
    if (
      !defaultValueNamesRef.current ||
      value ||
      defaultValueProcessedRef.current ||
      !districtCode ||
      wards.length === 0
    ) {
      return;
    }

    const { ward: wardName } = defaultValueNamesRef.current;

    // Find matching ward (case-insensitive)
    const matchedWard = wards.find(
      (w) => w.name.toLowerCase() == wardName.toLowerCase()
    );

    if (matchedWard && !wardCode) {
      const matchedProvince = provinces.find((p) => p.code === provinceCode);
      const matchedDistrict = districts.find((d) => d.code === districtCode);

      setWardCode(matchedWard.code);
      defaultValueProcessedRef.current = true;

      // Call onChange with the complete AddressValue
      if (onChange && matchedProvince && matchedDistrict) {
        const newValue: AddressValue = {
          provinceCode: matchedProvince.code,
          provinceName: matchedProvince.name,
          districtCode: matchedDistrict.code,
          districtName: matchedDistrict.name,
          wardCode: matchedWard.code,
          wardName: matchedWard.name,
          fullAddress: [
            matchedWard.name,
            matchedDistrict.name,
            matchedProvince.name,
          ]
            .filter(Boolean)
            .join(", "),
        };
        onChange(newValue);
      }
    }
  }, [
    defaultValue,
    value,
    districtCode,
    wards,
    provinceCode,
    districts,
    provinces,
    wardCode,
    onChange,
  ]);

  const handleProvinceChange = useCallback(
    (code: string) => {
      setProvinceCode(code);
      setDistrictCode(undefined);
      setWardCode(undefined);

      const selectedProvince = provinces.find((p) => p.code === code);
      const newValue: AddressValue = {
        provinceCode: code,
        provinceName: selectedProvince?.name,
        districtCode: undefined,
        districtName: undefined,
        wardCode: undefined,
        wardName: undefined,
        specificAddress,
      };

      // Build full address
      if (selectedProvince) {
        newValue.fullAddress = specificAddress
          ? `${specificAddress}, ${selectedProvince.name}`
          : selectedProvince.name;
      }

      onChange?.(newValue);
    },
    [provinces, specificAddress, onChange]
  );

  const handleDistrictChange = useCallback(
    (code: string) => {
      setDistrictCode(code);
      setWardCode(undefined);

      const selectedDistrict = districts.find((d) => d.code === code);
      const selectedProvince = provinces.find((p) => p.code === provinceCode);
      const newValue: AddressValue = {
        provinceCode,
        provinceName: selectedProvince?.name,
        districtCode: code,
        districtName: selectedDistrict?.name,
        wardCode: undefined,
        wardName: undefined,
        specificAddress,
      };

      // Build full address
      if (selectedProvince && selectedDistrict) {
        const parts = [
          specificAddress,
          selectedDistrict.name,
          selectedProvince.name,
        ].filter(Boolean);
        newValue.fullAddress = parts.join(", ");
      }

      onChange?.(newValue);
    },
    [districts, provinces, provinceCode, specificAddress, onChange]
  );

  const handleWardChange = useCallback(
    (code: string) => {
      setWardCode(code);

      const selectedWard = wards.find((w) => w.code === code);
      const selectedDistrict = districts.find((d) => d.code === districtCode);
      const selectedProvince = provinces.find((p) => p.code === provinceCode);
      const newValue: AddressValue = {
        provinceCode,
        provinceName: selectedProvince?.name,
        districtCode,
        districtName: selectedDistrict?.name,
        wardCode: code,
        wardName: selectedWard?.name,
        specificAddress,
      };

      // Build full address
      if (selectedProvince && selectedDistrict && selectedWard) {
        const parts = [
          specificAddress,
          selectedWard.name,
          selectedDistrict.name,
          selectedProvince.name,
        ].filter(Boolean);
        newValue.fullAddress = parts.join(", ");
      }

      onChange?.(newValue);
    },
    [
      wards,
      districts,
      provinces,
      provinceCode,
      districtCode,
      specificAddress,
      onChange,
    ]
  );

  const handleSpecificAddressChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newSpecificAddress = e.target.value;
      setSpecificAddress(newSpecificAddress);

      const selectedProvince = provinces.find((p) => p.code === provinceCode);
      const selectedDistrict = districts.find((d) => d.code === districtCode);
      const selectedWard = wards.find((w) => w.code === wardCode);

      const newValue: AddressValue = {
        provinceCode,
        provinceName: selectedProvince?.name,
        districtCode,
        districtName: selectedDistrict?.name,
        wardCode,
        wardName: selectedWard?.name,
        specificAddress: newSpecificAddress,
      };

      // Build full address
      if (selectedProvince) {
        const parts = [
          newSpecificAddress,
          selectedWard?.name,
          selectedDistrict?.name,
          selectedProvince.name,
        ].filter(Boolean);
        newValue.fullAddress = parts.join(", ");
      }

      onChange?.(newValue);
    },
    [
      provinces,
      districts,
      wards,
      provinceCode,
      districtCode,
      wardCode,
      onChange,
    ]
  );

  const requiredIndicator =
    required !== false ? <span className="text-red-500">*</span> : null;

  console.log("specificAddress:", specificAddress);
  console.log("defaultValueNamesRef:", defaultValueNamesRef.current);
  console.log("defaultValue:", defaultValue);

  return (
    <div className={`grid grid-cols-2 gap-3 ${className}`}>
      {/* Province Select */}
      <div>
        {showLabels && (
          <label className="block mb-1 text-sm font-medium">
            Tỉnh/Thành phố {requiredIndicator}
          </label>
        )}
        <Select
          placeholder={placeholder.province || "Chọn tỉnh/thành phố"}
          value={provinceCode}
          onChange={handleProvinceChange}
          className="w-full"
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={provinces.map((p) => ({
            value: p.code,
            label: p.name,
          }))}
          allowClear
        />
      </div>

      {/* District Select */}
      <div>
        {showLabels && (
          <label className="block mb-1 text-sm font-medium">
            Quận/Huyện {requiredIndicator}
          </label>
        )}
        <Select
          placeholder={placeholder.district || "Chọn quận/huyện"}
          value={districtCode}
          onChange={handleDistrictChange}
          className="w-full"
          disabled={!provinceCode}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={districts.map((d) => ({
            value: d.code,
            label: d.name,
          }))}
          allowClear
        />
      </div>

      {/* Ward Select */}
      <div>
        {showLabels && (
          <label className="block mb-1 text-sm font-medium">
            Phường/Xã {requiredIndicator}
          </label>
        )}
        <Select
          placeholder={placeholder.ward || "Chọn phường/xã"}
          value={wardCode}
          onChange={handleWardChange}
          className="w-full"
          disabled={!districtCode}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={wards.map((w) => ({
            value: w.code,
            label: w.name,
          }))}
          allowClear
        />
      </div>

      {/* Specific Address Input */}
      <div>
        {showLabels && (
          <label className="block mb-1 text-sm font-medium">
            Địa chỉ cụ thể
          </label>
        )}
        <TextArea
          placeholder={
            placeholder.specificAddress || "Nhập số nhà, tên đường, ..."
          }
          value={specificAddress}
          onChange={handleSpecificAddressChange}
          rows={1}
          {...specificAddressProps}
          defaultValue={specificAddress}
        />
      </div>
    </div>
  );
};

export default AddressInput;
