import axios from "axios";
import type { Province, District, Ward } from "./model/Address";

// Sử dụng API miễn phí từ provinces.open-api.vn
const BASE_URL = "https://provinces.open-api.vn/api";

const axiosAddress = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const getProvinces = async (): Promise<Province[]> => {
  try {
    const response = await axiosAddress.get<Province[]>("/p/");
    return response.data;
  } catch (error) {
    console.error("Error fetching provinces:", error);
    throw error;
  }
};

export const getDistrictsByProvince = async (
  provinceCode: string
): Promise<District[]> => {
  try {
    const response = await axiosAddress.get<any>(
      `/p/${provinceCode}?depth=2`
    );
    // API trả về province với districts bên trong
    return response.data.districts || [];
  } catch (error) {
    console.error("Error fetching districts:", error);
    throw error;
  }
};

export const getWardsByDistrict = async (
  districtCode: string
): Promise<Ward[]> => {
  try {
    const response = await axiosAddress.get<any>(
      `/d/${districtCode}?depth=2`
    );
    // API trả về district với wards bên trong
    return response.data.wards || [];
  } catch (error) {
    console.error("Error fetching wards:", error);
    throw error;
  }
};

// Helper function để lấy tên từ code
export const getProvinceName = async (
  provinceCode: string
): Promise<string | undefined> => {
  try {
    const response = await axiosAddress.get<Province>(`/p/${provinceCode}`);
    return response.data.name;
  } catch (error) {
    console.error("Error fetching province name:", error);
    return undefined;
  }
};

export const getDistrictName = async (
  districtCode: string
): Promise<string | undefined> => {
  try {
    const response = await axiosAddress.get<District>(`/d/${districtCode}`);
    return response.data.name;
  } catch (error) {
    console.error("Error fetching district name:", error);
    return undefined;
  }
};

export const getWardName = async (
  wardCode: string
): Promise<string | undefined> => {
  try {
    const response = await axiosAddress.get<Ward>(`/w/${wardCode}`);
    return response.data.name;
  } catch (error) {
    console.error("Error fetching ward name:", error);
    return undefined;
  }
};

