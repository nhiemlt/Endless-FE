import axios from "axios";
import constants from "../utils/globalConstantUtil";

const CustomerService = {
  
  getAllCustomers: async (
    page = 0,
    size = 10,
    keyword = "",
    sortBy = "fullName",
    direction = "asc"
  ) => {
    const response = await axios.get(
      `${constants.API_BASE_URL}/api/customers`,
      {
        params: { page, size, keyword, sortBy, direction },
      }
    );
    return response.data;
  },

  getCustomerById: async (userId) => {
    const response = await axios.get(
      `${constants.API_BASE_URL}/api/customers/${userId}`
    );
    return response.data;
  },

  addCustomer: async (customerData) => {
    try {
      // Gửi dữ liệu khách hàng đến API
      const response = await axios.post(`${constants.API_BASE_URL}/api/customers`, customerData);
      return response.data;
    } catch (error) {
      console.error("Không thể thêm khách hàng:", error);
      throw error;
    }
  },

  updateCustomer: async (userId, customerData) => {
    const response = await axios.put(
      `${constants.API_BASE_URL}/api/customers/${userId}`,
      customerData
    );
    return response.data;
  },

  deleteCustomer: async (userId) => {
    const response = await axios.delete(
      `${constants.API_BASE_URL}/api/customers/${userId}`
    );
    return response.data;
  },

  toggleCustomerStatus: async (userId) => {
    const response = await axios.patch(
      `${constants.API_BASE_URL}/api/customers/${userId}/status`
    );
    return response.data;
  },

  getAllUserAddresses: async (userId) => {
    const response = await axios.get(
      `${constants.API_BASE_URL}/api/customers/${userId}/addresses`
    );
    return response.data;
  },

  addAddress: async (userId, addressData) => {
    const response = await axios.post(
      `${constants.API_BASE_URL}/api/customers/${userId}/addresses`,
      addressData
    );
    return response.data;
  },

  removeAddress: async (userId, addressId) => {
    const response = await axios.delete(
      `${constants.API_BASE_URL}/api/customers/${userId}/addresses/${addressId}`
    );
    return response.data;
  },

  resetPassword: async (userId) => {
    const response = await axios.post(
      `${constants.API_BASE_URL}/api/customers/${userId}/reset-password`
    );
    return response.data;
  },

};

export default CustomerService;
