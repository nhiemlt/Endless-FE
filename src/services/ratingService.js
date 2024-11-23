import axios from 'axios';
import constants from '../utils/globalConstantUtil';

const RatingService = {
    fetchRatings: async ({ keyword, ratingValue, page, size }) => {
        const response = await axios.get(`${constants.API_BASE_URL}/api/ratings`, {
            params: {
                keyword,
                ratingValue,
                page,
                size,
            },
        });
        return response.data;
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

    // Xóa đánh giá theo ID
    deleteRating: (id) => {
        return axios.delete(`${constants.API_BASE_URL}/api/ratings/${id}`)
            .then(() => {
                return; // Không trả về dữ liệu nào
            })
            .catch(error => {
                throw error.response.data.error || 'Error deleting rating'; // Xử lý lỗi
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
