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
    }
};

export default GHNService;
