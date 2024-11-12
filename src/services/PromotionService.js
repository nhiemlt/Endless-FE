import axios from 'axios';
import constants from '../utils/globalConstantUtil'; // Import constants

// Sử dụng constants để lấy URL API
const API_URL = `${constants.API_BASE_URL}/api/promotions`; // Thay đổi URL bằng constants

const PromotionService = {
    // Lấy danh sách khuyến mãi (với hỗ trợ lọc và phân trang)
    getAllPromotions: async (filters = {}, page = 0, size = 10) => {
        try {
            const { name, startDate, endDate } = filters;

            // Tạo các tham số để gửi đến backend
            const params = {
                name: name || '',          // Nếu không có name thì truyền rỗng
                startDate: startDate || '', // Nếu không có startDate thì truyền rỗng
                endDate: endDate || '',    // Tương tự với endDate
                page: page || 0,           // Mặc định trang là 0
                size: size || 10,          // Mặc định kích thước trang là 10
            };

            // Gọi API với các tham số đã cấu hình
            const response = await axios.get(API_URL, {
                params: params,  // Truyền tham số vào trong params
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy danh sách khuyến mãi:", error);
            throw error;
        }
    },

    // Lấy thông tin khuyến mãi theo ID
    getPromotionById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi lấy khuyến mãi với ID: ${id}`, error);
            throw error;
        }
    },

    // Tạo mới một khuyến mãi
    createPromotion: async (promotionData) => {
        try {
            const response = await axios.post(API_URL, promotionData);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi tạo mới khuyến mãi:", error);
            throw error;
        }
    },

    // Cập nhật khuyến mãi theo ID
    updatePromotion: async (promotionID, promotionData) => {
        try {
            const response = await axios.put(`${API_URL}/${promotionID}`, promotionData);
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi cập nhật khuyến mãi với ID: ${promotionID}`, error);
            throw error;
        }
    },


    // Xóa khuyến mãi theo ID
    deletePromotion: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi xóa khuyến mãi với ID: ${id}`, error);
            throw error;
        }
    },
};

export default PromotionService;