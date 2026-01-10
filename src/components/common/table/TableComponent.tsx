import { useCallback, useEffect, useMemo, useState } from "react";
import type { TableProps, ColumnsType } from "antd/es/table";

import ColumnSettingsPopover from "./ColumnSettingsPopover";
import AnimatedTable from "./AnimatedTable";
import { COLUMN_KEYS } from "@/constant/columns";

interface TableComponentProps<T> extends TableProps<T> {
    onColumnChange?: (visibleKeys: string[], newColumn?: string) => void;
    activeKeys?: string[];
    setActiveKeys?: (keys: string[]) => void;
    fixedColumns?: string[];
    editColumnMode?: boolean;
    attributeKey?: string[];
    enableTabs?: boolean;
    hasColumnSettings?: boolean;
    useAnimation?: boolean;
    animationDuration?: number;
    staggerDelay?: number;
    skeletonRowLength?: number;
    isSuccess?: boolean;
    cellNote?: {
        objectCode?: string;
        objectType?: number;
    } | null;
}

function sortColumnsByKeys<T>(columns: ColumnsType<T>, keys?: string[]) {
    if (!keys) return columns;
    const keyIndex = new Map(keys.map((k, i) => [k, i]));
    return [...columns].sort((a, b) => {
        const aIdx = keyIndex.get(a.key as string) ?? Infinity;
        const bIdx = keyIndex.get(b.key as string) ?? Infinity;
        return aIdx - bIdx;
    });
}

const TableComponent = <T extends object>({
    onColumnChange,
    activeKeys,
    fixedColumns,
    setActiveKeys,
    editColumnMode,
    enableTabs = false,
    hasColumnSettings = true,
    useAnimation = true,
    animationDuration = 400,
    staggerDelay = 60,
    skeletonRowLength,
    isSuccess,
    cellNote,
    ...props
}: TableComponentProps<T>) => {
    const columns = props.columns as ColumnsType<T>;
    const [editColumn, setEditColumn] = useState<ColumnsType<T>>(
        sortColumnsByKeys(columns, activeKeys)
    );

    const handleColumnChange = useCallback(
        (newColumn: ColumnsType<T>, visible: string[]) => {
            setEditColumn(newColumn);
            setActiveKeys?.(visible);
        },
        [setActiveKeys]
    );
    const displayedColumns = useMemo(() => {
        let filtered = editColumn?.filter((col) =>
            activeKeys?.includes(col.key as string)
        );
        if (!editColumnMode) {
            filtered = filtered?.filter((col) => col.key !== COLUMN_KEYS.ACTION);
        }
        return filtered;
    }, [editColumn, activeKeys, editColumnMode]);

    const displayedActiveKeys = useMemo(() => {
        let filtered = activeKeys;
        if (!editColumnMode) {
            filtered = filtered?.filter((key) => key !== COLUMN_KEYS.ACTION);
        }
        return filtered;
    }, [activeKeys, editColumnMode]);

    useEffect(() => {
        if (columns || activeKeys) {
            setEditColumn(sortColumnsByKeys(columns, activeKeys));
        }
    }, [columns, activeKeys]);

    return (
        <>
            {hasColumnSettings && (
                <div className="flex justify-end mb-2">
                    <ColumnSettingsPopover
                        columns={editColumn}
                        visibleKeys={displayedActiveKeys}
                        onChange={handleColumnChange}
                        attributeKey={props.attributeKey}
                        enableTabs={enableTabs}
                        fixedColumns={fixedColumns}
                    />
                </div>
            )}
            <AnimatedTable
                {...props}
                columns={displayedColumns}
                animationDuration={animationDuration}
                staggerDelay={staggerDelay}
                pagination={props.pagination}
                rowKey={typeof props.rowKey === "string" ? props.rowKey : undefined}
                skeletonRowLength={skeletonRowLength}
                isSuccess={isSuccess}
                cellNote={cellNote}
            />
        </>
    );
};

export default TableComponent;
