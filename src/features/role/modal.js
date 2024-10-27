import React, { useEffect, useState } from 'react';
import UserService from '../../services/UserService';

const Modal = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const userList = await UserService.getAllUser();
                
                if (Array.isArray(userList)) {
                    setUsers(userList);
                } else {
                    throw new Error('Dữ liệu không hợp lệ. Mong đợi một mảng.');
                }
            } catch (err) {
                setError('Error loading users: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>User List</h1>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default Modal;
