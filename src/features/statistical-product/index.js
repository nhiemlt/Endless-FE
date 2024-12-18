import React, { useState, useEffect } from "react";
import TitleCard from "../../components/Cards/TitleCard";
import StatisticsService from "../../services/StatisticsService";
import { Bar, Doughnut } from "react-chartjs-2";
import Datepicker from "react-tailwindcss-datepicker";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const StatisticalOverview = () => {
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [categoryRevenue, setCategoryRevenue] = useState([]);
  const [unsoldProducts, setUnsoldProducts] = useState([]);
  const [totalImportAndSales, setTotalImportAndSales] = useState([]);
  const [revenueDateRange, setRevenueDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const startDate =
        revenueDateRange.startDate || new Date().toISOString().split("T")[0];
      const endDate =
        revenueDateRange.endDate || new Date().toISOString().split("T")[0];

      const formattedStartDate = formatDate(startDate);
      const formattedEndDate = formatDate(endDate);

      try {
        const [
          top5Products,
          revenueByCategory,
          unsoldProductList,
          importAndSalesData,
        ] = await Promise.all([
          StatisticsService.getTop5BestSellingProducts(
            formattedStartDate,
            formattedEndDate
          ),
          StatisticsService.getRevenueByCategory(
            formattedStartDate,
            formattedEndDate
          ),
          StatisticsService.getUnsoldProducts(),
          StatisticsService.getTotalImportAndSales(),
        ]);

        setTopSellingProducts(top5Products || []);
        setCategoryRevenue(revenueByCategory || []);
        setUnsoldProducts(unsoldProductList || []);
        setTotalImportAndSales(importAndSalesData || []);
      } catch (error) {
        setError("Đã có lỗi xảy ra khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [revenueDateRange]);

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${year}-${month}-${day}`;
  };

  const handleRevenueDateChange = (newValue) => {
    setRevenueDateRange(newValue);
  };

  // Phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = totalImportAndSales
    .filter((item) =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Biểu đồ Bar (Top 5 sản phẩm bán chạy nhất)
  const barChartData = {
    labels: topSellingProducts.map((product) => product.productName),
    datasets: [
      {
        label: "Tổng nhập",
        data: topSellingProducts.map((product) => product.totalImport),
        backgroundColor: "#4BC0C0",
      },
      {
        label: "Tổng bán",
        data: topSellingProducts.map((product) => product.totalSales),
        backgroundColor: "#FF5733",
      },
    ],
  };

  // Biểu đồ Doughnut (Doanh thu theo danh mục)
  const doughnutChartData = {
    labels: categoryRevenue.map((item) => item.categoryname),
    datasets: [
      {
        data: categoryRevenue.map((item) => item.totalrevenue),
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
          "rgba(255, 159, 64, 0.8)",
        ],
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-xl">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-xl text-red-600">{error}</span>
      </div>
    );
  }

  // Tính số trang
  const totalPages = Math.ceil(
    totalImportAndSales.filter((item) =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase())
    ).length / itemsPerPage
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        {/* <div className="flex items-center">
          <label className="font-semibold text-gray-700 dark:text-gray-300">
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
            configs={{
              shortcuts: {
                nowday: {
                  text: "Hôm nay",
                  period: { start: new Date(), end: new Date() },
                },
                daybefore: {
                  text: "Hôm qua",
                  period: {
                    start: new Date(
                      new Date().setDate(new Date().getDate() - 1)
                    ),
                    end: new Date(new Date().setDate(new Date().getDate() - 1)),
                  },
                },
                last7Days: {
                  text: "7 ngày trước",
                  period: {
                    start: new Date(
                      new Date().setDate(new Date().getDate() - 6)
                    ),
                    end: new Date(),
                  },
                },
                lastMonth: {
                  text: "1 tháng trước",
                  period: {
                    start: new Date(
                      new Date().setMonth(new Date().getMonth() - 1)
                    ),
                    end: new Date(new Date().setDate(new Date().getDate() - 1)),
                  },
                },
              },
            }}
            disabledDates={[
              { startDate: new Date(), endDate: new Date("2100-01-01") },
            ]}
            popoverDirection="down"
            inputClassName="input input-bordered w-full pr-10 bg-white dark:bg-gray-700 dark:text-white"
            i18n="vi"
          />
        </div> */}
      </div>

      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TitleCard title="Top 5 Sản phẩm theo Doanh thu">
          <Bar data={barChartData} options={{ responsive: true }} />
        </TitleCard>

        <TitleCard title="Doanh thu theo danh mục">
          <div className="w-64 h-64">
            <Doughnut data={doughnutChartData} options={{ responsive: true }} />
          </div>
        </TitleCard>
      </div> */}

      <div className="mb-6">
        <TitleCard title="Tất cả sản phẩm">
          <input
            type="text"
            className="input input-bordered w-full lg:w-64 mt-2 lg:mt-0"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Ảnh</th>
                <th className="border p-2">Tên sản phẩm</th>
                <th className="border p-2">Tổng nhập</th>
                <th className="border p-2">Tổng bán</th>
                <th className="border p-2">Tổng doanh thu</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <tr key={index}>
                    <td className="border p-2">
                      <img
                        src={
                          item.productImage || "https://via.placeholder.com/150"
                        } // Nếu không có ảnh, dùng ảnh mặc định
                        alt={item.productName}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                    </td>
                    <td className="border p-2">{`${item.productName} - ${item.productVersion}`}</td>
                    <td className="border p-2">{item.totalImport}</td>
                    <td className="border p-2">{item.totalSales}</td>
                    <td className="border p-2">{item.totalRevenue}</td>
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

          {/* Phân trang */}
          <div className="flex justify-center mt-6">
            {/* Nút "Previous" */}
            <button
              className="btn btn-primary mx-2 px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <span className="font-semibold">Previous</span>
            </button>

            {/* Hiển thị số trang */}
            <div className="flex items-center space-x-2">
              <span className="text-lg font-medium">
                Trang {currentPage} của {totalPages}
              </span>
            </div>

            {/* Nút "Next" */}
            <button
              className="btn btn-primary mx-2 px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              <span className="font-semibold">Next</span>
            </button>
          </div>
        </TitleCard>
      </div>

      <div className="mb-6">
        <TitleCard title="Sản phẩm chưa bán">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Tên sản phẩm</th>
              </tr>
            </thead>
            <tbody>
              {unsoldProducts && unsoldProducts.length > 0 ? (
                unsoldProducts.map((item, index) => (
                  <tr key={index}>
                    <td className="border p-2">
                      {`${item.productName} - ${item.productVersion}`}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="1" className="text-center p-2">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </TitleCard>
      </div>
    </div>
  );
};

export default StatisticalOverview;
