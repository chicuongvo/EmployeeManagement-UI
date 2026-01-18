import type { SelectProps } from "antd";
import SelectListGeneric from "@/components/common/form/SelectListGeneric";
import { getRole, getListRole } from "@/apis/role";
import type { GetListRoleResponse, ROLE } from "@/apis/role";
import { useState, useCallback } from "react";

interface SelectListRoleProps extends SelectProps {
    defaultValue?: { id: number; name: string }[];
}

const SelectListRole = ({
    defaultValue = [],
    ...props
}: SelectListRoleProps) => {
    const [extraOptions, setExtraOptions] = useState<
        { value: number; label: string }[]
    >([]);

    const fetchMissingOptions = useCallback(async (ids: number[]) => {
        for (const id of ids) {
            try {
                const role = await getRole(id);

                if (role) {
                    setExtraOptions((prev) => {
                        if (prev.some((p) => p.value === role.id)) return prev;

                        return [
                            ...prev,
                            {
                                value: role.id,
                                label: role.name,
                            },
                        ];
                    });
                }
            } catch (e) {
                console.error("Failed to fetch role", id, e);
            }
        }
    }, []);

    return (
        <SelectListGeneric
            {...props}
            styles={{
                popup: {
                    root: {
                        maxHeight: 270,
                        overflowY: "auto",
                    },
                },
            }}
            fetcher={(search) =>
                getListRole({
                    name: search,
                    status: "ACTIVE",
                })
            }
            mapOptions={(data: GetListRoleResponse) => {
                const currentValue = props.value ?? defaultValue.map((d) => d.id);

                const currentValueArray = Array.isArray(currentValue)
                    ? currentValue
                    : currentValue !== undefined
                        ? [currentValue]
                        : [];

                const options =
                    data?.data?.data?.map((d: ROLE) => ({
                        value: d.id,
                        label: d.name,
                    })) || [];

                const defaultOptions = defaultValue.map((item) => ({
                    value: item.id,
                    label: item.name,
                }));

                const mergedOptions = [
                    ...defaultOptions,
                    ...extraOptions,
                    ...options.filter(
                        (option: { value: number; label: string }) =>
                            !defaultOptions.some((item) => item.value === option.value) &&
                            !extraOptions.some((item) => item.value === option.value)
                    ),
                ];

                const missingValues = currentValueArray.filter(
                    (v: any) => !mergedOptions.some((opt) => opt.value === v)
                );

                if (missingValues.length > 0) {
                    fetchMissingOptions(missingValues);
                }

                return mergedOptions;
            }}
            queryKey={[`select-list-roles`]}
            allowClear={props.allowClear}
        />
    );
};

export default SelectListRole;
