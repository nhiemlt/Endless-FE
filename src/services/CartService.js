import axios from 'axios';
import constants from '../utils/globalConstantUtil';

const CartService = {
    // Lấy danh sách giỏ hàng
    async getCarts() {
        try {
            const response = await axios.get(`${constants.API_BASE_URL}/carts`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Thêm sản phẩm vào giỏ hàng
    async addToCart(cartModel) {
        try {
            const response = await axios.post(`${constants.API_BASE_URL}/carts/add-to-cart`, cartModel);
            return response.data;
        } catch (error) {
            if (error.response) {
                // Xử lý các lỗi dựa trên mã trạng thái HTTP
                const status = error.response.status;
                const errorMessage = error.response.data.message || error.message;

                if (status === 404) {
                    throw new Error("Người dùng không tìm thấy");
                } else if (status === 400) {
                    // Có thể có hai loại lỗi 400: phiên bản sản phẩm không tìm thấy hoặc số lượng vượt quá tồn kho
                    if (errorMessage.includes("Phiên bản sản phẩm không tìm thấy")) {
                        throw new Error("Phiên bản sản phẩm không tìm thấy");
                    } else if (errorMessage.includes("Số lượng vượt quá sản phẩm tồn kho")) {
                        throw new Error("Số lượng vượt quá sản phẩm tồn kho");
                    }
                }
            }
            throw new Error("Đã xảy ra lỗi không mong muốn: " + (error.message || "Không xác định"));
        }
    },

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    async updateCartQuantity(cartModel) {
        console.log("Updating cart with data:", cartModel); // In ra cartModel để kiểm tra dữ liệu gửi lên
        try {
            const response = await axios.put(`${constants.API_BASE_URL}/carts/update`, cartModel);
            console.log("Update successful:", response.data); // In ra response nếu thành công
            return response.data;
        } catch (error) {
            // Xử lý lỗi trả về từ backend
            if (error.response) {
                const status = error.response.status;
                const errorMessage = error.response.data.message || error.message;

                console.log("Error response:", error.response.data); // Log chi tiết lỗi từ backend

                if (status === 404) {
                    throw new Error("Sản phẩm trong giỏ hàng không tìm thấy");
                } else if (status === 400) {
                    if (errorMessage.includes("Số lượng vượt quá sản phẩm tồn kho")) {
                        throw new Error("Số lượng vượt quá sản phẩm tồn kho");
                    } else if (errorMessage.includes("Phiên bản sản phẩm không tìm thấy")) {
                        throw new Error("Phiên bản sản phẩm không tìm thấy");
                    }
                }
            }
            // Lỗi không mong muốn khác
            throw new Error("Đã xảy ra lỗi không mong muốn: " + (error.message || "Không xác định"));
        }
    },

    // Xóa sản phẩm khỏi giỏ hàng
    async deleteCartItem(productVersionID) {
        try {
            const response = await axios.delete(`${constants.API_BASE_URL}/carts/${productVersionID}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Lấy tổng số lượng sản phẩm trong giỏ hàng
    async getTotalCartQuantity() {
        try {
            const response = await axios.get(`${constants.API_BASE_URL}/carts/total-quantity`);
            return response.data; // Giả định response.data chứa tổng số lượng
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
};

export default CartService;
