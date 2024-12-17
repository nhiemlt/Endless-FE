import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { CreditCardIcon } from "@heroicons/react/24/outline";
import Datepicker from "react-tailwindcss-datepicker";
import TitleCard from "../../components/Cards/TitleCard";
import StatisticsService from "../../services/StatisticsService"; // Import dịch vụ mới
import RevenueService from "../../services/RevenueService"; // Import dịch vụ RevenueService mới
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

function RevenueStatistics() {
  const [revenueDateRange, setRevenueDateRange] = useState({ startDate: new Date(), endDate: new Date() });
  const [chartDate, setChartDate] = useState(new Date().getFullYear());
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(Array(12).fill(0));
  const [salesSummary, setSalesSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Tìm kiếm và phân trang
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Mỗi trang sẽ hiển thị 10 sản phẩm
  
  useEffect(() => {
    fetchTotalRevenue();
  }, [revenueDateRange]);

  useEffect(() => {
    fetchMonthlyRevenue();
  }, [chartDate]);

  useEffect(() => {
    fetchSalesSummary(); // Gọi API lấy thông tin bán hàng khi thay đổi khoảng ngày
  }, [revenueDateRange]);

  const fetchTotalRevenue = async () => {
    try {
      const { startDate, endDate } = revenueDateRange;
      if (startDate && endDate) {
        const formattedStartDate = formatRevenueDate(startDate);
        const formattedEndDate = formatRevenueDate(endDate);
        const data = await RevenueService.getTotalRevenue(formattedStartDate, formattedEndDate);
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

  const fetchSalesSummary = async () => {
    setLoading(true);
    try {
      const { startDate, endDate } = revenueDateRange;
      if (startDate && endDate) {
        const formattedStartDate = formatRevenueDate(startDate);
        const formattedEndDate = formatRevenueDate(endDate);
        const data = await StatisticsService.getProductSalesSummary(formattedStartDate, formattedEndDate);
        setSalesSummary(data);
        setError(null); // Clear any previous errors
      }
    } catch (error) {
      console.error("Error fetching sales summary:", error);
      setError("Không thể tải thông tin bán hàng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleRevenueDateChange = (newValue) => {
    setRevenueDateRange(newValue);
  };

  const handleChartYearChange = (e) => {
    setChartDate(e.target.value);
  };

  // Hàm định dạng ngày cho tổng doanh thu (YYYY-MM-DD)
  const formatRevenueDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  // Hàm định dạng ngày cho bảng sản phẩm (MM/DD/YYYY)
  const formatTableDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const labels = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
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

  // Tìm kiếm trong bảng
  const filteredSalesSummary = salesSummary.filter((item) =>
    item.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Phân trang
  const paginatedSalesSummary = filteredSalesSummary.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset trang khi thay đổi tìm kiếm
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white">
      {/* Title Card for Revenue */}
      <TitleCard title="Thống kê doanh thu" topMargin="mt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Select date range */}
          <div className="flex items-center">
            <label className="mr-3 font-semibold text-gray-700 dark:text-gray-300">
              Chọn ngày:
            </label>
            <Datepicker
              displayFormat="DD/MM/YYYY"
              placeholder="Thống kê doanh thu từ ngày...."
              startWeekOn="mon"
              value={revenueDateRange}
              useRange={false}
              onChange={handleRevenueDateChange}
              showShortcuts={true}
              inputClassName="input input-bordered w-full pr-10 bg-white dark:bg-gray-700 dark:text-white"
              i18n="vi"
            />
          </div>
          {/* Total Revenue */}
          <div className="shadow-lg rounded-lg p-4 flex items-center justify-between bg-white dark:bg-gray-700">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-gray-600">
              <CreditCardIcon className="w-8 h-8 text-blue-500 dark:text-white" />
            </div>
            <div className="ml-4 text-right">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                Tổng doanh thu
              </h3>
              <p className="text-2xl font-bold text-blue-500 dark:text-white">
                {totalRevenue.toLocaleString()} VND
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Theo giai đoạn</p>
            </div>
          </div>
        </div>
      </TitleCard>

      {/* Title Card for Sales Summary */}
      <TitleCard title="Thông tin bán hàng" topMargin="mt-6">
        <div className="flex items-center mb-4">
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* Table for Sales Summary */}
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">Hình ảnh</th>
              <th className="border p-2">Sản phẩm</th>
              <th className="border p-2">Số lượng bán</th>
              <th className="border p-2">Giá bán</th>
              <th className="border p-2">Tổng doanh thu</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSalesSummary.length > 0 ? (
              paginatedSalesSummary.map((item, index) => (
                <tr key={index}>
                  <td className="border p-2">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-16 h-16 object-cover"
                    />
                  </td>
                  <td className="border p-2">
                    {item.productName} {item.productVersion}
                  </td>
                  <td className="border p-2">{item.totalSales}</td>
                  <td className="border p-2">{item.exportPrice.toLocaleString()} VND</td>
                  <td className="border p-2">{item.totalRevenue.toLocaleString()} VND</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-2">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          <button
            className="btn btn-outline"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Trước
          </button>
          <span className="mx-4">Trang {currentPage}</span>
          <button
            className="btn btn-outline"
            disabled={currentPage === Math.ceil(filteredSalesSummary.length / pageSize)}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Sau
          </button>
        </div>
      </TitleCard>

      {/* Title Card for Monthly Revenue */}
      <TitleCard title="Doanh thu hàng tháng" topMargin="mt-6">
        {/* Chart for Monthly Revenue */}
        <div className="h-96">
          <Line data={data} options={options} />
        </div>
      </TitleCard>
    </div>
  );
}

export default RevenueStatistics;
