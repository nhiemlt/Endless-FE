import { useState, useEffect } from "react";
import ReportService from "../../services/ReportService";
import TitleCard from "../../components/Cards/TitleCard";
import LineChart from "../../features/dashboard/components/LineChart";

function StatisticalProduct() {
  const [chartData, setChartData] = useState([]);
  const [selectedRange, setSelectedRange] = useState("day");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        // Fetch stock and revenue data
        const stockData = await ReportService.fetchStockReport(selectedRange);
        const revenueData = await ReportService.fetchRevenueReport(selectedRange);

        // Kiểm tra nếu dữ liệu không có hoặc lỗi
        if (!stockData || !revenueData) {
          console.error("Data is missing or error occurred");
          return;
        }

        // Kết hợp dữ liệu cho biểu đồ
        const combinedData = stockData.map((stockReport, index) => ({
          label: stockReport.versionName,
          totalEntry: stockReport.totalEntryQuantity,
          totalOrder: stockReport.totalOrderQuantity,
          totalRevenue: revenueData.details && revenueData.details[index] ? revenueData.details[index].revenue : 0,  // Lấy doanh thu từ danh sách chi tiết
        }));

        setChartData(combinedData);
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
    <TitleCard title="Thống kê sản phẩm và doanh thu" topMargin="mt-2">
      {/* Dropdown for selecting range */}
      <div className="flex justify-between items-center mb-4">
        <select
          value={selectedRange}
          onChange={(e) => handleRangeChange(e.target.value)}
          className="p-2 border rounded-md text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700"
        >
          <option value="day">7 ngày gần nhất</option>
          <option value="month">1 tháng gần nhất</option>
          <option value="quarter">1 quý gần nhất</option>
          <option value="year">1 năm gần nhất</option>
        </select>
      </div>

      {/* Line Chart */}
      <LineChart
        data={{
          labels: chartData.map((data) => data.label),
          datasets: [
            {
              label: "Tổng Nhập",
              data: chartData.map((data) => data.totalEntry),
              borderColor: "rgba(54, 162, 235, 1)",
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              tension: 0.4,
            },
            {
              label: "Tổng Bán",
              data: chartData.map((data) => data.totalOrder),
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              tension: 0.4,
            },
            {
              label: "Tổng Doanh Thu (VND)",
              data: chartData.map((data) => data.totalRevenue),
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              tension: 0.4,
            },
          ],
        }}
      />
    </TitleCard>
  );
}

export default StatisticalProduct;
