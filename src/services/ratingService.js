import axios from "axios";
import constants from "../utils/globalConstantUtil";

const RatingService = {
  fetchRatings: ({ keyword, ratingValue, month, year, page, size }) => {
    return axios
      .get(`${constants.API_BASE_URL}/api/ratings`, {
        params: {
          keyword: keyword || "", // Chuỗi tìm kiếm
          ratingValue: ratingValue || 0, // Giá trị đánh giá
          month: month || 0, // Tháng (0 nếu không lọc theo tháng)
          year: year || 0,   // Năm (0 nếu không lọc theo năm)
          page: page || 0,   // Trang hiện tại (bắt đầu từ 0)
          size: size || 10,  // Số lượng mục mỗi trang
        },
      })
      .then((response) => {
        return response.data; // Trả về dữ liệu phản hồi
      })
      .catch((error) => {
        throw error.response?.data?.error || "Error fetching ratings"; // Xử lý lỗi
      });
  },


  // Lấy đánh giá theo ID (API cũ)
  getRatingById: (id) => {
    return axios
      .get(`${constants.API_BASE_URL}/api/ratings/${id}`)
      .then((response) => {
        return response.data; // Trả về dữ liệu phản hồi
      })
      .catch((error) => {
        throw error.response.data.error || "Error fetching rating by ID"; // Xử lý lỗi
      });
  },

  // Lấy đánh giá theo ID (API mới)
  getRatingById2: (id) => {
    return axios
      .get(`${constants.API_BASE_URL}/api/ratings/id/${id}`) // Gọi đến API mới
      .then((response) => {
        return response.data; // Trả về dữ liệu phản hồi
      })
      .catch((error) => {
        throw error.response.data.error || "Error fetching rating by ID 2"; // Xử lý lỗi
      });
  },

  // Lấy danh sách đánh giá theo productVersionID
  getRatingsByProductVersionId: (productVersionID) => {
    return axios
      .get(
        `${constants.API_BASE_URL}/api/ratings/productVersion/${productVersionID}`
      )
      .then((response) => {
        return response.data; // Trả về dữ liệu phản hồi
      })
      .catch((error) => {
        throw (
          error.response.data.error ||
          "Error fetching ratings by product version ID"
        ); // Xử lý lỗi
      });
  },

  // Xóa đánh giá theo ID
  deleteRating: (id) => {
    return axios
      .delete(`${constants.API_BASE_URL}/api/ratings/${id}`)
      .then(() => {
        return; // Không trả về dữ liệu nào
      })
      .catch((error) => {
        throw error.response.data.error || "Error deleting rating"; // Xử lý lỗi
      });
  },

  // Thêm đánh giá
  addRating: (orderDetailId, ratingValue, comment, pictures) => {
    // Tạo payload JSON
    const payload = {
      orderDetailId,
      ratingValue,
      comment,
      pictures: pictures && pictures.length > 0 ? pictures : [], // Chuyển mảng ảnh hoặc để rỗng
    };

    return axios
      .post(`${constants.API_BASE_URL}/api/ratings/add`, payload, {
        headers: {
          "Content-Type": "application/json", // Đặt Content-Type là JSON
        },
      })
      .then((response) => {
        return response.data; // Trả về dữ liệu phản hồi
      })
      .catch((error) => {
        console.error("Error details:", error.response?.data || error.message);
        throw error.response?.data?.error || "Error adding rating";
      });
  },

  // Lấy tổng số đánh giá
  getTotalRatingsCount: () => {
    return axios
      .get(`${constants.API_BASE_URL}/api/ratings/total-count`)
      .then((response) => {
        return response.data; // Trả về dữ liệu phản hồi (tổng số đánh giá)
      })
      .catch((error) => {
        throw error.response?.data?.error || "Error fetching total ratings count"; // Xử lý lỗi
      });
  },

  // Lấy tổng trung bình đánh giá (Weighted Average Rating)
  getWeightedAverageRating: () => {
    return axios
      .get(`${constants.API_BASE_URL}/api/ratings/weighted-average-rating`)
      .then((response) => {
        return response.data; // Trả về dữ liệu phản hồi (trung bình trọng số)
      })
      .catch((error) => {
        throw error.response?.data?.error || "Error fetching weighted average rating"; // Xử lý lỗi
      });
  },
};

export default RatingService;
