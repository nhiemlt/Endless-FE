import axios from 'axios';


const BASE_URL = 'http://localhost:8080/api/promotion-products';

const PromotionProductService = {
    //Lấy danh sách
    getPromotionProducts: async () => {
        const response = await axios.get(BASE_URL);
        return response.data;
    },

    createPromotionProduct: async (product) => {
        const response = await axios.post(BASE_URL, product);
        return response.data;
    },

    updatePromotionProduct: async (id, product) => {
        const response = await axios.put(`${BASE_URL}/${id}`, product);
        return response.data;
    },

    deletePromotionProduct: async (id) => {
        await axios.delete(`${BASE_URL}/${id}`);
    }
};

export default PromotionProductService;
