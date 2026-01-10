import React, { useEffect, useMemo, useState } from "react";
import { Checkbox, Popover, Tooltip, Input, Divider } from "antd";
import { SearchOutlined, SettingOutlined } from "@ant-design/icons";
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
    useSortable,
    arrayMove,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ColumnsType } from "antd/es/table";
import { RiDragMoveFill } from "react-icons/ri";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import type { CheckboxProps } from "antd/lib";
import ColumnSettingsPopoverTabs from "./ColumnSettingsPopoverTabs";

interface Props {
    columns?: ColumnsType;
    visibleKeys?: string[];
    attributeKey?: string[];
    onChange: (newColumns: ColumnsType, visibleKeys: string[]) => void;
    enableTabs?: boolean;
    fixedColumns?: string[];
}

export default function ColumnSettingsPopover({
    columns = [],
    visibleKeys = [],
    onChange,
    attributeKey,
    enableTabs = false,
    fixedColumns = [],
}: Props) {
    const sensors = useSensors(useSensor(PointerSensor));
    const [checkedList, setCheckedList] = useState<string[]>(visibleKeys);
    const [sortedColumns, setSortedColumns] = useState<ColumnsType>(columns);
    const [isHovered, setIsHovered] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [checkAttribute, setCheckAttribute] = useState(false);

    useEffect(() => {
        setCheckedList(visibleKeys);
    }, [visibleKeys]);

    useEffect(() => {
        setSortedColumns(columns);
    }, [columns]);

    const handleCheckChange = (key: string, checked: boolean) => {
        const newCheckedList = checked
            ? [...checkedList, key]
            : checkedList.filter((k) => k !== key);
        setCheckedList(newCheckedList);
        onChange(sortedColumns, newCheckedList);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = sortedColumns.findIndex((item) => item.key === active.id);
        const newIndex = sortedColumns.findIndex((item) => item.key === over.id);
        const newColumns = arrayMove(sortedColumns, oldIndex, newIndex);
        setSortedColumns(newColumns);
        const newCheckedList = newColumns
            .filter((col) => checkedList.includes(col.key as string))
            .map((col) => col.key as string);
        setCheckedList(newCheckedList);
        onChange(newColumns, newCheckedList);
    };

    const filterAttributeColumns = useMemo(() => {
        if (!checkAttribute || !attributeKey) return sortedColumns;
        return sortedColumns.filter((col) =>
            attributeKey.includes(col.key as string)
        );
    }, [checkAttribute, attributeKey, sortedColumns]);

    const filteredColumns = filterAttributeColumns.filter((item) =>
        (item.title as string)
            ?.toLowerCase()
            .includes(searchText.trim().toLowerCase())
    );

    const allKeys = filteredColumns.map((col) => col.key as string);
    const isAllChecked =
        allKeys.length > 0 && allKeys.every((key) => checkedList.includes(key));
    const isIndeterminate =
        allKeys.some((key) => checkedList.includes(key)) && !isAllChecked;

    const handleCheckAll = (e: CheckboxChangeEvent) => {
        const checked = e.target.checked;
        const newCheckedList = checked
            ? Array.from(new Set([...checkedList, ...allKeys]))
            : checkedList.filter((key) => !allKeys.includes(key));
        setCheckedList(newCheckedList);
        onChange(sortedColumns, newCheckedList);
    };

    const onChangeAttribute: CheckboxProps["onChange"] = (e) => {
        setCheckAttribute(e.target.checked);
    };

    const content = (
        <div className="max-h-96 overflow-y-scroll" style={{ minWidth: 200 }}>
            <div className="relative">
                <SearchOutlined className="absolute top-1/2 transform -translate-y-[58%] text-gray-400 left-2 z-10" />
                <Input
                    placeholder={"Search"}
                    allowClear
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="mt-1 mb-2 pl-7 w-[200px]"
                />
            </div>
            {attributeKey && (
                <Checkbox value={checkAttribute} onChange={onChangeAttribute}>
                    Attribute
                </Checkbox>
            )}
            <Divider className="mt-1 mb-2.5" />
            <Checkbox
                indeterminate={isIndeterminate}
                checked={isAllChecked}
                onChange={handleCheckAll}
                className="mb-2"
            >
                Check all
            </Checkbox>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={filteredColumns.map((c) => c.key as string)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="flex flex-col gap-2">
                        {filteredColumns
                            ?.filter((item) => !fixedColumns.includes(item.key as string))
                            ?.map((item) => (
                                <SortableItem
                                    key={item.key}
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
    );

    if (enableTabs) {
        const subKeys = [
            {
                key: "attribute",
                label: "Attribute",
                subCols: attributeKey || [],
            },
            // {
            //   key: "new_attribute",
            //   label: t("New Attribute"),
            //   subCols: [],
            // },
        ];

        return (
            <ColumnSettingsPopoverTabs
                columns={columns}
                visibleKeys={visibleKeys}
                onChange={onChange}
                attributeKey={attributeKey}
                subKeys={subKeys}
            />
        );
    }

    return (
        <Popover
            content={content}
            trigger="click"
            placement="bottomRight"
            overlayStyle={{
                position: "fixed",
            }}
        >
            <Tooltip title={"Column Setting"}>
                <button
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="flex items-center justify-center w-8 h-8 rounded border border-gray-300 shadow-lg hover:border-[var(--color-green-1)] duration-200"
                >
                    <SettingOutlined
                        className={
                            isHovered
                                ? "rotate-infinite text-[var(--color-green-1)] duration-200"
                                : "text-zinc-500 duration-200"
                        }
                    />
                </button>
            </Tooltip>
        </Popover>
    );
}

interface SortableItemProps {
    id: string;
    label: string;
    checked: boolean;
    onCheckChange: (key: string, checked: boolean) => void;
}

export function SortableItem({
    id,
    label,
    checked,
    onCheckChange,
}: SortableItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            className="flex items-center justify-between gap-2 px-2 py-1 border rounded bg-white"
        >
            <Checkbox
                checked={checked}
                onChange={(e) => onCheckChange(id, e.target.checked)}
                value={id}
            >
                {label.length > 12 ? label.slice(0, 12) + "..." : label}
            </Checkbox>
            <span
                {...listeners}
                className="cursor-move flex items-center"
                style={{ paddingRight: 8 }}
            >
                <RiDragMoveFill />
            </span>
        </div>
    );
}
