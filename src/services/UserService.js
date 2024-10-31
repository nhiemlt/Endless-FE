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
            return response.data;
        } catch (error) {
            console.error("Error fetching user data:", error);
            throw error;
        }
    },

    async getUserById(userId) {
        try {
            const response = await axios.get(`${constants.API_BASE_URL}/api/users/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching user by ID:", error);
            throw error;
        }
    },

    async createUser(userData) {
        try {
            const response = await axios.post(`${constants.API_BASE_URL}/api/users`, userData);
            return response.data;
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    },

    async updateUser(userId, userData) {
        try {
            const response = await axios.put(`${constants.API_BASE_URL}/api/users/${userId}`, userData);
            return response.data;
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    },

    async deleteUser(userId) {
        try {
            const response = await axios.delete(`${constants.API_BASE_URL}/api/users/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting user:", error);
            throw error;
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
