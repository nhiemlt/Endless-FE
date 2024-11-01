import axios from 'axios';
import constants from '../utils/globalConstantUtil';

const UserVoucherService = {
  getUserVouchers: async () => {
    try {
        const response = await axios.get(`${constants.API_BASE_URL}/api/user-vouchers`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return { message: "User chưa đăng nhập." };
      } else if (error.response && error.response.status === 204) {
        return { message: "Không có voucher còn hạn sử dụng." };
      } else {
        console.error("Error fetching user vouchers:", error);
        return { message: "Lỗi khi lấy danh sách voucher." };
      }
    }
  },
};

export default UserVoucherService;
