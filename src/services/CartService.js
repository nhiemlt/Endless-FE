import axios from 'axios';
import constants from '../utils/globalConstantUtil';

const CartService = {
    // Lấy danh sách giỏ hàng
    async getCarts() {
        try {
            const response = await axios.get(`${constants.API_BASE_URL}/api/carts`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Thêm sản phẩm vào giỏ hàng
    async addToCart(cartModel) {
        try {
            const response = await axios.post(`${constants.API_BASE_URL}/api/carts/add-to-cart`, cartModel);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    async updateCartQuantity(cartModel) {
        try {
            const response = await axios.put(`${constants.API_BASE_URL}/api/carts/update`, cartModel);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Xóa sản phẩm khỏi giỏ hàng
    async deleteCartItem(productVersionID) {
        try {
            const response = await axios.delete(`${constants.API_BASE_URL}/api/carts/${productVersionID}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
};

export default CartService;
