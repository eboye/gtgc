import dayjs from 'dayjs';

export type RangeBucket = 'day' | 'week' | 'month' | 'year';

export function bucketSizeByDateRange(dateRange: [Date, Date]): RangeBucket {
  const [startDate, endDate] = dateRange;
  const diffDays = dayjs(endDate).diff(dayjs(startDate), 'day');

  if (diffDays < 21) return 'day';
  if (diffDays < 91) return 'week';
  if (diffDays < 720) return 'month';
  return 'year';
}
