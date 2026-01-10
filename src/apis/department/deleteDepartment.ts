import axiosApi from "@/utils/axiosApi";

export const deleteDepartment = async (id: number): Promise<void> => {
  await axiosApi.delete(`/department/${id}`);
};

