import axios from 'axios';
import constants from '../utils/globalConstantUtil';

const ProfileService = {
    // Lấy tất cả người dùng với phân trang và tìm kiếm
    fetchUsers: async (page = 0, size = 10, keyword = '') => {
        const response = await axios.get(`${constants.API_BASE_URL}/api/users`, {
            params: { page, size, keyword }
        });
        return response.data.content; // Trả về danh sách người dùng
    },

    // Lấy người dùng theo ID
    fetchUserById: async (userId) => {
        const response = await axios.get(`${constants.API_BASE_URL}/api/users/${userId}`);
        return response.data; // Trả về dữ liệu người dùng
    },

    // Lấy thông tin người dùng hiện tại
    fetchCurrentUser: async () => {
        const response = await axios.get(`${constants.API_BASE_URL}/api/users/current`);
        return response.data; // Trả về thông tin người dùng hiện tại
    },

    // Thêm người dùng mới
    addUser: async (userData) => {
        const response = await axios.post(`${constants.API_BASE_URL}/api/users`, userData);
        return response.data; // Trả về dữ liệu người dùng mới được thêm
    },

    // Cập nhật người dùng theo ID
    updateUser: async (userId, updatedData) => {
        const response = await axios.put(`${constants.API_BASE_URL}/api/users/${userId}`, updatedData);
        return response.data; // Trả về dữ liệu người dùng đã cập nhật
    },

    // Hàm chuyển đổi ảnh thành chuỗi base64
    convertImageToBase64: (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = async () => {
                const img = new Image();
                img.src = reader.result;

                img.onload = () => {
                    // Tạo canvas và thiết lập kích thước
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Thiết lập chiều rộng và chiều cao của canvas
                    const maxWidth = 600; // Giới hạn chiều rộng
                    const maxHeight = 600; // Giới hạn chiều cao
                    let width = img.width;
                    let height = img.height;

                    // Tính tỷ lệ để giữ nguyên tỉ lệ khung hình
                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height;
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);

                    // Chuyển đổi canvas thành chuỗi Base64
                    let base64String = canvas.toDataURL('image/jpeg', 0.5); // Giảm chất lượng xuống 50%

                    // Kiểm tra độ dài chuỗi Base64 và nén nếu cần
                    const maxLength = 2000000; // Độ dài tối đa cho chuỗi Base64 (ví dụ: 2MB)
                    while (base64String.length > maxLength) {
                        // Giảm chất lượng thêm nữa nếu chuỗi vẫn quá dài
                        base64String = canvas.toDataURL('image/jpeg', 0.3); // Giảm chất lượng còn 30%
                    }

                    resolve(base64String); // Trả về chuỗi Base64
                };
            };

            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file); // Đọc tệp dưới dạng Data URL
        });
    },

    // Cập nhật thông tin người dùng hiện tại (bao gồm avatar)
    updateCurrentUser: async (updatedData) => {
        try {
            // Nếu avatar là file, chuyển thành base64
            if (updatedData.avatar instanceof File) {
                updatedData.avatar = await ProfileService.convertImageToBase64(updatedData.avatar);
            }

            // Gửi yêu cầu PUT để cập nhật dữ liệu người dùng, bao gồm avatar base64
            const response = await axios.put(`${constants.API_BASE_URL}/api/users/current`, updatedData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return response.data; // Trả về dữ liệu người dùng đã cập nhật
        } catch (error) {
            // Nếu có lỗi 400, hiển thị thông báo lỗi từ backend
            if (error.response && error.response.status === 400) {
                // Quăng ngoại lệ với thông báo lỗi từ backend
                throw new Error(error.response.data.errors.join(', ')); // Kết hợp các thông báo lỗi thành một chuỗi
            } else if (error.response && error.response.data instanceof Array) {
                // Xử lý các ngoại lệ tùy chỉnh
                throw new Error(error.response.data.message || 'Đã xảy ra lỗi không xác định'); // Lấy thông điệp từ ngoại lệ
            } else {
                console.error('Error updating user:', error);
                throw new Error('Đã xảy ra lỗi khi cập nhật người dùng'); // Thông báo lỗi tổng quát
            }
        }
    },


    // Xóa người dùng theo ID
    deleteUser: async (userId) => {
        await axios.delete(`${constants.API_BASE_URL}/api/users/${userId}`);
    },
};

export default ProfileService;
