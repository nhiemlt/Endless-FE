import axios from 'axios';
import constants from '../utils/globalConstantUtil'; // Import constants

// Sử dụng constants để lấy URL API
const API_URL = `${constants.API_BASE_URL}/api/promotion-products`; // Thay đổi URL bằng constants

const PromotionProductService = {
    // Lấy danh sách các sản phẩm khuyến mãi với phân trang và lọc theo percentDiscount
    getAllPromotionProducts: (page = 0, size = 10, percentDiscount = null) => {
        let url = `${API_URL}?page=${page}&size=${size}`;

        // Nếu có percentDiscount thì thêm vào query params
        if (percentDiscount) {
            url += `&percentDiscount=${percentDiscount}`;
        }

        return axios.get(url)
            .then(response => response.data)
            .catch(error => {
                console.error('There was an error fetching the promotion products!', error);
                throw error;
            });
    },

    // Thêm một PromotionProduct mới
    createPromotionProduct: (promotionDetailID, productVersionIDs) => {
        const requestBody = {
            promotionDetailID,
            productVersionIDs
        };

        return axios.post(API_URL, requestBody)
            .then(response => response.data)
            .catch(error => {
                console.error('There was an error creating the promotion product!', error);
                throw error;
            });
    },

    // Cập nhật PromotionProduct theo ID
    updatePromotionProduct: (id, promotionProductModel) => {
        return axios.put(`${API_URL}/${id}`, promotionProductModel)
            .then(response => response.data)
            .catch(error => {
                console.error('There was an error updating the promotion product!', error);
                throw error;
            });
    },

    // Xóa PromotionProduct theo ID
    deletePromotionProduct: (id) => {
        return axios.delete(`${API_URL}/${id}`)
            .then(() => { })
            .catch(error => {
                console.error('There was an error deleting the promotion product!', error);
                throw error;
            });
    }
};

export default PromotionProductService;