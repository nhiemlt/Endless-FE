import axios from 'axios';
import constants from '../utils/globalConstantUtil'; // Import constants

// Sử dụng constants để lấy URL API
const API_URL = `${constants.API_BASE_URL}/api/promotion-details`; // Thay đổi URL bằng constants

const PromotionDetailService = {
    // Lấy danh sách các chi tiết khuyến mãi
    getPromotionDetails: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data.content;
        } catch (error) {
            console.error("Error fetching promotion details:", error);
            throw new Error('Failed to fetch promotion details');
        }
    },

    // Tạo mới chi tiết khuyến mãi
    createPromotionDetail: async (detail) => {
        try {
            const response = await axios.post(API_URL, detail);
            return response.data.content;
        } catch (error) {
            console.error("Error creating promotion detail:", error);
            throw new Error('Failed to create promotion detail');
        }
    },

    // Cập nhật chi tiết khuyến mãi
    updatePromotionDetail: async (id, detail) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, detail);
            return response.data.content;
        } catch (error) {
            console.error(`Error updating promotion detail with ID: ${id}`, error);
            throw new Error('Failed to update promotion detail');
        }
    },

    // Xóa chi tiết khuyến mãi
    deletePromotionDetail: async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
        } catch (error) {
            console.error(`Error deleting promotion detail with ID: ${id}`, error);
            throw new Error('Failed to delete promotion detail');
        }
    }
};

export default PromotionDetailService;
