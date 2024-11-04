import axios from 'axios';
import constants from '../utils/globalConstantUtil';

const NotificationService = {
    // Lấy danh sách thông báo cho người dùng đăng nhập hiện tại
    getNotifications: async () => {
        try {
            const response = await axios.get(`${constants.API_BASE_URL}/notifications/user`);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy tất cả thông báo:", error);
            throw error;
        }
    },


    // Lấy tất cả thông báo với lọc và phân trang
    getAllNotifications: async (text = '', type = '', page = 0, size = 10, sortBy = 'notificationDate', sortDir = 'desc') => {
        try {
            const params = {
                page,
                size,
                sort: `${sortBy},${sortDir}`, // cập nhật tham số sort
                ...(text && { text }),
                ...(type && { type }),
            };
            const response = await axios.get(`${constants.API_BASE_URL}/notifications`, { params });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy tất cả thông báo:", error);
            throw error;
        }
    },

    // Lấy danh sách thông báo cho một người dùng cụ thể theo userId
    getNotificationsByUserId: async (userId, page = 0, size = 10, sortBy = 'notificationDate', sortDir = 'desc') => {
        try {
            const response = await axios.get(`${constants.API_BASE_URL}/notifications/user/${userId}`, {
                params: { page, size, sort: `${sortBy},${sortDir}` } // cập nhật tham số sort
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy thông báo cho userId:", error);
            throw error;
        }
    },

    // Đánh dấu một thông báo là đã đọc
    markAsRead: async (notificationRecipientId) => {
        try {
            const response = await axios.post(`${constants.API_BASE_URL}/notifications/markAsRead`, { notificationRecipientId });
            return response.data.message; // Trả về thông báo thành công
        } catch (error) {
            console.error("Lỗi khi đánh dấu thông báo là đã đọc:", error);
            throw error;
        }
    },

    // Đánh dấu tất cả thông báo là đã đọc
    markAllAsRead: async () => {
        try {
            const response = await axios.post(`${constants.API_BASE_URL}/notifications/markAllAsRead`);
            return response.data.message; // Trả về thông báo thành công
        } catch (error) {
            console.error("Lỗi khi đánh dấu tất cả thông báo là đã đọc:", error);
            throw error;
        }
    },

    // Xóa một thông báo nhận
    deleteNotificationReception: async (notificationRecipientID) => {
        try {
            await axios.delete(`${constants.API_BASE_URL}/notifications/delete/${notificationRecipientID}`);
        } catch (error) {
            console.error("Lỗi khi xóa thông báo:", error);
            throw error;
        }
    },

    // Lấy số lượng thông báo chưa đọc
    getUnreadCount: async () => {
        try {
            const response = await axios.get(`${constants.API_BASE_URL}/notifications/unread-count`);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy số lượng thông báo chưa đọc:", error);
            throw error;
        }
    },

    // Gửi thông báo tới các người dùng cụ thể
    sendNotification: async (notificationModel) => {
        try {
            const response = await axios.post(`${constants.API_BASE_URL}/notifications/send`, notificationModel);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi gửi thông báo:", error);
            throw error;
        }
    },

    // Gửi thông báo tới tất cả người dùng
    sendNotificationForAll: async (notificationModelForAll) => {
        try {
            const response = await axios.post(`${constants.API_BASE_URL}/notifications/send-all`, notificationModelForAll);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi gửi thông báo tới tất cả người dùng:", error);
            throw error;
        }
    }
};

export default NotificationService;
