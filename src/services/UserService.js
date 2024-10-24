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
    },
};

export default UserService;
