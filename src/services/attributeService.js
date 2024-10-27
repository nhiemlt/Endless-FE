// src/services/attributeService.js
import axios from 'axios';


const API_URL = 'http://localhost:8080/api/attributes'; // Thay đổi URL nếu cần

const attributeService = {
    // Thêm mới thuộc tính
    saveAttribute: async (attribute) => {
        try {
            const response = await axios.post(API_URL, attribute);
            return response.data; // Trả về dữ liệu từ response
        } catch (error) {
            throw new Error('Failed to save attribute');
        }
    },

    getAttributes: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data; // Trả về dữ liệu từ response
        } catch (error) {
            throw new Error('Failed to fetch attributes');
        }
    },

    updateAttribute: async (attributeId, updatedAttribute) => {
        try {
            const response = await axios.put(`${API_URL}/${attributeId}`, updatedAttribute);
            return response.data; // Trả về dữ liệu từ response
        } catch (error) {
            throw new Error('Failed to update attribute');
        }
    },


    deleteAttribute: async (attributeId) => {
        try {
            const response = await axios.delete(`${API_URL}/${attributeId}`);
            return response.data; // Trả về dữ liệu từ response
        } catch (error) {
            throw new Error('Failed to delete attribute');
        }
    },
};

export default attributeService;
