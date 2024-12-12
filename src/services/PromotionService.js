import axios from 'axios';
import constants from '../utils/globalConstantUtil'; // Import constants

// Sử dụng constants để lấy URL API
const API_URL = `${constants.API_BASE_URL}/api/promotions`; // Thay đổi URL bằng constants

const PromotionService = {
    // Lấy danh sách khuyến mãi (với hỗ trợ tìm kiếm, phân trang, và sắp xếp)
    getAllPromotions: async (filters = {}, page = 0, size = 10, sortBy = 'createDate', direction = 'asc') => {
        try {
            const { keyword, startDate, endDate } = filters; // Lấy từ khóa và ngày từ bộ lọc

            // Tạo các tham số để gửi đến backend
            const params = {
                keyword: keyword || '',        // Từ khóa tìm kiếm
                startDate: startDate ? new Date(startDate).toISOString() : '',  // Chuyển đổi startDate thành ISO format (bao gồm giờ)
                endDate: endDate ? new Date(endDate).toISOString() : '',        // Chuyển đổi endDate thành ISO format (bao gồm giờ)
                page: page || 0,               // Trang hiện tại
                size: size || 10,              // Số lượng bản ghi mỗi trang
                sortBy: sortBy || 'createDate', // Tiêu chí sắp xếp
                direction: direction || 'asc',  // Hướng sắp xếp
            };

            const response = await axios.get(API_URL, { params });

            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy danh sách khuyến mãi:", error);
            throw error; // Ném lỗi để xử lý ở cấp cao hơn
        }
    },


    // Lấy thông tin khuyến mãi theo ID
    getPromotionById: async (promotionID) => {
        try {
            const response = await axios.get(`${API_URL}/${promotionID}`);
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi lấy khuyến mãi với ID: ${promotionID}`, error);
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

    // Toggle trạng thái active của khuyến mãi
    togglePromotionActive: async (promotionID) => {
        try {
            const response = await axios.post(`${API_URL}/${promotionID}/toggle`);
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi thay đổi trạng thái active của khuyến mãi với ID: ${promotionID}`, error);
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