import axios from "axios";
import constants from "../utils/globalConstantUtil";

const CustomerService = {
  // Lấy danh sách khách hàng với phân trang, tìm kiếm theo keyword và sắp xếp
  getAllCustomers: async (page = 0, size = 10, keyword = "", sortBy = "fullName", direction = "asc") => {
    const response = await axios.get(`${constants.API_BASE_URL}/api/customers`, {
      params: { page, size, keyword, sortBy, direction },
    });
    return response.data;
  },

  // Lấy thông tin khách hàng theo ID
  getCustomerById: async (customerId) => {
    const response = await axios.get(`${constants.API_BASE_URL}/api/customers/${customerId}`);
    return response.data;
  },

  // Tạo mới khách hàng
  createCustomer: async (customerData) => {
    const response = await axios.post(`${constants.API_BASE_URL}/api/customers`, customerData);
    return response.data;
  },

  // Cập nhật thông tin khách hàng
  updateCustomer: async (customerId, customerData) => {
    const response = await axios.put(`${constants.API_BASE_URL}/api/customers/${customerId}`, customerData);
    return response.data;
  },

  // Xóa khách hàng
  deleteCustomer: async (customerId) => {
    const response = await axios.delete(`${constants.API_BASE_URL}/api/customers/${customerId}`);
    return response.data;
  },

  // Kiểm tra số điện thoại có đúng định dạng không
  validatePhoneNumber: (phone) => {
    const phoneRegex = /^(\+?84|0)[0-9]{9}$/;
    return phoneRegex.test(phone);
  },

  // Kiểm tra email có đúng định dạng không
  validateEmail: (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  },
};

export default CustomerService;
