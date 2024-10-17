import axios from 'axios';
import constants from '../utils/globalConstantUtil';

const NotificationService = {
    getNotifications: async () => {
        const response = await axios.get(`${constants.API_BASE_URL}/notifications/user`);
        return response.data; // Trả về dữ liệu API
    },
    
    markAsRead: async (notificationRecipientId) => {
        await axios.post(`${constants.API_BASE_URL}/notifications/markAsRead`, {
            notificationRecipientId, // Gửi đúng body theo yêu cầu
        });
        return await NotificationService.getUnreadCount(); // Trả về số lượng thông báo chưa đọc
    },

    markAllAsRead: async (page = 0, size = 10, sortBy = 'NotificationDate', sortDir = 'desc') => {
        const response = await axios.post(`${constants.API_BASE_URL}/notifications/markAllAsRead`, null, {
            params: { page, size, sortBy, sortDir },
        });
        return response.data;
    },

    deleteNotificationReception: async (notificationRecipientID) => {
        await axios.delete(`${constants.API_BASE_URL}/notifications/delete/${notificationRecipientID}`);
    },


    getUnreadCount: async () => {
        const response = await axios.get(`${constants.API_BASE_URL}/notifications/unread-count`);
        return response.data;
    },
    
};

export default NotificationService;
