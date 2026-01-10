import { useEffect, useMemo, useState, type ChangeEvent, type SetStateAction } from "react";
import { Popover, Tooltip, Flex } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import type { ColumnsType } from "antd/es/table";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import ColumnList from "./ColumnList";
import { COLUMN_KEYS } from "@/constant/columns";

interface Props {
    columns?: ColumnsType;
    visibleKeys?: string[];
    attributeKey?: string[];
    onChange: (newColumns: ColumnsType, visibleKeys: string[]) => void;
    subKeys: {
        key: string;
        label: string;
        subCols: string[];
    }[];
}

const ColumnSettingsPopoverTabs = ({
    columns = [],
    visibleKeys = [],
    onChange,
    attributeKey,
    subKeys,
}: Props) => {
    const [checkedGeneral, setCheckedGeneral] = useState<string[]>([]);
    const [checkedAttributes, setCheckedAttributes] = useState<string[][]>(
        new Array(subKeys.length).fill([])
    );
    const [checkAttributes, setCheckAttributes] = useState<boolean[]>(
        new Array(subKeys.length).fill(false)
    );

    const [sortedColumns, setSortedColumns] = useState<ColumnsType>(columns);
    const [isHovered, setIsHovered] = useState(false);
    const [searchTextGeneral, setSearchTextGeneral] = useState("");
    const [searchTexts, setSearchTexts] = useState<string[]>(
        new Array(subKeys.length).fill("")
    );

    useEffect(() => {
        setCheckedGeneral(
            visibleKeys?.filter(
                (key) => !subKeys.some((sub) => sub.subCols.includes(key))
            ) ?? []
        );
        setCheckedAttributes(
            subKeys.map(
                (sub) => visibleKeys?.filter((key) => sub.subCols.includes(key)) ?? []
            )
        );
    }, [visibleKeys, attributeKey]);

    useEffect(() => {
        setSortedColumns(columns);
    }, [columns]);

    const filterColumnsBySearch = (
        columns: ColumnsType,
        searchText: string,
        enableSearch: boolean
    ) => {
        if (!enableSearch || !searchText.trim()) return columns;
        return columns.filter((item) =>
            (item.title as string)
                ?.toLowerCase()
                .includes(searchText.trim().toLowerCase())
        );
    };

    const generalColumns = useMemo(() => {
        return sortedColumns.filter(
            (col) => !attributeKey?.includes(col.key as string)
        );
    }, [sortedColumns, attributeKey]);

    const attributeColumns = useMemo(() => {
        return sortedColumns.filter((col) =>
            attributeKey?.includes(col.key as string)
        );
    }, [sortedColumns, attributeKey]);

    const filteredGeneralColumns = useMemo(
        () => filterColumnsBySearch(generalColumns, searchTextGeneral, true),
        [generalColumns, searchTextGeneral]
    );

    const filteredAttributeColumns = useMemo(
        () =>
            subKeys.map((sub, idx) => {
                const subCols = attributeColumns.filter((col) =>
                    sub.subCols.includes(col.key as string)
                );

                return filterColumnsBySearch(subCols, searchTexts[idx], true);
            }),
        [attributeColumns, searchTexts, subKeys]
    );

    const allGeneralKeys = filteredGeneralColumns.map((col) => col.key as string);
    const isAllGeneralChecked =
        allGeneralKeys.length > 0 &&
        allGeneralKeys.every((key) => checkedGeneral.includes(key));
    const isGeneralIndeterminate =
        allGeneralKeys.some((key) => checkedGeneral.includes(key)) &&
        !isAllGeneralChecked;

    const handleGeneralCheckChange = (key: string, checked: boolean) => {
        const newChecked = checked
            ? [...checkedGeneral, key]
            : checkedGeneral.filter((k) => k !== key);
        setCheckedGeneral(newChecked.filter((key) => key !== COLUMN_KEYS.ACTION));
        onChange(sortedColumns, [...newChecked, ...checkedAttributes.flat(), COLUMN_KEYS.ACTION]);
    };

    const handleAttributeCheckChange = (
        subKeyIdx: number,
        key: string,
        checked: boolean
    ) => {
        const newChecked = checked
            ? [...checkedAttributes[subKeyIdx], key]
            : checkedAttributes[subKeyIdx].filter((k) => k !== key);
        const newCheckedAttributes = [...checkedAttributes];

        newCheckedAttributes[subKeyIdx] = newChecked;
        setCheckedAttributes(newCheckedAttributes);
        onChange(sortedColumns, [
            ...checkedGeneral,
            ...newCheckedAttributes.flat(),
            COLUMN_KEYS.ACTION,
        ]);
    };

    const handleGeneralCheckAll = (e: CheckboxChangeEvent) => {
        const checked = e.target.checked;
        const newChecked = checked ? allGeneralKeys : [];
        setCheckedGeneral(newChecked.filter((key) => key !== COLUMN_KEYS.ACTION));
        onChange(sortedColumns, [...newChecked, ...checkedAttributes.flat(), COLUMN_KEYS.ACTION]);
    };

    const handleAttributeCheckAll = (
        subKeyIdx: number,
        e: CheckboxChangeEvent
    ) => {
        const checked = e.target.checked;
        const allKeys = filteredAttributeColumns[subKeyIdx].map(
            (col) => col.key as string
        );
        const newChecked = checked ? allKeys : [];

        const newCheckedAttributes = [...checkedAttributes];
        newCheckedAttributes[subKeyIdx] = newChecked;
        setCheckedAttributes(newCheckedAttributes);
        onChange(sortedColumns, [
            ...checkedGeneral,
            ...newCheckedAttributes.flat(),
        ]);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = sortedColumns.findIndex((item) => item.key === active.id);
        const newIndex = sortedColumns.findIndex((item) => item.key === over.id);
        const newColumns = arrayMove(sortedColumns, oldIndex, newIndex);

        const activeColumnIndex = newColumns.findIndex((col) => col.key === COLUMN_KEYS.ACTION);
        if (activeColumnIndex !== -1 && activeColumnIndex !== newColumns.length - 1) {
            const activeCol = newColumns.splice(activeColumnIndex, 1)[0];
            newColumns.push(activeCol);
        }

        setSortedColumns(newColumns);

        const newCheckedGeneral = newColumns
            .filter((col) => checkedGeneral.includes(col.key as string))
            .map((col) => col.key as string);

        const newCheckedAttributes = newColumns
            .filter((col) => checkedAttributes.flat().includes(col.key as string))
            .map((col) => col.key as string);

        const filteredCheckedGeneral = newCheckedGeneral.filter((key) => key !== COLUMN_KEYS.ACTION);
        const filteredCheckedAttributes = newCheckedAttributes.filter((key) => key !== COLUMN_KEYS.ACTION);

        const combinedChecked = [
            ...filteredCheckedGeneral,
            ...filteredCheckedAttributes,
            COLUMN_KEYS.ACTION,
        ];

        setCheckedGeneral(filteredCheckedGeneral);
        setCheckedAttributes(
            subKeys.map((sub) =>
                filteredCheckedAttributes.filter((key) => sub.subCols.includes(key))
            )
        );

        onChange(newColumns, combinedChecked);
    };

    const handleCheckAttribute = (index: number) => {
        const newCheckAttributes = [...checkAttributes];
        newCheckAttributes[index] = !newCheckAttributes[index];
        setCheckAttributes(newCheckAttributes);
    };

    const handleSearchChange = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = e.target.value;
        const newSearchTexts = [...searchTexts];
        newSearchTexts[index] = value;
        setSearchTexts(newSearchTexts);
    };

    const content = (
        <Flex gap={12} className="max-h-80">
            {!!subKeys?.length &&
                subKeys.map((sub, idx) => {
                    const filteredSubColumns = sortedColumns.filter((col) =>
                        sub.subCols.includes(col.key as string)
                    );

                    const filteredColumns = filterColumnsBySearch(
                        filteredSubColumns,
                        searchTexts[idx],
                        true
                    );

                    const allSubKeyKeys = filteredColumns.map((col) => col.key as string);

                    const isAllChecked = allSubKeyKeys.every((key) =>
                        checkedAttributes[idx].includes(key)
                    );

                    const isIndeterminate =
                        allSubKeyKeys.some((key) => checkedAttributes[idx].includes(key)) &&
                        !isAllChecked;

                    return (
                        checkAttributes[idx] && (
                            <ColumnList
                                key={idx}
                                title={sub.label}
                                columns={filteredColumns}
                                checkedList={checkedAttributes[idx]}
                                handleCheckChange={(key: string, checked: boolean) =>
                                    handleAttributeCheckChange(idx, key, checked)
                                }
                                handleCheckAll={(e: CheckboxChangeEvent) => handleAttributeCheckAll(idx, e)}
                                handleDragEnd={handleDragEnd}
                                showSearchBar
                                searchText={searchTexts[idx]}
                                handleSearch={(e: ChangeEvent<HTMLInputElement>) => handleSearchChange(idx, e)}
                                isAllChecked={isAllChecked}
                                isIndeterminate={isIndeterminate}
                            />
                        )
                    );
                })}

            <ColumnList
                title={"General Columns"}
                columns={filteredGeneralColumns}
                checkedList={checkedGeneral}
                subKeys={subKeys}
                checkAttributes={checkAttributes}
                handleCheckAttribute={handleCheckAttribute}
                handleCheckChange={handleGeneralCheckChange}
                handleCheckAll={handleGeneralCheckAll}
                handleDragEnd={handleDragEnd}
                showSearchBar
                searchText={searchTextGeneral}
                handleSearch={(e: { target: { value: SetStateAction<string>; }; }) => setSearchTextGeneral(e.target.value)}
                isAllChecked={isAllGeneralChecked}
                isIndeterminate={isGeneralIndeterminate}
            />
        </Flex>
    );

    return (
        <Popover
            content={content}
            trigger="click"
            placement="bottomRight"
            overlayStyle={{
                position: 'fixed',
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
};

export default ColumnSettingsPopoverTabs;
