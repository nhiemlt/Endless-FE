import axios from 'axios';


const BASE_URL = 'http://localhost:8080/api/product-versions';

const ProductVersionService = {
    // Lấy danh sách tất cả các phiên bản sản phẩm
    getAllProductVersions: async () => {
        try {
            const response = await axios.get(BASE_URL);
            return response.data;
        } catch (error) {
            console.error("Error fetching product versions:", error);
            throw error; // Hoặc xử lý lỗi theo cách khác
        }
    },

    // Lấy phiên bản sản phẩm theo ID
    getProductVersionById: async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching product version with id ${id}:`, error);
            throw error;
        }
    },

    // Tạo phiên bản sản phẩm mới
    createProductVersion: async (productVersionData) => {
        try {
            const response = await axios.post(BASE_URL, productVersionData);
            return response.data;
        } catch (error) {
            console.error("Error creating product version:", error);
            throw error;
        }
    },

    // Cập nhật phiên bản sản phẩm
    updateProductVersion: async (id, productVersionData) => {
        try {
            const response = await axios.put(`${BASE_URL}/${id}`, productVersionData);
            return response.data;
        } catch (error) {
            console.error(`Error updating product version with id ${id}:`, error);
            throw error;
        }
    },

    // 
    //Xóa
    deleteProductVersion: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting product version with id ${id}:`, error);
            throw error;
        }
    },
};

export default ProductVersionService;
