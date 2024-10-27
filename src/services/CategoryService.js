import axios from 'axios';


const BASE_URL = 'http://localhost:8080/api/categories';

const CategoryService = {
    // Get all categories from the API.
    getCategories: async () => {
        const response = await axios.get(BASE_URL);
        return response.data;
    },


    createCategory: async (category) => {
        const response = await axios.post(BASE_URL, { name: category.name });
        return response.data;
    },

    updateCategory: async (id, category) => {
        const response = await axios.put(`${BASE_URL}/${id}`, { name: category.name });
        return response.data;
    },

    deleteCategory: async (id) => {
        await axios.delete(`${BASE_URL}/${id}`);
    }
};

export default CategoryService;
