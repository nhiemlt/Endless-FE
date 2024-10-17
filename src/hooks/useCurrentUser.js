import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import UserService from '../api/UserService';
import { setUser } from '../features/common/userSlide';

const useCurrentUser = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const userData = await UserService.getCurrentUser();
                dispatch(setUser(userData));
                console.log(userData);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };

        fetchCurrentUser();
    }, [dispatch]);
};

export default useCurrentUser;
