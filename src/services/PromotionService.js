import axios from 'axios';
import constants from '../utils/globalConstantUtil'; // Import constants

// Sử dụng constants để lấy URL API
const API_URL = `${constants.API_BASE_URL}/api/promotions`; // Thay đổi URL bằng constants

const PromotionService = {
    // Lấy danh sách khuyến mãi (với hỗ trợ tìm kiếm, phân trang, và sắp xếp)
    getAllPromotions: async (filters = {}, page = 0, size = 10, sortBy = 'createDate', direction = 'asc') => {
        try {
            const { keyword } = filters; // Lấy keyword từ bộ lọc (nếu có)

            // Tạo các tham số để gửi đến backend
            const params = {
                keyword: keyword || '',      // Từ khóa tìm kiếm (nếu không có thì rỗng)
                page: page || 0,            // Trang hiện tại (mặc định là 0)
                size: size || 10,           // Số lượng bản ghi mỗi trang (mặc định là 10)
                sortBy: sortBy || 'createDate', // Tiêu chí sắp xếp (mặc định theo createDate)
                direction: direction || 'asc', // Hướng sắp xếp (mặc định là asc)
            };

            // Gọi API với các tham số đã cấu hình
            const response = await axios.get(API_URL, {
                params: params, // Truyền tham số vào trong params
            });

            return response.data; // Trả về dữ liệu từ API
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