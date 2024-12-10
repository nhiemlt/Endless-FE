import { useEffect, useState } from 'react';
import NotificationService from '../services/NotificationService';

const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await NotificationService.getNotifications();
    
            // Sắp xếp theo trạng thái và ngày
            const sortedData = data.sort((a, b) => {
                // Sắp xếp trạng thái 'Chưa đọc' lên trên, 'Đã đọc' xuống dưới
                if (a.status === 'Chưa đọc' && b.status !== 'Chưa đọc') {
                    return -1;
                }
                if (a.status !== 'Chưa đọc' && b.status === 'Chưa đọc') {
                    return 1;
                }
                // Nếu trạng thái giống nhau, sắp xếp theo ngày giảm dần
                return new Date(b.notificationDate) - new Date(a.notificationDate);
            });
    
            setNotifications(sortedData); // Lấy mảng notifications đã được sắp xếp
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        fetchNotifications();
    }, []);

    return { notifications, loading, error, fetchNotifications };
};

export default useNotifications;
