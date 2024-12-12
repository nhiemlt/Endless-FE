// src/services/productService.js
import axios from 'axios';
import constants from '../utils/globalConstantUtil'; // Import constants

// Sử dụng constants để lấy URL API
const BASE_URL = `${constants.API_BASE_URL}/api/products`; // Thay đổi URL bằng constants

const ProductService = {
    // Lấy danh sách sản phẩm hoặc thông tin chi tiết theo ID
    getProducts: async (keyword = '', page = 0, size = 10, sortBy = 'createDate', direction = 'asc', categoryID = '', brandID = '') => {
        try {
            const params = {
                keyword,
                page,
                size,
                sortBy,
                direction,
                categoryID: categoryID || undefined,  // Đảm bảo tham số là 'categoryID' không phải 'categoryId'
                brandID: brandID || undefined         // Tương tự với 'brandID'
            };

            const response = await axios.get(BASE_URL, { params });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },


    // Phương thức để lấy danh sách danh mục
    getCategories: async () => {
        try {
            const response = await axios.get(`${constants.API_BASE_URL}/api/categories`); // Thay đổi URL
            return response.data.content;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },

    // Phương thức để lấy danh sách thương hiệu
    getBrands: async () => {
        try {
            const response = await axios.get(`${constants.API_BASE_URL}/api/brands`); // Thay đổi URL
            return response.data.content;
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },

    // Lấy thông tin sản phẩm theo ID
    getProductById: async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/${id}`);
            return response.data; // Trả về sản phẩm theo ID
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },

    // Thêm sản phẩm mới
    addProduct: async (productModel) => {
        try {
            const response = await axios.post(BASE_URL, productModel);
            return response.data; // Trả về sản phẩm mới tạo
        } catch (error) {
            console.error('Error adding product:', error);
            throw error.response ? error.response.data : error.message;
        }
    },

    // Cập nhật sản phẩm
    updateProduct: async (id, productModel) => {
        try {
            const response = await axios.put(`${BASE_URL}/${id}`, productModel);
            return response.data; // Trả về sản phẩm đã cập nhật
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },

    // Xóa sản phẩm
    deleteProduct: async (id) => {
        try {
            await axios.delete(`${BASE_URL}/${id}`);
            return "Xóa sản phẩm thành công."; // Thông báo xóa thành công
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    }
};

export default ProductService;
