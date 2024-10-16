import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import constants from '../../utils/globalConstantUtil';

const Logout = () => {
    const navigate = useNavigate(); // Khởi tạo useNavigate để chuyển trang

    useEffect(() => {
        // Hàm xóa cookie bằng tên
        const deleteCookie = (name) => {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        };

        // Xóa token khỏi cookies
        deleteCookie("token");

        // Gửi yêu cầu tới API để xử lý việc đăng xuất trên server (nếu có)
        fetch(`${constants.API_BASE_URL}/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then(response => response.json())
        .then(data => {
            // Có thể thực hiện thêm logic tại đây nếu cần dựa trên phản hồi
            console.log("Đăng xuất thành công:", data);
        })
        .catch(error => {
            console.error("Đã có lỗi khi đăng xuất:", error);
        });

        // Chuyển hướng người dùng về trang đăng nhập sau khi đăng xuất
        navigate('/login');

    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-semibold">Đang đăng xuất...</h2>
                <p className="text-gray-600 mt-2">Vui lòng chờ một chút.</p>
            </div>
        </div>
    );
};

export default Logout;
