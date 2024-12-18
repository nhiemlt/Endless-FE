import axios from 'axios';
import constants from '../utils/globalConstantUtil';

const StatisticsService = {
    getTop5BestSellingProducts: async (startDate, endDate) => {
        const response = await axios.get(`${constants.API_BASE_URL}/api/statistics/top5bestsale`, {
            params: { startDate, endDate }
        });
        return response.data;
    },

    getRevenueByCategory: async (startDate, endDate) => {
        const response = await axios.get(`${constants.API_BASE_URL}/api/statistics/revenue-by-category`, {
            params: { startDate, endDate }
        });
        return response.data;
    },

    getUnsoldProducts: async () => {
        const response = await axios.get(`${constants.API_BASE_URL}/api/statistics/unsold-products`);
        return response.data;
    },

    getTotalImportAndSales: async () => {
        const response = await axios.get(`${constants.API_BASE_URL}/api/statistics/total-import-sales`);
        return response.data;
    },

    getProductSalesSummary: async (startDate, endDate) => {
        const response = await axios.get(`${constants.API_BASE_URL}/api/statistics/product-sales-summary`, {
            params: { startDate, endDate }
        });
        return response.data;
    }
};

export default StatisticsService;
