// src/services/brandService.js
import axios from 'axios';
import constants from '../utils/globalConstantUtil'; // Import constants

// Sử dụng constants để lấy URL API
const BASE_URL = `${constants.API_BASE_URL}/api/brands`; // Thay đổi URL bằng constants

const BrandService = {

    // Lấy danh sách thương hiệu với phân trang và tìm kiếm
    getBrands: async (params) => {
        try {
            const response = await axios.get(BASE_URL, { params });
            return response.data; // Giả sử API trả về { content: [...], totalPages: ... }
        } catch (error) {
            console.error('Error fetching brands:', error);
            throw error;
        }
    },

    // Tạo thương hiệu mới
    createBrand: async (brandData) => {
        try {
            const response = await axios.post(BASE_URL, brandData);
            return response.data;
        } catch (error) {
            console.error('Error creating brand:', error);
            throw error;
        }
    },

    // Cập nhật thương hiệu
    updateBrand: async (id, brandData) => {
        try {
            const response = await axios.put(`${BASE_URL}/${id}`, brandData);
            return response.data;
        } catch (error) {
            console.error('Error updating brand:', error);
            throw error;
        }
    },

    // Xóa thương hiệu theo ID
    deleteBrand: async (id) => {
        try {
            await axios.delete(`${BASE_URL}/${id}`);
        } catch (error) {
            console.error('Error deleting brand:', error);
            throw error;
        }
    },

    // Lấy thông tin thương hiệu theo ID
    getBrandById: async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching brand by id:', error);
            throw error;
        }
    },

};

export default BrandService;
