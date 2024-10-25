import axios from 'axios';
import constants from '../utils/globalConstantUtil';

const RatingService = {
    fetchRatings: async (params) => {
        try {
            // Gọi API với các tham số được truyền vào
            const response = await axios.get(`${constants.API_BASE_URL}/api/ratings`, { params });
            return response.data; // Trả về dữ liệu đánh giá
        } catch (error) {
            // Xử lý lỗi và ném ra thông báo lỗi
            console.error("Error occurred while fetching ratings:", error);
            throw new Error(error.response ? error.response.data.error : "An unexpected error occurred");
        }
    },

    // Lấy đánh giá theo ID (API cũ)
    getRatingById: (id) => {
        return axios.get(`${constants.API_BASE_URL}/api/ratings/${id}`)
            .then(response => {
                return response.data; // Trả về dữ liệu phản hồi
            })
            .catch(error => {
                throw error.response.data.error || 'Error fetching rating by ID'; // Xử lý lỗi
            });
    },

    // Lấy đánh giá theo ID (API mới)
    getRatingById2: (id) => {
        return axios.get(`${constants.API_BASE_URL}/api/ratings/id/${id}`) // Gọi đến API mới
            .then(response => {
                return response.data; // Trả về dữ liệu phản hồi
            })
            .catch(error => {
                throw error.response.data.error || 'Error fetching rating by ID 2'; // Xử lý lỗi
            });
    },

    // Lấy danh sách đánh giá theo productVersionID
    getRatingsByProductVersionId: (productVersionID) => {
        return axios.get(`${constants.API_BASE_URL}/api/ratings/productVersion/${productVersionID}`)
            .then(response => {
                return response.data; // Trả về dữ liệu phản hồi
            })
            .catch(error => {
                throw error.response.data.error || 'Error fetching ratings by product version ID'; // Xử lý lỗi
            });
    },

    // Thêm đánh giá
    addRating: (orderDetailId, ratingValue, comment, pictures) => {
        const formData = new FormData();
        formData.append('orderDetailId', orderDetailId);
        formData.append('ratingValue', ratingValue);
        formData.append('comment', comment);

        if (pictures && pictures.length > 0) {
            pictures.forEach((picture) => {
                formData.append('pictures', picture); // Gửi từng hình ảnh
            });
        }

        return axios.post(`${constants.API_BASE_URL}/api/ratings/add`, formData)
            .then(response => {
                return response.data; // Trả về dữ liệu phản hồi
            })
            .catch(error => {
                throw error.response.data.error || 'Error adding rating'; // Xử lý lỗi
            });
    }
};

export default RatingService;
