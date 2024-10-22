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

    // Cập nhật thông tin người dùng hiện tại (không bao gồm avatar)
    updateCurrentUser: async (updatedData) => {
        // Tạo đối tượng chứa dữ liệu cần cập nhật
        const { avatar, ...dataToUpdate } = updatedData; // Loại bỏ avatar

        // Gửi yêu cầu cập nhật
        const response = await axios.put(`${constants.API_BASE_URL}/api/users/current`, dataToUpdate, {
            headers: {
                'Content-Type': 'application/json', // Đặt Content-Type cho yêu cầu
            },
        });
        return response.data; // Trả về dữ liệu người dùng hiện tại đã cập nhật
    },

    // Xóa người dùng theo ID
    deleteUser: async (userId) => {
        await axios.delete(`${constants.API_BASE_URL}/api/users/${userId}`);
    },
};

export default ProfileService;
