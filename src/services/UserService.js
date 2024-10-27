// UserService.js
import axios from "axios";
import constants from '../utils/globalConstantUtil';

const UserService = {
    async getCurrentUser() {
        try {
            const response = await axios.get(`${constants.API_BASE_URL}/api/users/current`);
            return response.data;
        } catch (error) {
            console.error("Error fetching user data:", error);
            throw error;
        }
    },
    
    async getUsers(page = 0, size = 10, keyword = '') {
        try {
            const response = await axios.get(`${constants.API_BASE_URL}/api/users`, {
                params: {
                    page,
                    size,
                    keyword,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    },async getAllUser() {
        try {
            const response = await axios.get(`${constants.API_BASE_URL}/api/users`);
            return response.data; // Dữ liệu người dùng
        } catch (error) {
            console.error("Error fetching user data:", error);
            throw error; // Ném lỗi ra để xử lý sau
        }
    },

    async getInfor(page = 0, size = 10, keyword = '') {
        try {
            const response = await axios.get(`${constants.API_BASE_URL}/api/users/get-infor`, {
                params: {
                    page,
                    size,
                    keyword,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    },
    searchUsersByName: async (name) => {
    const response = await axios.get(
      `${constants.API_BASE_URL}/api/users/search`,
      { params: { name } }
    );
    return response.data;
  },
};

export default UserService;
