import axios from 'axios';
import constants from '../utils/globalConstantUtil';

const GHNService = {
    // Lấy danh sách tỉnh/thành
    getProvinces: async () => {
        try {
            const response = await axios.get(`${constants.GHN_API_BASE_URL}/shiip/public-api/master-data/province`, {
                headers: {
                    'Token': constants.GHN_API_TOKEN,
                    'Content-Type': 'application/json'
                }
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching provinces:', error.response ? error.response.data : error.message);
            throw error;
        }
    },

    // Lấy danh sách quận/huyện theo tỉnh
    getDistrictsByProvince: async (provinceId) => {
        try {
            const response = await axios.post(`${constants.GHN_API_BASE_URL}/shiip/public-api/master-data/district`,
                {
                    province_id:  Number(provinceId) // Gửi trong body của request
                },
                {
                    headers: {
                        'Token': constants.GHN_API_TOKEN,
                        'Content-Type': 'application/json'
                    }
                });
            return response.data;
        } catch (error) {
            console.error('Error fetching districts:', error.response ? error.response.data : error.message);
            throw error;
        }
    },

    // Lấy danh sách phường/xã theo quận/huyện (POST request)
    getWardsByDistrict: async (districtId) => {
        try {
            const response = await axios.post(`${constants.GHN_API_BASE_URL}/shiip/public-api/master-data/ward`,
                {
                    district_id:  Number(districtId) // Gửi trong body của request
                },
                {
                    headers: {
                        'Token': constants.GHN_API_TOKEN,
                        'Content-Type': 'application/json'
                    }
                });
            return response.data;
        } catch (error) {
            console.error('Error fetching wards:', error.response ? error.response.data : error.message);
            throw error;
        }
    },


    // Tính phí giao hàng
    calculateShippingFee: async ({
        toDistrictId,
        toWardCode,
        weight,
        items, // Nhận mảng items
        serviceTypeId = 2, // Sử dụng service_type_id 2
    }) => {
        try {
            const response = await axios.post(
                `${constants.GHN_API_BASE_URL}/shiip/public-api/v2/shipping-order/fee`,
                {
                    service_type_id: serviceTypeId,
                    to_district_id: toDistrictId,
                    to_ward_code: toWardCode,
                    weight: weight,
                    items: items, // Sử dụng mảng items truyền vào
                },
                {
                    headers: {
                        'Token': constants.GHN_API_TOKEN, // Chữ "Token" phải viết hoa
                        'ShopId': constants.SHOP_ID, // Chữ "ShopId" phải viết hoa
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error calculating shipping fee:', error.response ? error.response.data : error.message);
            throw error;
        }
    }
    
};

export default GHNService;
