import { cache, createAsync } from "@solidjs/router";
import { Chart } from "chart.js/auto";
import { createEffect, createSignal, onMount } from "solid-js";
import { duckdb } from "~/duckdb";

const getData = cache(async () => {
  "use server";
  
  const results = await duckdb.getMany(`
    SELECT YEAR(endTimestamp) as year, activityType, sum(distance) as distance
    FROM semantic_history
    GROUP BY YEAR(endTimestamp), activityType
    ORDER BY YEAR(endTimestamp), activityType;
  `);
  
  return results;
}, "ActivityTypeByYearBarChart");

export default function ActivityTypeByYearBarChart() {
  let canvasRef;
  let [chart, setChart] = createSignal<Chart>();

  const dbData = createAsync(() => getData());

  createEffect(() => {
    const data = dbData() || [];
    const chartInstance = chart();
    if (!chartInstance || !dbData) return;

    // Create a new object to store the transformed data
    const transformedData = data.reduce((acc, item) => {
      if (!acc[item.year]) {
        acc[item.year] = {};
      }
      acc[item.year][item.activityType] = Number(item.distance);
      return acc;
    }, {});

    // Get unique activity types
    const activityTypes = [...new Set(data.map(d => d.activityType))];

    // Clear existing datasets
    chartInstance.data.datasets = [];

    // Create a dataset for each activity type
    activityTypes.forEach((activityType, index) => {
      chartInstance.data.datasets.push({
        label: activityType,
        data: Object.keys(transformedData).map(year => transformedData[year][activityType] || 0),
       backgroundColor: `hsl(${index * 360 / activityTypes.length}, 70%, 50%)`,
      });
    });

    chartInstance.data.labels = [...new Set(data.map(d => d.year))];
    chartInstance.update();
  });
  
  onMount(() => {
    setChart(new Chart(canvasRef!, {
      type: 'bar',
      data: {
        labels: [],
        datasets: []
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Distance travelled by Activity Type by Year',
          },
        },
        responsive: true,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          },
        },
      },
    }));
  });
 
  return (
    <main>
      <h1>Activity Type by Year</h1>
      <canvas ref={canvasRef} />
    </main>
  );
}
