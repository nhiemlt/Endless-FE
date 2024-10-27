import axios from 'axios';


const BASE_URL = 'http://localhost:8080/api/promotion-details';

const PromotionDetailService = {
    //Lấy danh sách
    getPromotionDetails: async () => {
        const response = await axios.get(BASE_URL);
        return response.data;
    },

    createPromotionDetail: async (detail) => {
        const response = await axios.post(BASE_URL, detail);
        return response.data;
    },

    updatePromotionDetail: async (id, detail) => {
        const response = await axios.put(`${BASE_URL}/${id}`, detail);
        return response.data;
    },

    deletePromotionDetail: async (id) => {
        await axios.delete(`${BASE_URL}/${id}`);
    }
};

export default PromotionDetailService;
