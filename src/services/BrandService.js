import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/brands';

const BrandService = {

    // Lấy danh sách thương hiệu với phân trang và tìm kiếm
    getBrands: async (params) => {
        try {
            const response = await axios.get(BASE_URL, { params });
            return response.data; // Giả sử API trả về { content: [...], totalPages: ... }
        } catch (error) {
            // Xử lý lỗi nếu cần
            console.error('Error fetching brands:', error);
            throw error;
        }
    },

    // Tạo thương hiệu mới
    createBrand: async (brandData) => {
        const response = await axios.post(BASE_URL, brandData);
        return response.data;
    },

    // Cập nhật thương hiệu
    updateBrand: async (id, brandData) => {
        const response = await axios.put(`${BASE_URL}/${id}`, brandData);
        return response.data;
    },


    // Xóa thương hiệu theo ID
    deleteBrand: async (id) => {
        await axios.delete(`${BASE_URL}/${id}`);
    },

    getBrandById: async (id) => {
        const response = await axios.get(`${BASE_URL}/${id}`);
        return response.data;
    },


};

export default BrandService;
