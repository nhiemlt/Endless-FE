import { useState, useEffect } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import TitleCard from "../../components/Cards/TitleCard";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { CreditCardIcon } from "@heroicons/react/24/outline";
import RevenueService from "../../services/RevenueService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

function RevenueStatistics() {
  const [revenueDateRange, setRevenueDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [chartDate, setChartDate] = useState(new Date().getFullYear());
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(Array(12).fill(0));

  useEffect(() => {
    fetchTotalRevenue();
  }, [revenueDateRange]);

  useEffect(() => {
    fetchMonthlyRevenue();
  }, [chartDate]);

  const fetchTotalRevenue = async () => {
    try {
      const { startDate, endDate } = revenueDateRange;
      if (startDate && endDate) {
        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);

        const data = await RevenueService.getTotalRevenue(
          formattedStartDate,
          formattedEndDate
        );
        setTotalRevenue(parseFloat(data));
      }
    } catch (error) {
      console.error("Error fetching total revenue:", error);
    }
  };

  const fetchMonthlyRevenue = async () => {
    try {
      const data = await RevenueService.getMonthlyRevenue(chartDate);
      const revenueArray = Array(12).fill(0); // Reset mảng
      data.forEach((item) => {
        revenueArray[item.month - 1] = item.totalRevenue;
      });
      setMonthlyRevenue(revenueArray);
    } catch (error) {
      console.error("Error fetching monthly revenue:", error);
    }
  };

  const handleRevenueDateChange = (newValue) => {
    setRevenueDateRange(newValue);
  };

  const handleChartYearChange = (e) => {
    setChartDate(e.target.value);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
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
        fill: true,
        label: "Doanh thu (VND)",
        data: monthlyRevenue,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      x: { ticks: { font: { size: 12 } } },
      y: { ticks: { beginAtZero: true, font: { size: 12 } } },
    },
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white">
      <TitleCard title="Thống kê doanh thu" topMargin="mt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex items-center">
            <label className="mr-3 font-semibold text-gray-700 dark:text-gray-300">
              Chọn ngày:
            </label>
            <div className="relative w-full max-w-xs">
              <Datepicker
                value={revenueDateRange}
                onChange={handleRevenueDateChange}
                showShortcuts={true}
                popoverDirection="down"
                inputClassName="input input-bordered w-full pr-10 bg-white dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div
            className={`shadow-lg rounded-lg p-4 flex items-center justify-between bg-white dark:bg-gray-700`}
          >
            <div className={`p-3 rounded-full bg-blue-100 dark:bg-gray-600`}>
              <CreditCardIcon className="w-8 h-8 text-blue-500 dark:text-white" />
            </div>
            <div className="ml-4 text-right">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                Total Sales
              </h3>
              <p className="text-2xl font-bold text-blue-500 dark:text-white">
                {totalRevenue.toLocaleString()} VND
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Current period
              </p>
            </div>
          </div>
        </div>

        {/* Row 2: Nút chọn năm */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <label className="block font-medium mb-2 pt-5 text-gray-700 dark:text-gray-200">
              Chọn năm cho biểu đồ:
            </label>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600 dark:text-gray-400">Năm</span>
              <input
                type="number"
                value={chartDate}
                onChange={handleChartYearChange}
                className="input input-bordered w-32 text-gray-700 dark:text-white bg-white dark:bg-gray-700"
                min="2000"
                max={new Date().getFullYear()}
              />
            </div>
          </div>
        </div>

        {/* Biểu đồ Section */}
        <div className="mt-6 h-96 shadow-lg rounded-lg p-4 bg-white dark:bg-gray-700">
          <Line data={data} options={options} />
        </div>
      </TitleCard>
    </div>
  );
}

export default RevenueStatistics;
