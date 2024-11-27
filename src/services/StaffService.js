import axios from "axios";
import constants from "../utils/globalConstantUtil";

const StaffService = {
  getAllEmployees: async (
    page = 0,
    size = 10,
    keyword = "",
    sortBy = "createDate",
    direction = "asc"
  ) => {
    const response = await axios.get(
      `${constants.API_BASE_URL}/api/employees`,
      {
        params: { page, size, keyword, sort: sortBy, direction },
      }
    );
    return response.data;
  },

  getEmployeeById: async (userId) => {
    const response = await axios.get(
      `${constants.API_BASE_URL}/api/employees/${userId}`
    );
    return response.data;
  },

  addEmployee: async (employeeData) => {
    try {
      const response = await axios.post(
        `${constants.API_BASE_URL}/api/employees`,
        employeeData
      );
      return response.data;
    } catch (error) {
      console.error("Không thể thêm nhân viên:", error);
      throw error;
    }
  },

  updateEmployee: async (userId, employeeData) => {
    const response = await axios.put(
      `${constants.API_BASE_URL}/api/employees/${userId}`,
      employeeData
    );
    return response.data;
  },

  toggleEmployeeStatus: async (userId) => {
    const response = await axios.patch(
      `${constants.API_BASE_URL}/api/employees/${userId}/toggle`
    );
    return response.data;
  },

  resetEmployeePassword: async (userId) => {
    const response = await axios.patch(
      `${constants.API_BASE_URL}/api/employees/${userId}/reset-password`
    );
    return response.data;
  },

  getEmployeeRoles: async (userId) => {
    const response = await axios.get(
      `${constants.API_BASE_URL}/api/employees/${userId}/roles`
    );
    return response.data;
  },

  updateEmployeeRoles: async (userId, roleIds) => {
    const response = await axios.put(
      `${constants.API_BASE_URL}/api/employees/${userId}/roles`,
      roleIds
    );
    return response.data;
  },

  deleteEmployee: async (userId) => {
    try {
      const response = await axios.delete(
        `${constants.API_BASE_URL}/api/employees/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Không thể xóa nhân viên:", error);
      throw error;
    }
  },
};

export default StaffService;
