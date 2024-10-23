import axios from 'axios';
import constants from '../utils/globalConstantUtil';

const NotificationService = {
    // Lấy danh sách thông báo cho người dùng đăng nhập hiện tại
    getNotifications: async (page = 0, size = 10, sortBy = 'NotificationDate', sortDir = 'desc') => {
        const response = await axios.get(`${constants.API_BASE_URL}/notifications/user`, {
            params: { page, size, sortBy, sortDir }
        });
        return response.data;
    },

    // Lấy danh sách thông báo cho một người dùng cụ thể theo userId
    getNotificationsByUserId: async (userId, page = 0, size = 10, sortBy = 'NotificationDate', sortDir = 'desc') => {
        const response = await axios.get(`${constants.API_BASE_URL}/notifications/user/${userId}`, {
            params: { page, size, sortBy, sortDir }
        });
        return response.data;
    },

    // Đánh dấu một thông báo là đã đọc
    markAsRead: async (notificationRecipientId) => {
        await axios.post(`${constants.API_BASE_URL}/notifications/markAsRead`, {
            notificationRecipientId,
        });
        return await NotificationService.getUnreadCount(); // Trả về số lượng thông báo chưa đọc
    },

    // Đánh dấu tất cả thông báo là đã đọc
    markAllAsRead: async (page = 0, size = 10, sortBy = 'NotificationDate', sortDir = 'desc') => {
        const response = await axios.post(`${constants.API_BASE_URL}/notifications/markAllAsRead`, null, {
            params: { page, size, sortBy, sortDir },
        });
        return response.data;
    },

    // Xóa một thông báo nhận
    deleteNotificationReception: async (notificationRecipientID) => {
        await axios.delete(`${constants.API_BASE_URL}/notifications/delete/${notificationRecipientID}`);
    },

    // Lấy số lượng thông báo chưa đọc
    getUnreadCount: async () => {
        const response = await axios.get(`${constants.API_BASE_URL}/notifications/unread-count`);
        return response.data;
    },

    // Gửi thông báo tới các người dùng cụ thể
    sendNotification: async (notificationModel) => {
        const response = await axios.post(`${constants.API_BASE_URL}/notifications/send`, notificationModel);
        return response.data;
    },

    // Gửi thông báo tới tất cả người dùng
    sendNotificationForAll: async (notificationModelForAll) => {
        const response = await axios.post(`${constants.API_BASE_URL}/notifications/send-all`, notificationModelForAll);
        return response.data;
    }
};

export default NotificationService;
