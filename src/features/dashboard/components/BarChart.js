import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function BarChartFullScreen() {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Revenue Report",
      },
    },
  };

  const labels = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Store 1",
        data: labels.map(() => Math.random() * 1000 + 500),
        backgroundColor: "rgba(255, 99, 132, 1)",
      },
      {
        label: "Store 2",
        data: labels.map(() => Math.random() * 1000 + 500),
        backgroundColor: "rgba(53, 162, 235, 1)",
      },
    ],
  };

  return (
    <div className="w-full min-h-96 p-6 bg-gray-100">
      {/* Đảm bảo toàn màn hình với `h-screen` */}
      <Bar options={options} data={data} className="h-full" />
    </div>
  );
}

export default BarChartFullScreen;
