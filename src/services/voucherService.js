import axios from 'axios';
import constants from '../utils/globalConstantUtil';

const VoucherService = {
    // Lấy danh sách vouchers với các tham số phân trang, sắp xếp
    fetchVouchers: async (params) => {
        const response = await axios.get(`${constants.API_BASE_URL}/api/vouchers`, { params });
        return response.data.data; // Trả về dữ liệu vouchers
    },

    // Lấy voucher theo ID
    fetchVoucherById: async (voucherID) => {
        const response = await axios.get(`${constants.API_BASE_URL}/api/vouchers/${voucherID}`);
        console.log(response.data.data)
        return response.data.data; // Trả về dữ liệu voucher
    },

    // Thêm voucher mới
    addVoucher: async (voucherData) => {
        const response = await axios.post(`${constants.API_BASE_URL}/api/vouchers/add`, voucherData);
        return response.data; // Trả về kết quả thêm voucher
    },

    // Cập nhật voucher
    updateVoucher: async (voucherID, updatedData) => {
        const response = await axios.put(`${constants.API_BASE_URL}/api/vouchers/update/${voucherID}`, updatedData);
        return response.data; // Trả về kết quả cập nhật voucher
    },

    // Xóa voucher
    deleteVoucher: async (voucherID) => {
        await axios.delete(`${constants.API_BASE_URL}/api/vouchers/delete/${voucherID}`);
    },
};

export default VoucherService;
