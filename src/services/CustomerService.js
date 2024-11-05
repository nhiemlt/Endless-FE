import axios from "axios";
import constants from '../utils/globalConstantUtil';

const CustomerService = {
    async getAllCustomers(page = 0, size = 10, keyword = '') {
        console.log("Searching with keyword:", keyword);
        try {
            const response = await axios.get(`${constants.API_BASE_URL}/api/customers`, {
                params: {
                    page,
                    size,
                    keyword,
                },
            });
            console.log("Response data:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching customers:", error);
            throw error;
        }
    },    

    async getCustomerById(customerId) {
        try {
            const response = await axios.get(`${constants.API_BASE_URL}/api/customers/${customerId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching customer by ID:", error);
            throw error;
        }
    },

    async createCustomer(customerData) {
        try {
            const response = await axios.post(`${constants.API_BASE_URL}/api/customers`, customerData);
            return response.data;
        } catch (error) {
            console.error("Error creating customer:", error);
            throw error;
        }
    },

    async updateCustomer(customerId, customerData) {
        try {
            const response = await axios.put(`${constants.API_BASE_URL}/api/customers/${customerId}`, customerData);
            return response.data;
        } catch (error) {
            console.error("Error updating customer:", error);
            throw error;
        }
    },

    async deleteCustomer(customerId) {
        try {
            const response = await axios.delete(`${constants.API_BASE_URL}/api/customers/${customerId}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting customer:", error);
            throw error;
        }
    },

};

export default CustomerService;
