import { Modal } from "antd";
import { useContractContext } from "../ContractContext";
import { ContractForm } from "@/components/contract/ContractForm";
import { updateContract } from "@/services/contract";
import { toast } from "react-toastify";
import type { UpdateContractRequest } from "@/types/Contract";

const ModalEditContract = () => {
  const {
    popupEditContract,
    setPopupEditContract,
    selectedContract,
    setSelectedContract,
    refetch,
  } = useContractContext();

  const handleUpdate = async (
    data: UpdateContractRequest | FormData
  ) => {
    if (!selectedContract) return;

    try {
      await updateContract(selectedContract.id, data);
      toast.success("Cập nhật hợp đồng thành công!");
      setPopupEditContract(false);
      setSelectedContract(null);
      refetch();
    } catch (error: any) {
      console.error("Error updating contract:", error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi cập nhật hợp đồng"
      );
      throw error;
    }
  };

  const handleCancel = () => {
    setPopupEditContract(false);
    setSelectedContract(null);
  };

  if (!selectedContract) return null;

  return (
    <Modal
      title="Chỉnh sửa hợp đồng"
      open={popupEditContract}
      onCancel={handleCancel}
      width={800}
      footer={null}
      destroyOnClose
    >
      <ContractForm
        initialData={selectedContract}
        onSubmit={handleUpdate}
        onCancel={handleCancel}
        mode="edit"
      />
    </Modal>
  );
};

export default ModalEditContract;
