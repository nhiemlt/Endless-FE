import axios from "axios";
import constants from "../utils/globalConstantUtil";

const ReportService = {
  // Lấy thống kê kho hàng
  fetchStockReport: async () => {
    const response = await axios.get(`${constants.API_BASE_URL}/api/report/stock`);
    return response.data;
  },

  // Lấy thống kê sản phẩm
  fetchProductReport: async () => {
    const response = await axios.get(`${constants.API_BASE_URL}/api/report/products`);
    return response.data;
  },

  // Lấy thống kê doanh thu với ngày bắt đầu và kết thúc
  fetchRevenueReport: async (startDate, endDate) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await axios.get(`${constants.API_BASE_URL}/api/report/revenue`, {
      params,
    });
    return response.data;
  },
};

export default ReportService;
