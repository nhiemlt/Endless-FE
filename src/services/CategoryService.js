// src/services/categoryService.js
import axios from 'axios';
import constants from '../utils/globalConstantUtil'; // Import constants

// Sử dụng constants để lấy URL API
const BASE_URL = `${constants.API_BASE_URL}/api/categories`; // Thay đổi URL bằng constants

const CategoryService = {
    // Lấy danh sách danh mục với phân trang và tìm kiếm
    getCategories: async (params) => {
        try {
            const response = await axios.get(BASE_URL, { params });
            return response.data; // Giả sử API trả về { content: [...], totalPages: ... }
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    // Tạo danh mục mới
    createCategory: async (categoryData) => {
        try {
            const response = await axios.post(BASE_URL, categoryData);
            return response.data;
        } catch (error) {
            if (error.response) {
                // Nếu có lỗi từ server (ví dụ lỗi 409)
                if (error.response.status === 409) {
                    throw new Error(error.response.data.message || "Tên danh mục đã tồn tại.");
                }
                // Kiểm tra lỗi 400 (Bad Request)
                if (error.response.status === 400) {
                    throw new Error(error.response.data.message || "Thông tin không hợp lệ.");
                }
                // Xử lý các lỗi khác nếu có
                throw new Error("Đã xảy ra lỗi, vui lòng thử lại sau.");
            }
            // Nếu không có response, có thể là lỗi mạng hoặc server không phản hồi
            throw new Error("Lỗi kết nối với máy chủ.");
        }
    },


    // Cập nhật danh mục
    updateCategory: async (id, categoryData) => {
        try {
            const response = await axios.put(`${BASE_URL}/${id}`, categoryData);
            return response.data;
        } catch (error) {
            console.error('Error updating category:', error);
            throw error;
        }
    },

    // Xóa danh mục theo ID
    deleteCategory: async (id) => {
        try {
            await axios.delete(`${BASE_URL}/${id}`);
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    },

    // Lấy danh mục theo ID
    getCategoryById: async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching category by id:', error);
            throw error;
        }
    },
};

export default CategoryService;
