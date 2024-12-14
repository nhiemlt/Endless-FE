import axios from "axios";
import constants from "../utils/globalConstantUtil";

// Địa chỉ base của API
const BASE_URL = `${constants.API_BASE_URL}/product-info`;

const productInfoService = {
    // Lấy thông tin sản phẩm theo ProductID
    getProductById: async (productID) => {
        try {
            const response = await axios.get(`${BASE_URL}/${productID}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching product by ID:", error);
            throw error;
        }
    },

    // Lọc danh sách sản phẩm theo các tiêu chí
    filterProductInfos: async (filterData) => {
        try {
            // Tạo query string từ filterData
            const params = new URLSearchParams({
                page: filterData.page || 0,
                size: filterData.size || 10,
                sortBy: filterData.sortBy || "quantitySold",
                direction: filterData.direction || "ASC",
                keyword: filterData.keyword || "",
                minPrice: filterData.minPrice || "",
                maxPrice: filterData.maxPrice || "",
            });

            // Chỉ thêm categoryIDs nếu có dữ liệu
            if (filterData.categoryIDs && filterData.categoryIDs.length > 0) {
                params.append("categoryIDs", filterData.categoryIDs.join(","));
            }

            // Chỉ thêm brandIDs nếu có dữ liệu
            if (filterData.brandIDs && filterData.brandIDs.length > 0) {
                params.append("brandIDs", filterData.brandIDs.join(","));
            }

            // Gửi request GET với các tham số qua query string
            const response = await axios.get(`${BASE_URL}/filter?${params.toString()}`);
            return response.data; // Trả về dữ liệu từ API
        } catch (error) {
            console.error("Error filtering product infos:", error);
            throw error; // Bắn lỗi để xử lý trong component
        }
    },

};

export default productInfoService;
