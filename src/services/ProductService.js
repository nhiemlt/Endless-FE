import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/products';

const ProductService = {
    // Lấy danh sách sản phẩm hoặc thông tin chi tiết theo ID
    getProducts: async (keyword, page = 0, size = 10) => {
        try {
            const response = await axios.get(BASE_URL, {
                params: { keyword, page, size }
            });
            return response.data; // Trả về toàn bộ dữ liệu phân trang
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },

    // Phương thức để lấy danh sách danh mục
    getCategories: async () => {
        const response = await axios.get('http://localhost:8080/api/categories'); // Thay đổi URL cho phù hợp với API của bạn
        return response.data.content;
    },
    // Phương thức để lấy danh sách thương hiệu
    getBrands: async () => {
        const response = await axios.get('http://localhost:8080/api/brands'); // Thay đổi URL cho phù hợp với API của bạn
        return response.data.content;
    },

    getProductById: async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/${id}`);
            return response.data; // Trả về sản phẩm theo ID
        } catch (error) {
            throw error.response ? error.response.data : error.message;
        }
    },

    addProduct: async (productModel) => {
        try {
            const response = await axios.post(BASE_URL, productModel);
            return response.data; // Trả về sản phẩm mới tạo
        } catch (error) {
            console.error('Error adding product:', error); // In ra thông báo lỗi chi tiết
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
