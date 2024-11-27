// src/services/attributeService.js
import axios from 'axios';
import constants from '../utils/globalConstantUtil'; // Import constants

// Sử dụng constants để lấy URL API
const API_URL = `${constants.API_BASE_URL}/api/attributes`; // Thay đổi URL bằng constants

const attributeService = {
    // Lấy tất cả thuộc tính với các tham số lọc, tìm kiếm, và phân trang
    getAttributes: async (id = '', name = '', page = 0, size = 10) => {
        try {
            const response = await axios.get(API_URL, {
                params: { id, name, page, size },
            });
            console.log(response.data); // In ra để kiểm tra
            return response; // Trả về toàn bộ phản hồi để sau này bạn có thể truy cập vào response.data
        } catch (error) {
            console.error(error); // In ra chi tiết lỗi
            throw new Error('Failed to fetch attributes');
        }
    },

    // Thêm mới thuộc tính
    createAttribute: async (attributeDTO) => {
        try {
            const response = await axios.post(API_URL, attributeDTO);
            return response.data;
        } catch (error) {
            console.error("Error in createAttribute:", error.response ? error.response.data : error.message);
            throw new Error(error.response ? error.response.data.message : 'Failed to create attribute');
        }
    },

    // Cập nhật thuộc tính
    updateAttribute: async (id, attributeDTO) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, attributeDTO);
            return response.data;
        } catch (error) {
            throw new Error('Failed to update attribute');
        }
    },

    // Xóa thuộc tính
    deleteAttribute: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            throw new Error('Failed to delete attribute');
        }
    },
};

export default attributeService;