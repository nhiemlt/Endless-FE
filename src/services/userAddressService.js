import axios from 'axios';
import constants from '../utils/globalConstantUtil';

const UserAddressService = {
    // Lấy tất cả địa chỉ của người dùng theo userId
    fetchUserAddresses: async (userId) => {
        try {
            const response = await axios.get(`${constants.API_BASE_URL}/api/useraddresses/${userId}`);
            return response.data; // Trả về danh sách địa chỉ
        } catch (error) {
            console.error('Failed to fetch user addresses:', error);
            throw error; // Ném lỗi để xử lý ở nơi khác
        }
    },

    // Thêm địa chỉ mới
    addUserAddress: async (addressData) => {
        try {
            console.log("Adding address with data:", addressData); // Thêm log để xem dữ liệu
            const response = await axios.post(`${constants.API_BASE_URL}/api/useraddresses/add-current`, addressData);
            return response.data; // Trả về kết quả thêm địa chỉ
        } catch (error) {
            // Xử lý lỗi và trả về thông báo lỗi phù hợp
            if (error.response) {
                console.error("Server error response:", error.response.data); // Log thông tin lỗi từ server
                throw new Error(error.response.data); // Ném ra thông báo lỗi từ server
            } else if (error.request) {
                throw new Error("No response from server. Please try again.");
            } else {
                throw new Error("An error occurred: " + error.message);
            }
        }
    },
    
    // Cập nhật địa chỉ của người dùng
    updateUserAddress: async (userId, addressId, updatedData) => {
        try {
            const response = await axios.put(`${constants.API_BASE_URL}/api/useraddresses/${userId}/${addressId}`, updatedData);
            return response.data; // Trả về kết quả cập nhật địa chỉ
        } catch (error) {
            console.error('Failed to update user address:', error);
            throw error; // Ném lỗi để xử lý ở nơi khác
        }
    },

    // Xóa địa chỉ của người dùng theo addressId
    deleteUserAddress: async (addressId) => {
        try {
            await axios.delete(`${constants.API_BASE_URL}/api/useraddresses/${addressId}`);
            return { message: 'Address deleted successfully' }; // Trả về thông báo thành công
        } catch (error) {
            console.error('Failed to delete user address:', error);
            throw error; // Ném lỗi để xử lý ở nơi khác
        }
    },

    // Lấy danh sách tất cả các tỉnh
    fetchProvinces: async () => {
        try {
            const response = await axios.get(`${constants.API_BASE_URL}/api/useraddresses/provinces`);
            return response.data; // Trả về danh sách tỉnh
        } catch (error) {
            console.error('Failed to fetch provinces:', error);
            throw error; // Ném lỗi để xử lý ở nơi khác
        }
    },

    // Lấy danh sách huyện theo mã tỉnh
    fetchDistrictsByProvince: async (provinceCode) => {
        try {
            const response = await axios.get(`${constants.API_BASE_URL}/api/useraddresses/${provinceCode}/districts`);
            return response.data; // Trả về danh sách huyện của tỉnh
        } catch (error) {
            console.error('Failed to fetch districts:', error);
            throw error; // Ném lỗi để xử lý ở nơi khác
        }
    },

    // Lấy danh sách xã/phường theo mã huyện
    fetchWardsByDistrict: async (districtCode) => {
        try {
            const response = await axios.get(`${constants.API_BASE_URL}/api/useraddresses/districts/${districtCode}/wards`);
            return response.data; // Trả về danh sách xã/phường của huyện
        } catch (error) {
            console.error('Failed to fetch wards:', error);
            throw error; // Ném lỗi để xử lý ở nơi khác
        }
    },
};

export default UserAddressService;
