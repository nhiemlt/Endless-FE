import axios from 'axios';
import constants from '../utils/globalConstantUtil';

const EntryService = {
  createEntryOrder: async (entryOrderModel) => {
    try {
      const response = await axios.post(`${constants.API_BASE_URL}/entry-orders`, entryOrderModel);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Unexpected error");
    }
  },

  getEntryOrderById: async (id) => {
    try {
      const response = await axios.get(`${constants.API_BASE_URL}/entry-orders/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Unexpected error");
    }
  },

  getAllEntryOrders: async (startDate, endDate, pageable) => {
    try {
      const response = await axios.get(`${constants.API_BASE_URL}/entry-orders`, {
        params: { startDate, endDate, ...pageable },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Unexpected error");
    }
  },

  getEntryOrderDetails: async (id) => {
    try {
      const response = await axios.get(`${constants.API_BASE_URL}/entry-orders/${id}/details`);
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error("Unexpected error");
    }
  },
};

export default EntryService;
