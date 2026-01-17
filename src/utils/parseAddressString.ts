import type {
  AddressValue,
  Province,
  District,
  Ward,
} from "@/apis/address/model/Address";
import {
  getProvinces,
  getDistrictsByProvince,
  getWardsByDistrict,
} from "@/apis/address/getAddress";

/**
 * Utility function để parse địa chỉ từ string thành AddressValue
 * Tìm kiếm bằng tên (string matching), không phải code
 * @param addressString - Chuỗi địa chỉ cần parse (ví dụ: "123 Đường ABC, Phường XYZ, Quận 1, TP. Hồ Chí Minh")
 * @returns Promise<AddressValue | undefined> - Object chứa thông tin địa chỉ đã parse
 */
export const parseAddressString = async (
  addressString: string | undefined | null
): Promise<AddressValue | undefined> => {
  if (!addressString || typeof addressString !== "string") {
    return undefined;
  }

  const normalizedAddress = addressString.trim();
  if (!normalizedAddress) {
    return undefined;
  }

  try {
    // Fetch tất cả provinces
    const provinces = await getProvinces();

    // Tìm province trong địa chỉ (tìm từ cuối lên vì thường ở cuối)
    let foundProvince: Province | undefined;
    let provinceIndex = -1;
    let provinceMatchLength = 0;

    for (const province of provinces) {
      // Tìm kiếm với nhiều cách viết: "TP. Hồ Chí Minh", "Hồ Chí Minh", "TP HCM", etc.
      const provinceVariations = [
        province.name,
        province.name.replace(/^(Tỉnh|Thành phố|TP\.?)\s*/i, ""),
        province.fullName,
        province.nameEn,
      ].filter((v): v is string => typeof v === "string" && v.length > 0);

      for (const variation of provinceVariations) {
        const lowerVariation = variation.toLowerCase();
        const lowerAddress = normalizedAddress.toLowerCase();
        const index = lowerAddress.lastIndexOf(lowerVariation);

        if (index !== -1) {
          // Ưu tiên match dài hơn và ở vị trí xa hơn về cuối
          if (
            index > provinceIndex ||
            (index === provinceIndex && variation.length > provinceMatchLength)
          ) {
            provinceIndex = index;
            provinceMatchLength = variation.length;
            foundProvince = province;
          }
        }
      }
    }

    if (!foundProvince) {
      // Nếu không tìm thấy province, trả về địa chỉ cụ thể
      return {
        specificAddress: normalizedAddress,
        fullAddress: normalizedAddress,
      };
    }

    // Fetch districts của province đã tìm thấy
    const districts = await getDistrictsByProvince(foundProvince.code);

    // Tìm district trong phần địa chỉ trước province
    const addressBeforeProvince = normalizedAddress
      .substring(0, provinceIndex)
      .trim();
    let foundDistrict: District | undefined;
    let districtIndex = -1;
    let districtMatchLength = 0;

    for (const district of districts) {
      const districtVariations = [
        district.name,
        district.name.replace(/^(Quận|Huyện|Thị xã|Thành phố)\s*/i, ""),
        district.fullName,
      ].filter((v): v is string => typeof v === "string" && v.length > 0);

      for (const variation of districtVariations) {
        const lowerVariation = variation.toLowerCase();
        const lowerAddressBeforeProvince = addressBeforeProvince.toLowerCase();
        const index = lowerAddressBeforeProvince.lastIndexOf(lowerVariation);

        if (index !== -1) {
          if (
            index > districtIndex ||
            (index === districtIndex && variation.length > districtMatchLength)
          ) {
            districtIndex = index;
            districtMatchLength = variation.length;
            foundDistrict = district;
          }
        }
      }
    }

    // Fetch wards của district nếu tìm thấy
    let foundWard: Ward | undefined;
    let wardIndex = -1;
    let wardMatchLength = 0;

    if (foundDistrict) {
      const wards = await getWardsByDistrict(foundDistrict.code);
      const addressBeforeDistrict = addressBeforeProvince
        .substring(0, districtIndex)
        .trim();

      for (const ward of wards) {
        const wardVariations = [
          ward.name,
          ward.name.replace(/^(Phường|Xã|Thị trấn)\s*/i, ""),
          ward.fullName,
        ].filter((v): v is string => typeof v === "string" && v.length > 0);

        for (const variation of wardVariations) {
          const lowerVariation = variation.toLowerCase();
          const lowerAddressBeforeDistrict =
            addressBeforeDistrict.toLowerCase();
          const index = lowerAddressBeforeDistrict.lastIndexOf(lowerVariation);

          if (index !== -1) {
            if (
              index > wardIndex ||
              (index === wardIndex && variation.length > wardMatchLength)
            ) {
              wardIndex = index;
              wardMatchLength = variation.length;
              foundWard = ward;
            }
          }
        }
      }
    }

    // Xác định địa chỉ cụ thể (phần còn lại sau khi loại bỏ ward, district, province)
    let specificAddress = normalizedAddress;
    if (foundWard && wardIndex !== -1) {
      const addressBeforeDistrict = addressBeforeProvince
        .substring(0, districtIndex)
        .trim();
      specificAddress = addressBeforeDistrict.substring(0, wardIndex).trim();
    } else if (foundDistrict && districtIndex !== -1) {
      specificAddress = addressBeforeProvince
        .substring(0, districtIndex)
        .trim();
    } else if (provinceIndex !== -1) {
      specificAddress = normalizedAddress.substring(0, provinceIndex).trim();
    }

    // Loại bỏ dấu phẩy thừa ở đầu/cuối
    specificAddress = specificAddress.replace(/^[,\s]+|[,\s]+$/g, "");

    // Build full address
    const parts = [
      specificAddress,
      foundWard?.name,
      foundDistrict?.name,
      foundProvince.name,
    ].filter(Boolean);
    const fullAddress = parts.join(", ");

    return {
      provinceCode: foundProvince.code,
      provinceName: foundProvince.name,
      districtCode: foundDistrict?.code,
      districtName: foundDistrict?.name,
      wardCode: foundWard?.code,
      wardName: foundWard?.name,
      specificAddress: specificAddress || undefined,
      fullAddress,
    };
  } catch (error) {
    console.error("Error parsing address:", error);
    // Trả về địa chỉ dạng string nếu có lỗi
    return {
      specificAddress: normalizedAddress,
      fullAddress: normalizedAddress,
    };
  }
};
