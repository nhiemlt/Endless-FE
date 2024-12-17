import axios from 'axios';
import constants from '../utils/globalConstantUtil';

const OrderService = {

    // Lấy tất cả đơn hàng của người dùng hiện tại
    getAllOrderByUserLogin: async (searchText) => {
        const response = await axios.get(`${constants.API_BASE_URL}/orders/user`, {
            params: { keywords: searchText},
        });
        return response.data; // Trả về dữ liệu API
    },

    getAllOrders: async (keywords, page = 0, size = 10, statusId = '10') => {
        try {
            // Gọi API để lấy danh sách đơn hàng
            const response = await axios.get(`${constants.API_BASE_URL}/orders`, {
                params: {
                    keywords,
                    page,
                    size,
                    statusId,
                },
            });

            // Trả về dữ liệu từ phản hồi API
            return response.data;
        } catch (error) {
            // Log lỗi ra console
            console.error("Error fetching orders:", error);

            // Quăng lỗi ra ngoài để xử lý
            throw error;
        }
    },


    // Tạo đơn hàng mới từ frontend
    createOrder: async (orderModel) => {
        try {
            console.log(orderModel);
            const response = await axios.post(`${constants.API_BASE_URL}/orders`, orderModel);
            return response.data;
        } catch (error) {
            console.error("Error creating order:", error.response?.data || error.message);
            throw error;
        }
    },

    // Tạo đơn hàng mới VNPAY
    createOrderOnline: async (orderModel) => {
        const response = await axios.post(`${constants.API_BASE_URL}/orders/create-order-online`, orderModel);
        return response.data; // Trả về dữ liệu API
    },

    // Tạo đơn hàng thanh toán (gọi API tạo thanh toán ZaloPay)
    createPayment: async (orderId) => {
        try {
            const response = await axios.post(`${constants.API_BASE_URL}/api/payment/create/${orderId}`);
            return response.data; // Trả về dữ liệu từ API
        } catch (error) {
            console.error("Lỗi khi tạo thanh toán ZaloPay:", error);
            throw error; // Ném lại lỗi để xử lý ở nơi gọi
        }
    },

    // Tạo URL thanh toán VNPAY
    createVNPayPaymentUrl: async (orderId) => {
        try {
            const response = await axios.post(`${constants.API_BASE_URL}/api/payment/create-payment-url/${orderId}`);
            return response.data; // Trả về URL thanh toán từ API
        } catch (error) {
            console.error("Lỗi khi tạo URL thanh toán VNPAY:", error.response?.data || error.message);
            throw error; // Ném lỗi để xử lý tại nơi gọi hàm
        }
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

    cancelOrderPaid: async (orderId) => {
        const response = await axios.post(`${constants.API_BASE_URL}/orders/${orderId}/cancel-paid`);
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
