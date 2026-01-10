import axiosApi from "@/utils/axiosApi";

export const deletePosition = async (id: number): Promise<void> => {
  await axiosApi.delete(`/position/${id}`);
};

