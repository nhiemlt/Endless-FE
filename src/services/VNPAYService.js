import axios from 'axios';
import constants from '../utils/globalConstantUtil';

const VNPAYService = {};

// API lấy danh sách ngân hàng
VNPAYService.getBanks = async () => {
  try {
    const response = await axios.get(`${constants.VNPAY_API_URL}/v2/banks`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${constants.VNPAY_ACCESS_TOKEN}`, // Nếu cần token
      },
    });

    // Kiểm tra nếu phản hồi thành công
    if (response.status === 200) {
      return response.data; // Trả về dữ liệu danh sách ngân hàng
    } else {
      throw new Error('Không thể lấy danh sách ngân hàng');
    }
  } catch (error) {
    console.error('Lỗi khi gọi API lấy danh sách ngân hàng:', error);
    throw error; // Ném lại lỗi để xử lý ở nơi gọi
  }
};

export default VNPAYService;
