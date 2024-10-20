import axios from 'axios';
import constants from '../utils/globalConstantUtil';

const OrderService = {
    // Lấy tất cả đơn hàng với các tham số tìm kiếm
    getAllOrders: async (searchText, startDate, endDate, page, size) => {
        const response = await axios.get(`${constants.API_BASE_URL}/orders`, {
            params: {
                searchText,
                startDate,
                endDate,
                page,
                size,
            },
        });
        return response.data;
    },

    // Tạo đơn hàng mới
    createOrder: async (orderModel) => {
        const response = await axios.post(`${constants.API_BASE_URL}/orders`, orderModel);
        return response.data; // Trả về dữ liệu API
    },

    // Lấy thông tin đơn hàng theo ID
    getOrderById: async (id) => {
        const response = await axios.get(`${constants.API_BASE_URL}/orders/${id}`);
        return response.data; // Trả về dữ liệu API
    },

    // Lấy chi tiết đơn hàng theo ID
    getOrderDetailsByOrderId: async (id) => {
        const response = await axios.get(`${constants.API_BASE_URL}/orders/${id}/details`);
        return response.data; // Trả về dữ liệu API
    },

    // Hủy đơn hàng theo ID
    cancelOrder: async (orderId) => {
        const response = await axios.post(`${constants.API_BASE_URL}/orders/${orderId}/cancel`);
        return response.data; // Trả về dữ liệu API
    },

    // Đánh dấu đơn hàng là đã thanh toán
    markOrderAsPaid: async (orderId) => {
        const response = await axios.post(`${constants.API_BASE_URL}/orders/mark-as-paid`, { orderId });
        return response.data; // Trả về dữ liệu API
    },

    // Đánh dấu đơn hàng là đang giao
    markOrderAsShipping: async (orderId) => {
        const response = await axios.post(`${constants.API_BASE_URL}/orders/mark-as-shipping`, { orderId });
        return response.data; // Trả về dữ liệu API
    },

    // Đánh dấu đơn hàng là đã giao
    markOrderAsDelivered: async (orderId) => {
        const response = await axios.post(`${constants.API_BASE_URL}/orders/mark-as-delivered`, { orderId });
        return response.data; // Trả về dữ liệu API
    },

    // Đánh dấu đơn hàng là đã xác nhận
    markOrderAsConfirmed: async (orderId) => {
        const response = await axios.post(`${constants.API_BASE_URL}/orders/mark-as-confirmed`, { orderId });
        return response.data; // Trả về dữ liệu API
    },

    // Đánh dấu đơn hàng là đang chờ
    markOrderAsPending: async (orderId) => {
        const response = await axios.post(`${constants.API_BASE_URL}/orders/mark-as-pending`, { orderId });
        return response.data; // Trả về dữ liệu API
    },
};

export default OrderService;
