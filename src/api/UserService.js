// UserService.js
import axios from "axios";
import constants from '../utils/globalConstantUtil';

const UserService = {
    async getCurrentUser() {
        try {
            const response = await axios.get(`${constants.API_BASE_URL}/api/users/current`);
            console.log(response.data);
            return response.data; // Dữ liệu người dùng
        } catch (error) {
            console.error("Error fetching user data:", error);
            throw error; // Ném lỗi ra để xử lý sau
        }
    },
};

export default UserService;
