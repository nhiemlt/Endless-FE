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
            setNotifications(data); // Lấy mảng notifications từ `content`
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
