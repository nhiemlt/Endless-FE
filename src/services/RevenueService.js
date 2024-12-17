import axios from "axios";
import constants from "../utils/globalConstantUtil";

const RevenueService = {
  
  getTotalRevenue: async (startDate, endDate) => {
    const response = await axios.get(`${constants.API_BASE_URL}/api/revenue/total`, {
      params: { startDate, endDate },
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
