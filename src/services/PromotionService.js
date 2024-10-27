import axios from 'axios';


const BASE_URL = 'http://localhost:8080/api/promotions';

const PromotionService = {
    //Lấy danh sách
    getPromotions: async () => {
        const response = await axios.get(BASE_URL);
        return response.data;
    },

    createPromotion: async (promotion) => {
        const response = await axios.post(BASE_URL, promotion);
        return response.data;
    },

    updatePromotion: async (id, promotion) => {
        const response = await axios.put(`${BASE_URL}/${id}`, promotion);
        return response.data;
    },

    deletePromotion: async (id) => {
        await axios.delete(`${BASE_URL}/${id}`);
    }
};

export default PromotionService;
