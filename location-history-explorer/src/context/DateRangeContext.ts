import { subYears } from "date-fns";
import { createContext } from "react";

export type DateRange = [Date, Date];

export const DateRangeContext = createContext<DateRange>([
  subYears(new Date(), 1),
  new Date(),
]);
