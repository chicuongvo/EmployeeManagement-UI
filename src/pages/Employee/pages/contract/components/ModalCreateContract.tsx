import { Modal } from "antd";
import { useContractContext } from "../ContractContext";
import { ContractForm } from "@/components/contract/ContractForm";
import { createContract } from "@/services/contract";
import { toast } from "react-toastify";
import type {
  CreateContractRequest,
  UpdateContractRequest,
} from "@/types/Contract";

const ModalCreateContract = () => {
  const { popupCreateContract, setPopupCreateContract, refetch } =
    useContractContext();

  const handleCreate = async (
    data: CreateContractRequest | UpdateContractRequest | FormData,
  ) => {
    try {
      await createContract(data as CreateContractRequest | FormData);
      toast.success("Tạo hợp đồng thành công!");
      setPopupCreateContract(false);
      refetch();
    } catch (error: unknown) {
      console.error("Error creating contract:", error);
      const errorMessage =
        error instanceof Object &&
        "response" in error &&
        error.response instanceof Object &&
        "data" in error.response &&
        error.response.data instanceof Object &&
        "message" in error.response.data
          ? (error.response.data.message as string)
          : "Có lỗi xảy ra khi tạo hợp đồng";
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleCancel = () => {
    setPopupCreateContract(false);
  };

  return (
    <Modal
      title={<span className="text-lg font-semibold">Tạo hợp đồng mới</span>}
      open={popupCreateContract}
      onCancel={handleCancel}
      width={900}
      footer={null}
      destroyOnClose
      styles={{
        body: {
          paddingTop: "24px",
          maxHeight: "calc(100vh - 200px)",
          overflowY: "auto",
        },
      }}
    >
      <ContractForm
        onSubmit={handleCreate}
        onCancel={handleCancel}
        mode="create"
      />
    </Modal>
  );
};

export default ModalCreateContract;
