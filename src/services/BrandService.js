import axios from 'axios';
import convertImageToBase64 from '../utils/convertImageToBase64';
import constants from '../utils/globalConstantUtil';



const BASE_URL = 'http://localhost:8080/api/brands';

const BrandService = {
    // Lấy danh sách thương hiệu
    getBrands: async () => {
        const response = await axios.get(`${constants.API_BASE_URL}/api/brands`);
        return response.data;
    },

    createBrand: async (brand, file) => {
        try {
            // Kiểm tra xem file có phải là một đối tượng File hay không
            if (!(file instanceof File)) {
                throw new Error('Invalid file: Expected a File object.');
            }

            const base64Image = await convertImageToBase64.convertImageToBase64(file);
            const newBrand = { ...brand, logo: base64Image }; // Gán chuỗi Base64 cho trường 'logo'

            const response = await axios.post(BASE_URL, newBrand);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi tạo thương hiệu:', error);
            throw error;
        }
    },


    updateBrand: async (id, brand, file) => {
        try {
            const base64Image = await convertImageToBase64.convertImageToBase64(file);
            const updatedBrand = { ...brand, logo: base64Image }; // Gán chuỗi Base64 cho trường 'logo'

            const response = await axios.put(`${BASE_URL}/${id}`, updatedBrand);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi cập nhật thương hiệu:', error);
            throw error;
        }
    },

    deleteBrand: async (id) => {
        await axios.delete(`${BASE_URL}/${id}`);
    }
};





export default BrandService;
