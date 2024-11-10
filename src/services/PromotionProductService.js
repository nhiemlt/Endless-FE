import axios from 'axios';
import constants from '../utils/globalConstantUtil'; // Import constants

// Sử dụng constants để lấy URL API
const API_URL = `${constants.API_BASE_URL}/api/promotion-products`; // Thay đổi URL bằng constants

const PromotionProductService = {
    // Lấy danh sách các sản phẩm khuyến mãi
    getPromotionProducts: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error("Error fetching promotion products:", error);
            throw new Error('Failed to fetch promotion products');
        }
    },

    // Tạo mới sản phẩm khuyến mãi
    createPromotionProduct: async (product) => {
        try {
            const response = await axios.post(API_URL, product);
            return response.data;
        } catch (error) {
            console.error("Error creating promotion product:", error);
            throw new Error('Failed to create promotion product');
        }
    },

    // Cập nhật sản phẩm khuyến mãi
    updatePromotionProduct: async (id, product) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, product);
            return response.data;
        } catch (error) {
            console.error(`Error updating promotion product with ID: ${id}`, error);
            throw new Error('Failed to update promotion product');
        }
    },

    // Xóa sản phẩm khuyến mãi
    deletePromotionProduct: async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
        } catch (error) {
            console.error(`Error deleting promotion product with ID: ${id}`, error);
            throw new Error('Failed to delete promotion product');
        }
    }
};

export default PromotionProductService;
