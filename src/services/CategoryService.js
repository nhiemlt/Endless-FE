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
            if (error.response && error.response.status === 409) { // 409 Conflict
                throw new Error(error.response.data); // Ném lại lỗi cho frontend
            }
            throw error; // Ném lại lỗi khác
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
