import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/categories';

const CategoryService = {
    // Lấy danh sách danh mục với phân trang và tìm kiếm
    getCategories: async (params) => {
        try {
            const response = await axios.get(BASE_URL, { params });
            return response.data; // Giả sử API trả về { content: [...], totalPages: ... }
        } catch (error) {
            // Xử lý lỗi nếu cần
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

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
        const response = await axios.put(`${BASE_URL}/${id}`, categoryData);
        return response.data;
    },

    // Xóa danh mục theo ID
    deleteCategory: async (id) => {
        await axios.delete(`${BASE_URL}/${id}`);
    },

    // Lấy danh mục theo ID
    getCategoryById: async (id) => {
        const response = await axios.get(`${BASE_URL}/${id}`);
        return response.data;
    },
};

export default CategoryService;
