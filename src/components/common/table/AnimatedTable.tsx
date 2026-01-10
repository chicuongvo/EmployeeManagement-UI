import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Table, type TablePaginationConfig } from "antd";
import "react-resizable/css/styles.css";
import type { TableProps } from "antd/lib";
import ResizableTitle from "./ResizableTitle";
// import CellNoteWrapper from "./CellNoteWrapper";

interface AnimatedTableProps<T> extends TableProps<T> {
    animationDuration?: number;
    staggerDelay?: number;
    skeletonRowLength?: number;
    isSuccess?: boolean;
    cellNote?: {
        objectCode?: string;
        objectType?: number;
    } | null;
}

const SkeletonCell = () => (
    <div className="skeleton-wrapper">
        <div className="skeleton-line" />
    </div>
);

const AnimatedTable = <T extends object>({
    dataSource,
    columns,
    animationDuration = 400,
    staggerDelay = 50,
    skeletonRowLength,
    isSuccess = true,
    cellNote,
    ...props
}: AnimatedTableProps<T>) => {
    const [showSkeleton, setShowSkeleton] = useState(!isSuccess);
    const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});

    useEffect(() => {
        setShowSkeleton(!isSuccess);
    }, [isSuccess]);

    const handleResize = useCallback(
        (index: number) =>
            (
                _: React.SyntheticEvent | unknown,
                { size }: { size: { width: number } }
            ) => {
                const column = columns?.[index];
                if (!!column?.key) {
                    setColumnWidths((prev) => {
                        const newMap = { ...prev };
                        newMap[column.key as string] = size.width;
                        return newMap;
                    });
                }
            },
        [setColumnWidths, columns]
    );

    const handleTableChange = useCallback(
        (pagination: any, filters: any, sorter: any, extra: any) => {
            if (props.onChange) {
                props.onChange(pagination, filters, sorter, extra);
            }
        },
        [props.onChange]
    );

    const skeletonData = useMemo(() => {
        const rowCount =
            skeletonRowLength ||
            (props.pagination as TablePaginationConfig)?.pageSize ||
            10;
        const colKeys = columns
            ?.map((c: any) => c?.dataIndex)
            .filter(Boolean) as string[];

        return Array.from({ length: rowCount }, (_, index) => ({
            key: `skeleton-${index}`,
            ...Object.fromEntries(colKeys.map((k) => [k, null])),
        }));
    }, [columns, props.pagination]);

    const enhancedData = useMemo(() => {
        return (
            dataSource?.map((item, index) => ({
                ...item,
                key: `data-${index}`,
                className: `animated-table-row fade-in-up`,
                style: {
                    animationDelay: `${index * staggerDelay}ms`,
                    animationDuration: `${animationDuration}ms`,
                },
            })) || []
        );
    }, [dataSource, staggerDelay, animationDuration]);

    const displayColumns = useMemo(() => {
        if (!columns?.length) return [];

        return columns.map((col: any, colIndex) => {
            const resizedWidth = columnWidths[col.key];
            const finalWidth = resizedWidth || col.width || 50;

            return {
                ...col,
                width: finalWidth,
                onHeaderCell: () => ({
                    width: finalWidth,
                    onResize: handleResize(colIndex),
                    isLast: colIndex === columns.length - 1,
                    minWidth: col.width || 50,
                    maxWidth: col.maxWidth,
                }),
                onCell: () => {
                    return {
                        className: "cell-with-note",
                        style: {
                            maxWidth: finalWidth,
                            minWidth: col.width || 50,
                        },
                    };
                },
                render: (value: any, record: T, rowIndex: number) => {
                    if (showSkeleton) {
                        return <SkeletonCell />;
                    }
                    const animationStyle = {
                        animationDelay: `${rowIndex * staggerDelay}ms`,
                        animationDuration: `${animationDuration}ms`,
                    };

                    return (
                        <>
                            <div
                                className={`animated-cell-content fade-in-up overflow-hidden    
              
                `}
                                style={{
                                    ...animationStyle,
                                }}
                            >
                                {col.render ? col.render(value, record, rowIndex) : value}
                            </div>
                            {/* <CellNoteWrapper col={col} record={record} cellNote={cellNote} /> */}
                        </>
                    );
                },
            };
        });
    }, [
        columns,
        showSkeleton,
        staggerDelay,
        animationDuration,
        columnWidths,
        cellNote,
    ]);

    return (
        <Table
            {...props}
            bordered
            components={{
                header: {
                    cell: ResizableTitle,
                },
            }}
            columns={displayColumns}
            dataSource={
                showSkeleton || !isSuccess
                    ? (skeletonData as T[])
                    : (enhancedData as T[])
            }
            onChange={handleTableChange}
            rowClassName={(record, index, indent) => {
                if (showSkeleton) {
                    return "";
                }

                const rowClass = props?.rowClassName;

                if (typeof rowClass === "string") {
                    return `animated-table-row fade-in-up ${rowClass}`;
                }

                if (typeof rowClass === "function") {
                    return `animated-table-row fade-in-up ${rowClass(
                        record,
                        index,
                        indent
                    )}`;
                }

                return "animated-table-row fade-in-up";
            }}
            loading={false}
        />
    );
};

export default AnimatedTable;
