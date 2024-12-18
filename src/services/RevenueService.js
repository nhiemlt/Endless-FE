import axios from "axios";
import constants from "../utils/globalConstantUtil";

// Hàm chuyển định dạng ngày
const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`; // Định dạng DD-MM-YYYY
};

const RevenueService = {
  
  getTotalRevenue: async (startDate, endDate) => {
    // Chuyển định dạng ngày
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    const response = await axios.get(`${constants.API_BASE_URL}/api/revenue/total`, {
      params: { startDate: formattedStartDate, endDate: formattedEndDate },
    });
    return response.data;
  },

  getMonthlyRevenue: async (year) => {
    const response = await axios.get(`${constants.API_BASE_URL}/api/revenue/monthly`, {
      params: { year },
    });
    return response.data;
  },
};

export default RevenueService;
