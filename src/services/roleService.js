import axios from "axios";
import constants from "../utils/globalConstantUtil";

const RoleService = {
  getAllRoles: async () => {
    const response = await axios.get(`${constants.API_BASE_URL}/api/roles`);
    return response.data;
  },

  getRoleById: async (roleId) => {
    const response = await axios.get(
      `${constants.API_BASE_URL}/api/roles/${roleId}`
    );
    return response.data;
  },

  createRole: async (roleData) => {
    const response = await axios.post(
      `${constants.API_BASE_URL}/api/roles`,
      roleData
    );
    return response.data;
  },

  updateRole: async (roleData) => {
    const response = await axios.put(
      `${constants.API_BASE_URL}/api/roles`,
      roleData
    );
    return response.data;
  },

  deleteRole: async (roleId) => {
    await axios.delete(`${constants.API_BASE_URL}/api/roles/${roleId}`);
  },

  getAllPermissions: async () => {
    const response = await axios.get(
      `${constants.API_BASE_URL}/api/roles/permissions`
    );
    return response.data;
  },

  assignUsersToRole: async (roleId, userIds) => {
    const response = await axios.post(
      `${constants.API_BASE_URL}/api/roles/${roleId}/users`,
      { userIds }
    );
    return response.data;
  },

  getUserCountByRole: async (roleId) => {
    const response = await axios.get(
      `${constants.API_BASE_URL}/api/roles/${roleId}/count`
    );
    return response.data;
  },

  // Thêm phương thức tìm kiếm người dùng theo tên
  searchUsersByName: async (name) => {
    const response = await axios.get(
      `${constants.API_BASE_URL}/api/users/search`, // Điều chỉnh URL này theo API của bạn
      { params: { name } }
    );
    return response.data;
  },

  getUsersByRole: async (roleId) => {
    const response = await axios.get(
      `${constants.API_BASE_URL}/api/roles/${roleId}/users`
    );
    return response.data;
  }
};

export default RoleService;
