import React, { useEffect, useState } from "react";
import { Modal, Divider, Spin, Empty } from "antd";
import { HolderOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PrimaryButton from "@/components/common/button/PrimaryButton";
import { useDepartmentContext } from "../DepartmentContext";
import { getListRole, useUpdateRoleLevels } from "@/apis/role";
import type { ROLE } from "@/apis/role/model/Role";

interface SortableItemProps {
    role: ROLE;
    index: number;
}

const SortableItem: React.FC<SortableItemProps> = ({ role, index }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: role.id });

    const hasChanged = role.level !== (index + 1);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1000 : 1,
        opacity: isDragging ? 1 : 1,
    };

    return (
        <div className="flex items-center gap-3 mb-3 group">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 font-bold transition-colors ${isDragging ? "border-green text-green" : hasChanged ? "border-green-300 text-green-500 bg-green-50" : "border-gray-100 text-gray-300 group-hover:border-gray-200 group-hover:text-gray-400"
                }`}>
                {index + 1}
            </div>
            <div
                ref={setNodeRef}
                style={style}
                className={`flex-grow flex items-center p-3 border rounded-xl select-none transition-all ${isDragging
                    ? "border-green bg-green/5 shadow-lg scale-[1.02]"
                    : hasChanged
                        ? "border-green-200 bg-green-50/50 shadow-sm hover:border-green-300 hover:shadow-md"
                        : "bg-white border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md"
                    }`}
            >
                <div
                    {...attributes}
                    {...listeners}
                    className="mr-3 cursor-grab active:cursor-grabbing text-gray-400 hover:text-green-500 transition-colors p-1"
                >
                    <HolderOutlined style={{ fontSize: '18px' }} />
                </div>
                <div className="flex-grow font-semibold text-gray-700">{role.name}</div>
                <div className="px-2 py-0.5 bg-gray-50 text-[10px] text-gray-400 uppercase tracking-wider font-bold rounded border border-gray-100">
                    Hiện tại: {role.level ?? "N/A"}
                </div>
            </div>
        </div>
    );
};

const ModalChangeRoleLevel: React.FC = () => {
    const {
        isChangeRoleLevelModalOpen,
        setIsChangeRoleLevelModalOpen,
        refetch: refetchMainList,
    } = useDepartmentContext();

    const [roles, setRoles] = useState<ROLE[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const sensors = useSensors(useSensor(PointerSensor));

    const fetchActiveRoles = async () => {
        setIsLoading(true);
        try {
            const response = await getListRole({
                status: "ACTIVE",
                limit: 1000,
                sort: "level:asc",
            });
            setRoles(response.data.data);
        } catch (error) {
            console.error("Failed to fetch roles:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isChangeRoleLevelModalOpen) {
            fetchActiveRoles();
        }
    }, [isChangeRoleLevelModalOpen]);

    const handleClose = () => {
        setIsChangeRoleLevelModalOpen(false);
        setRoles([]);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setRoles((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over?.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const { mutate: updateLevels, isPending: isSaving } = useUpdateRoleLevels({
        onSuccess: () => {
            refetchMainList();
            handleClose();
        },
    });

    const handleSave = () => {
        const roleIds = roles.map((r) => r.id);
        updateLevels({ roleIds });
    };

    const hasAnyChange = roles.some((role, index) => role.level !== index + 1);

    return (
        <Modal
            open={isChangeRoleLevelModalOpen}
            onCancel={handleClose}
            title={
                <div className="!text-lg font-medium">
                    Sửa thứ tự cấp bậc
                    <Divider className="!mt-2 !mb-0" />
                </div>
            }
            footer={
                <div className="flex justify-end gap-2 p-2 pt-0">
                    <PrimaryButton
                        className="bg-transparent border text-gray-500 border-gray-300 hover:bg-gray-50"
                        onClick={handleClose}
                        icon={<CloseOutlined />}
                    >
                        Hủy
                    </PrimaryButton>
                    <PrimaryButton
                        color="green"
                        onClick={handleSave}
                        loading={isSaving}
                        icon={<SaveOutlined />}
                        disabled={roles.length === 0 || !hasAnyChange}
                    >
                        Lưu thay đổi
                    </PrimaryButton>
                </div>
            }
            width={500}
            destroyOnClose
        >
            <p className="text-[12px] text-zinc-400 mt-4 italic">
                * Kéo thả để thay đổi vị trí. Thứ tự từ trên xuống dưới tương ứng với cấp bậc từ cao đến thấp.
            </p>
            <div className="mt-4 min-h-[300px] max-h-[60vh] overflow-y-auto px-1">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Spin size="large" />
                        <span className="text-gray-400">Đang tải danh sách cấp bậc...</span>
                    </div>
                ) : roles.length > 0 ? (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={roles.map((r) => r.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="flex flex-col">
                                {roles.map((role, index) => (
                                    <SortableItem key={role.id} role={role} index={index} />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                ) : (
                    <div className="py-20">
                        <Empty description="Không có cấp bậc nào đang hoạt động" />
                    </div>
                )}
            </div>

        </Modal>
    );
};

export default ModalChangeRoleLevel;
