import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import TitleCard from "../../components/Cards/TitleCard";
import ReportService from "../../services/ReportService";

const StatisticalOverview = () => {
  const [stockReports, setStockReports] = useState([]);
  const [chartData, setChartData] = useState({
    series: [
      { name: "Sales", data: [] },
      { name: "Revenue", data: [] },
    ],
    options: {
      chart: { type: "line", height: 400 },
      stroke: { curve: "smooth" },
      xaxis: { categories: [] },
      colors: ["#4CAF50", "#2196F3"],
    },
  });
  const [selectedRange, setSelectedRange] = useState("7 days");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const stockData = await ReportService.fetchStockReport(selectedRange);
        setStockReports(stockData);

        // Prepare chart data based on fetched stock data
        const categories = stockData.map((report) => report.versionName);
        const salesData = stockData.map((report) => report.totalOrderQuantity);
        const revenueData = stockData.map((report) => report.totalEntryQuantity);

        setChartData((prev) => ({
          ...prev,
          series: [
            { name: "Sales", data: salesData },
            { name: "Revenue", data: revenueData },
          ],
          options: { ...prev.options, xaxis: { categories } },
        }));
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, [selectedRange]);

  const handleRangeChange = (range) => {
    setSelectedRange(range);
  };

  return (
    <TitleCard title="Thống kê tổng quan" topMargin="mt-2">
      <div className="max-w-6xl w-full bg-white rounded-lg shadow dark:bg-gray-800 p-4 md:p-6">
        <div className="flex justify-between">
          <div>
            <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">$12,423</h5>
            <p className="text-base font-normal text-gray-500 dark:text-gray-400">Sales this week</p>
          </div>
          <div
            className="flex items-center px-2.5 py-0.5 text-base font-semibold text-green-500 dark:text-green-500 text-center">
            23%
            <svg
              className="w-3 h-3 ms-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13V1m0 0L1 5m4-4 4 4"
              />
            </svg>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <select
            value={selectedRange}
            onChange={(e) => handleRangeChange(e.target.value)}
            className="p-2 border rounded-md text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700"
          >
            <option value="7 days">Last 7 days</option>
            <option value="1 month">Last 1 month</option>
            <option value="1 quarter">Last 1 quarter</option>
            <option value="1 year">Last 1 year</option>
          </select>
        </div>
        <div id="data-series-chart" className="mt-6">
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="line"
            height={400}
          />
        </div>
      </div>
      <div className="p-6">
        <table className="w-full table-auto border-collapse border border-gray-200 shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Tên Phiên Bản</th>
              <th className="border border-gray-300 px-4 py-2">Tổng Nhập</th>
              <th className="border border-gray-300 px-4 py-2">Tổng Bán</th>
            </tr>
          </thead>
          <tbody>
            {stockReports.map((report, index) => (
              <tr key={index} className="text-center">
                <td className="border border-gray-300 px-4 py-2">{report.versionName}</td>
                <td className="border border-gray-300 px-4 py-2">{report.totalEntryQuantity}</td>
                <td className="border border-gray-300 px-4 py-2">{report.totalOrderQuantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TitleCard>
  );
};

export default StatisticalOverview;
