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

  getCustomerById: async (customerId) => {
    const response = await axios.get(
      `${constants.API_BASE_URL}/api/customers/${customerId}`
    );
    return response.data;
  },

  createCustomer: async (customerData) => {
    const response = await axios.post(
      `${constants.API_BASE_URL}/api/customers`,
      customerData
    );
    return response.data;
  },

  updateCustomer: async (customerId, customerData) => {
    const response = await axios.put(
      `${constants.API_BASE_URL}/api/customers/${customerId}`,
      customerData
    );
    return response.data;
  },

  deleteCustomer: async (customerId) => {
    const response = await axios.delete(
      `${constants.API_BASE_URL}/api/customers/${customerId}`
    );
    return response.data;
  },

  toggleCustomerStatus: async (customerId) => {
    const response = await axios.patch(
      `${constants.API_BASE_URL}/api/customers/${customerId}/status`
    );
    return response.data;
  },

  getAllUserAddresses: async (customerId) => {
    const response = await axios.get(
      `${constants.API_BASE_URL}/api/customers/${customerId}/addresses`
    );
    return response.data;
  },

  addAddress: async (customerId, addressData) => {
    const response = await axios.post(
      `${constants.API_BASE_URL}/api/customers/${customerId}/addresses`,
      addressData
    );
    return response.data;
  },

  removeAddress: async (customerId, addressId) => {
    const response = await axios.delete(
      `${constants.API_BASE_URL}/api/customers/${customerId}/addresses/${addressId}`
    );
    return response.data;
  },

  resetPassword: async (customerId) => {
    const response = await axios.post(
      `${constants.API_BASE_URL}/api/customers/${customerId}/reset-password`
    );
    return response.data;
  },

};

export default CustomerService;
