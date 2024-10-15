import { actions } from "astro:actions";
import { useContext, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DateRangeContext } from "../../context/DateRangeContext";

const colors = [
  "#845ec2",
  "#d65db1",
  "#ff6f91",
  "#ff9671",
  "#ffc75f",
  "#008e9b",
];

export default function ByActivityTypeBarChart({ type }: { type: 'duration' | 'distance' }) {
  const dateRange = useContext(DateRangeContext);
  const [startDate, endDate] = dateRange;

  const [activityTypes, setActivityTypes] = useState<string[]>([]);
  const [data, setData] = useState<object[]>([]);

  useEffect(() => {
    async function fetchData() {
      let data;
      if (type === 'duration') {
        const res = await actions.queryDurationByActivityTypeAndYear({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });
        data = res.data;

      } else {
        const res = await actions.queryDistanceByActivityTypeAndYear({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });
        data = res.data;
      }
      if (!data) return;

      setActivityTypes([...new Set(data.map((d) => d.activityType))]);

      const transformedData = data.reduce((acc, item) => {
        if (!acc[item.year]) {
          acc[item.year] = {
            name: Number(item.year),
          };
        }
        acc[item.year][item.activityType] = Number(item.sum);
        return acc;
      }, {});
      setData(Object.values(transformedData));
    }

    fetchData();
  }, [dateRange]);

  return (
    <div style={{ width: "100%", height: "25em" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            left: 40,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />

          <YAxis />
          <XAxis dataKey="name" />

          {activityTypes.map((activityType, idx) => (
            <Bar
              key={idx}
              dataKey={activityType}
              stackId="a"
              fill={colors[idx % colors.length]}
              isAnimationActive={false}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
