import axios from 'axios';
import constants from '../utils/globalConstantUtil';

const VoucherService = {
    // Lấy danh sách vouchers với các tham số phân trang, sắp xếp, và tìm kiếm theo voucherCode
    fetchVouchers: async (params) => {
        try {
            const response = await axios.get(`${constants.API_BASE_URL}/api/vouchers`, { params });
            return response.data.data; // Trả về dữ liệu vouchers
        } catch (error) {
            VoucherService.handleError(error); // Gọi handleError để xử lý lỗi
        }
    },


    // Lấy voucher theo ID
    fetchVoucherById: async (voucherID) => {
        try {
            const response = await axios.get(`${constants.API_BASE_URL}/api/vouchers/${voucherID}`);
            return response.data.data; // Trả về dữ liệu voucher
        } catch (error) {
            VoucherService.handleError(error); // Gọi handleError để xử lý lỗi
        }
    },

    // Cập nhật voucher
    updateVoucher: async (voucherID, updatedData) => {
        try {

            console.log(updatedData)
            const response = await axios.put(`${constants.API_BASE_URL}/api/vouchers/update/${voucherID}`, updatedData);
            console.log(response.data)
            return response.data; // Trả về kết quả cập nhật voucher
        } catch (error) {
            VoucherService.handleError(error); // Gọi handleError để xử lý lỗi
        }
    },

    // Thêm voucher cho tất cả user có trạng thái active là true
    addVoucherToAllActiveUsers: async (voucherData) => {
        try {
            const response = await axios.post(`${constants.API_BASE_URL}/api/vouchers/add-to-all-active-users`, voucherData);
            return response.data; // Trả về kết quả thêm voucher cho tất cả user
        } catch (error) {
            VoucherService.handleError(error); // Gọi handleError để xử lý lỗi
        }
    },

    // Thêm voucher cho user
    addVoucherVoucherUsers: async (voucherData) => {
        
        console.log(voucherData)
        try {
            const response = await axios.post(`${constants.API_BASE_URL}/api/vouchers/add-voucher-users`, voucherData);
            return response.data; // Trả về kết quả thêm voucher cho tất cả user
        } catch (error) {
            VoucherService.handleError(error); // Gọi handleError để xử lý lỗi
        }
    },

    // Xử lý lỗi từ các yêu cầu API
    handleError: (error) => {
        if (error.response) {
            // Lỗi từ server (có phản hồi từ phía server)
            console.error('Error response:', error.response.data);
            throw new Error(error.response.data.message || 'An error occurred on the server');
        } else if (error.request) {
            // Không có phản hồi từ server
            console.error('No response received:', error.request);
            throw new Error('No response received from the server');
        } else {
            // Lỗi cấu hình yêu cầu hoặc lỗi khác
            console.error('Request error:', error.message);
            throw new Error('An error occurred while setting up the request');
        }
    },
};

export default VoucherService;
