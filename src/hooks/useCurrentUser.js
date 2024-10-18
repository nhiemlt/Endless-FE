import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import UserService from '../services/UserService';
import { setUser } from '../features/common/userSlide';

const useCurrentUser = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const userData = await UserService.getCurrentUser();
                dispatch(setUser(userData));
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };

        fetchCurrentUser();
    }, [dispatch]);
};

export default useCurrentUser;
