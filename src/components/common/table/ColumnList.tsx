import React from "react";
import { Checkbox, Input, Divider, Flex } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
    DndContext,
    useSensor,
    useSensors,
    PointerSensor,
    closestCenter,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { ColumnsType } from "antd/es/table";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { SortableItem } from "./ColumnSettingsPopover";

interface ColumnListProps {
    columns: ColumnsType;
    checkedList: string[];
    handleCheckChange: (key: string, checked: boolean) => void;
    handleCheckAll: (e: CheckboxChangeEvent) => void;
    handleDragEnd: (event: DragEndEvent) => void;
    checkAttributes?: boolean[];
    handleCheckAttribute?: (index: number) => void;
    searchText?: string;
    handleSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isAllChecked: boolean;
    isIndeterminate: boolean;
    title: string;
    showSearchBar?: boolean;
    subKeys?: {
        key: string;
        label: string;
        subCols: string[];
    }[];
}

const ColumnList = ({
    columns,
    checkedList,
    handleCheckChange,
    handleCheckAll,
    handleDragEnd,
    checkAttributes,
    handleCheckAttribute,
    searchText,
    handleSearch,
    isAllChecked,
    isIndeterminate,
    title,
    showSearchBar,
    subKeys,
}: ColumnListProps) => {
    const sensors = useSensors(useSensor(PointerSensor));

    return (
        <Flex className="overflow-y-scroll">
            <div className="min-w-[200px] flex flex-col mr-4">
                <div className="font-semibold mb-2">{title}</div>
                {showSearchBar && (
                    <div className="relative w-full">
                        <SearchOutlined className="absolute top-1/2 transform -translate-y-[58%] text-gray-400 left-2 z-10" />
                        <Input
                            placeholder={"Search"}
                            allowClear
                            value={searchText}
                            onChange={handleSearch}
                            className="mt-1 mb-2 pl-7 w-[200px]"
                        />
                    </div>
                )}
                {!!subKeys?.length &&
                    handleCheckAttribute &&
                    subKeys.map((key, idx) => (
                        <Checkbox
                            key={idx}
                            checked={checkAttributes ? checkAttributes[idx] : false}
                            onChange={() => handleCheckAttribute(idx)}
                            className="mb-2"
                        >
                            {key.label}
                        </Checkbox>
                    ))}
                <Divider className="mt-1 mb-2.5" />
                <Checkbox
                    indeterminate={isIndeterminate}
                    checked={isAllChecked}
                    onChange={handleCheckAll}
                    className="mb-2"
                >
                    {"Check all"}
                </Checkbox>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={columns.map((c) => c.key as string)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="flex flex-col gap-2">
                            {columns.map((item, idx) => (
                                <SortableItem
                                    key={`${item.key}-${idx}`}
                                    id={item.key as string}
                                    label={item.title as string}
                                    checked={checkedList.includes(item.key as string)}
                                    onCheckChange={handleCheckChange}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>
        </Flex>
    );
};

export default ColumnList;
