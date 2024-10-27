import axios from 'axios';


const BASE_URL = 'http://localhost:8080/api';

const ProductService = {

    getProducts: async () => axios.get(`${BASE_URL}/products`).then(res => res.data),
    getCategories: async () => axios.get(`${BASE_URL}/categories`).then(res => res.data),
    getBrands: async () => axios.get(`${BASE_URL}/brands`).then(res => res.data),
    createProduct: async (product) => axios.post(`${BASE_URL}/products`, product).then(res => res.data),
    updateProduct: async (id, product) => axios.put(`${BASE_URL}/products/${id}`, product),
    // Xóa
    deleteProduct: async (id) => axios.delete(`${BASE_URL}/products/${id}`)
};

export default ProductService;
