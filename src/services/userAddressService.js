import axios from 'axios';
import constants from '../utils/globalConstantUtil';

const UserAddressService = {
    // Lấy tất cả địa chỉ của người dùng hiện tại
    fetchUserAddresses: async () => {
        try {
            // Gọi API để lấy danh sách địa chỉ của người dùng đang đăng nhập
            const response = await axios.get(`${constants.API_BASE_URL}/api/useraddresses/current`);
            return response.data; // Trả về danh sách địa chỉ
        } catch (error) {
            console.error('Failed to fetch user addresses:', error);
            throw error; // Ném lỗi để xử lý ở nơi khác
        }
    },

    // Thêm địa chỉ cho người dùng hiện tại đang đăng nhập
    addUserAddressCurrent: async (addressData) => {
        try {
            const response = await axios.post(`${constants.API_BASE_URL}/api/useraddresses/add-current`, addressData);
            return response.data;
        } catch (error) {
            if (error.response) {
                console.error("Server error response:", error.response.data);
                throw new Error(error.response.data);
            } else if (error.request) {
                throw new Error("No response from server. Please try again.");
            } else {
                throw new Error("An error occurred: " + error.message);
            }
        }
    },

    // Xóa địa chỉ của người dùng theo addressId
    deleteUserAddressCurrent: async (addressId) => {
        try {
            // Gọi API xóa địa chỉ người dùng với addressId
            await axios.delete(`${constants.API_BASE_URL}/api/useraddresses/current/${addressId}`);
            return { message: 'Địa chỉ đã được xóa thành công' }; // Trả về thông báo thành công
        } catch (error) {
            console.error('Failed to delete user address:', error);
            // Kiểm tra lỗi trả về từ server và ném lỗi để xử lý sau
            if (error.response) {
                // Trả về thông báo lỗi từ API (ví dụ: "Đã xảy ra lỗi khi xóa địa chỉ")
                throw new Error(error.response.data);
            } else if (error.request) {
                throw new Error('Không nhận được phản hồi từ máy chủ. Vui lòng thử lại.');
            } else {
                throw new Error('Đã xảy ra lỗi: ' + error.message);
            }
        }
    },

};

export default UserAddressService;
