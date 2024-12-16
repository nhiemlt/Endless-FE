import { useState, useEffect } from "react";
import ReportService from "../../services/ReportService";
import TitleCard from "../../components/Cards/TitleCard";
import LineChart from "../../features/dashboard/components/LineChart";

function StatisticalProduct() {
  const [chartData, setChartData] = useState(null);
  const [year, setYear] = useState(2024); // Mặc định là năm 2024

  useEffect(() => {
    const fetchRevenueReport = async () => {
      try {
        // Gọi API để lấy dữ liệu doanh thu theo năm
        const revenueData = await ReportService.fetchRevenueReport(year);

        // Kiểm tra xem dữ liệu có hợp lệ không
        if (revenueData && revenueData.details) {
          // Định dạng lại dữ liệu để phù hợp với biểu đồ
          const formattedData = {
            labels: revenueData.details.map(item => item.month), // Các tháng trong năm
            datasets: [
              {
                label: "Doanh thu (VND)",
                data: revenueData.details.map(item => item.monthlyRevenue), // Dữ liệu doanh thu theo tháng
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                tension: 0.4,
              },
            ],
          };
          setChartData(formattedData); // Cập nhật dữ liệu cho biểu đồ
        } else {
          console.error("Dữ liệu không hợp lệ từ API");
          setChartData(null); // Nếu dữ liệu không hợp lệ, xóa dữ liệu biểu đồ
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API:", error.message || error);
        setChartData(null); // Nếu có lỗi, xóa dữ liệu biểu đồ
      }
    };

    fetchRevenueReport(); // Gọi hàm lấy dữ liệu khi component mount
  }, [year]); // Thực hiện lại khi thay đổi năm

  const handleYearChange = (e) => {
    setYear(e.target.value); // Cập nhật năm khi người dùng chọn
  };

  return (
    <TitleCard title="Thống kê doanh thu" topMargin="mt-2">
      {/* Dropdown để chọn năm */}
      <div className="flex justify-between items-center mb-4">
        <select
          value={year}
          onChange={handleYearChange}
          className="p-2 border rounded-md text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700"
        >
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </select>
      </div>

      {/* Kiểm tra xem dữ liệu có hợp lệ không trước khi render biểu đồ */}
      {chartData ? (
        <LineChart data={chartData} />
      ) : (
        <p>Không có dữ liệu để hiển thị</p>
      )}
    </TitleCard>
  );
}

export default StatisticalProduct
