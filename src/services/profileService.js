import axios from 'axios';
import constants from '../utils/globalConstantUtil';

const ProfileService = {
    // Lấy tất cả người dùng với phân trang và tìm kiếm
    fetchUsers: async (page = 0, size = 10, keyword = '') => {
        const response = await axios.get(`${constants.API_BASE_URL}/api/users`, {
            params: { page, size, keyword }
        });
        return response.data.content; // Trả về danh sách người dùng
    },

    // Lấy người dùng theo ID
    fetchUserById: async (userId) => {
        const response = await axios.get(`${constants.API_BASE_URL}/api/users/${userId}`);
        return response.data; // Trả về dữ liệu người dùng
    },

    // Lấy thông tin người dùng hiện tại
    fetchCurrentUser: async () => {
        const response = await axios.get(`${constants.API_BASE_URL}/api/users/current`);
        return response.data; // Trả về thông tin người dùng hiện tại
    },

    // Thêm người dùng mới
    addUser: async (userData) => {
        const response = await axios.post(`${constants.API_BASE_URL}/api/users`, userData);
        return response.data; // Trả về dữ liệu người dùng mới được thêm
    },

    // Cập nhật người dùng theo ID
    updateUser: async (userId, updatedData) => {
        const response = await axios.put(`${constants.API_BASE_URL}/api/users/${userId}`, updatedData);
        return response.data; // Trả về dữ liệu người dùng đã cập nhật
    },

    // Cập nhật thông tin người dùng hiện tại (bao gồm avatar nếu cần)
    updateCurrentUser: async (updatedData) => {
        try {
            // Gửi yêu cầu PUT để cập nhật dữ liệu người dùng
            const response = await axios.put(`${constants.API_BASE_URL}/api/users/current`, updatedData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return response.data; // Trả về dữ liệu người dùng đã cập nhật
        } catch (error) {
            // Nếu có lỗi 400, hiển thị thông báo lỗi từ backend
            if (error.response && error.response.status === 400) {
                throw new Error(error.response.data.errors.join(', ')); // Kết hợp các thông báo lỗi thành một chuỗi
            } else if (error.response && Array.isArray(error.response.data)) {
                throw new Error(error.response.data.message || 'Đã xảy ra lỗi không xác định'); // Lấy thông điệp từ ngoại lệ
            } else {
                console.error('Error updating user:', error);
                throw new Error('Đã xảy ra lỗi khi cập nhật người dùng'); // Thông báo lỗi tổng quát
            }
        }
    },

    // Xóa người dùng theo ID
    deleteUser: async (userId) => {
        await axios.delete(`${constants.API_BASE_URL}/api/users/${userId}`);
    },
};

export default ProfileService;
