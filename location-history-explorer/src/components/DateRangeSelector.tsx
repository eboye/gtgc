import { subMonths, subYears } from "date-fns";
import { useContext } from "react";
import type { RangeType } from "rsuite/esm/DateRangePicker";
import { DateRangeContext, type DateRange } from "../context/DateRangeContext";
import { DateRangePicker, Text } from "rsuite";

export default function DateRangeSelector({
  allTimeDateRange,
  onDateRangeChange
}: {
  allTimeDateRange: DateRange;
  onDateRangeChange: (dateRange: DateRange) => void;
}) {
  const selectedDateRange = useContext<DateRange>(DateRangeContext);

  const predefinedRanges = [
    {
      label: "All Time",
      value: allTimeDateRange,
      placement: "left",
    },
    {
      label: "Last Year",
      value: [subYears(new Date(), 1), new Date()],
      placement: "left",
    },
    {
      label: "Last Month",
      value: [subMonths(new Date(), 1), new Date()],
      placement: "left",
    },
    {
      label: "Today",
      value: [new Date(), new Date()],
      placement: "left",
    },
  ] as RangeType[];

  return (
    <>
      <Text muted weight="light">
        Date Range
      </Text>
      <DateRangePicker
        ranges={predefinedRanges}
        defaultValue={selectedDateRange}
        onChange={(dates) => {
          if (dates && dates.length === 2) onDateRangeChange(dates);
        }}
        format="yyyy-MM-dd"
        isoWeek={true}
        cleanable={false}
      />
    </>
  );
}
