import axios from 'axios';
import constants from '../utils/globalConstantUtil'; // Adjust the path to your file structure

const BASE_URL = constants.API_BASE_URL + '/api/product-versions';

const ProductVersionService = {
    // Lấy danh sách tất cả các phiên bản sản phẩm
    getAllProductVersions: async (page = 0, size = 10, sortBy = 'versionName', direction = 'ASC', keyword = '') => {
        try {
            const response = await axios.get(BASE_URL, {
                params: { page, size, sortBy, direction, keyword },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching all product versions:", error);
            throw error;
        }
    },

    // Lấy danh sách phiên bản sản phẩm cho người dùng
    searchProductVersions: async (page = 0, size = 10, sortBy = 'versionName', direction = 'ASC', keyword = '') => {
        try {
            const response = await axios.get(`${BASE_URL}/get-user`, {
                params: { page, size, sortBy, direction, keyword },
            });
            return response.data;
        } catch (error) {
            console.error("Error searching product versions:", error);
            throw error;
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

    // Lọc phiên bản sản phẩm theo điều kiện
    filterProductVersions: async (filterData) => {
        try {
            const response = await axios.post(`${BASE_URL}/filter`, filterData);
            return response.data;
        } catch (error) {
            console.error("Error filtering product versions:", error);
            throw error;
        }
    },

    // Lấy top phiên bản sản phẩm bán chạy tháng này
    getTopSellingProductVersions: async (page = 0, size = 5) => {
        try {
            const response = await axios.get(`${BASE_URL}/top-selling`, { params: { page, size } });
            return response.data;
        } catch (error) {
            console.error("Error fetching top-selling product versions:", error);
            throw error;
        }
    },

    // Lấy top phiên bản sản phẩm bán chạy mọi thời đại
    getTopSellingProductVersionsAllTime: async (page = 0, size = 5) => {
        try {
            const response = await axios.get(`${BASE_URL}/top-selling/all-time`, { params: { page, size } });
            return response.data;
        } catch (error) {
            console.error("Error fetching top-selling product versions of all time:", error);
            throw error;
        }
    },

    // Lấy top 5 sản phẩm bán chạy nhất theo danh mục
    getTopSellingProductsByCategory: async (categoryID, page = 0, size = 5) => {
        try {
            const response = await axios.get(`${BASE_URL}/top5ByCategory/${categoryID}`, {
                params: { page, size },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching top-selling products by category ${categoryID}:`, error);
            throw error;
        }
    },

    // Lấy top 5 sản phẩm bán chạy nhất theo thương hiệu
    getTopSellingProductsByBrand: async (brandID, page = 0, size = 5) => {
        try {
            const response = await axios.get(`${BASE_URL}/top5ByBrand/${brandID}`, {
                params: { page, size },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching top-selling products by brand ${brandID}:`, error);
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

    // Cập nhật trạng thái phiên bản sản phẩm
    updateProductVersionStatus: async (id, status) => {
        try {
            const response = await axios.put(`${BASE_URL}/${id}/status?status=${status}`);
            return response.data;
        } catch (error) {
            console.error(`Error updating status for product version with id ${id}:`, error);
            throw error;
        }
    },

    // Xóa phiên bản sản phẩm
    deleteProductVersion: async (id) => {
        try {
            const response = await axios.delete(`${BASE_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting product version with id ${id}:`, error);
            throw error;
        }
    },
    // Lấy số lượng sản phẩm
    getProductCount: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/count-products`);
            return response.data;
        } catch (error) {
            console.error("Error fetching product count:", error);
            throw error;
        }
    },
    // Lấy số lượng thương hiệu
    getBrandCount: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/count-brands`);
            return response.data;
        } catch (error) {
            console.error("Error fetching brand count:", error);
            throw error;
        }
    },
    // Lấy danh sách phiên bản sản phẩm đã sắp xếp
    getSortedProductVersions: async (sortBy = 'versionName', direction = 'ASC') => {
        try {
            const response = await axios.get(`${BASE_URL}/sorted`, {
                params: { sortBy, direction }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching sorted product versions:", error);
            throw error;
        }
    },

};

export default ProductVersionService;