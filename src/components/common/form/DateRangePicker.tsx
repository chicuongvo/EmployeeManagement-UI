import { DatePicker, type TimeRangePickerProps } from "antd";
import { type RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

type Props = RangePickerProps & {
    className?: string;
};

const DateRangePicker = ({ className, ...rest }: Props) => {
    const rangePresets: TimeRangePickerProps["presets"] = [
        { label: "Today", value: [dayjs(), dayjs()] },
        {
            label: "This week",
            value: [dayjs().startOf("week"), dayjs().endOf("week")],
        },
        {
            label: "This month",
            value: [dayjs().startOf("month"), dayjs().endOf("month")],
        },
        {
            label: "This year",
            value: [dayjs().startOf("year"), dayjs().endOf("year")],
        },
        { label: "Last 7 Days", value: [dayjs().add(-7, "d"), dayjs()] },
        { label: "Last 14 Days", value: [dayjs().add(-14, "d"), dayjs()] },
        { label: "Last 30 Days", value: [dayjs().add(-30, "d"), dayjs()] },
        { label: "Last 90 Days", value: [dayjs().add(-90, "d"), dayjs()] },
    ];

    return (
        <RangePicker
            presets={rangePresets}
            className={`w-full ${className}`}
            {...rest}
        />
    );
};

export default DateRangePicker;
