import dayjs from "dayjs";
import { createContext } from "react";

export type DateRange = [Date, Date];

export const DateRangeContext = createContext<DateRange>([
  dayjs().subtract(1, "year").toDate(),
  dayjs().toDate(),
]);
