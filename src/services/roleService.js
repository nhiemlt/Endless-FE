import axios from "axios";
import constants from "../utils/globalConstantUtil";

const RoleService = {
  // Lấy tất cả roles với phân trang, lọc, tìm kiếm theo keyword và sắp xếp
  getAllRoles: async (page = 0, size = 10, keyword = "", sortBy = "roleName", direction = "asc") => {
    const response = await axios.get(`${constants.API_BASE_URL}/api/roles`, {
      params: { page, size, keyword, sortBy, direction },
    });
    return response.data;
  },

  // Lấy role theo ID và kèm danh sách permissions
  getRoleById: async (roleId) => {
    const response = await axios.get(`${constants.API_BASE_URL}/api/roles/${roleId}`);
    return response.data;
  },

  // Tạo mới role và gán permissions cho role
  createRole: async (roleData) => {
    const response = await axios.post(`${constants.API_BASE_URL}/api/roles`, roleData);
    return response.data;
  },

  // Cập nhật role và cập nhật lại danh sách permissions cho role
  updateRole: async (roleId, roleData) => {
    const response = await axios.put(`${constants.API_BASE_URL}/api/roles/${roleId}`, roleData);
    return response.data;
  },

  // Xóa role và tất cả các permissions liên quan đến role
  deleteRole: async (roleId) => {
    const response = await axios.delete(`${constants.API_BASE_URL}/api/roles/${roleId}`);
    return response.data;
  },

  // (Thêm mới) Lấy tất cả permissions
  getAllPermissions: async () => {
    const response = await axios.get(`${constants.API_BASE_URL}/api/roles/permissions`);
    return response.data;
  },

  // Gán danh sách users vào role
  assignUsersToRole: async (roleId, userIds) => {
    const response = await axios.post(`${constants.API_BASE_URL}/api/roles/manage/${roleId}/users`, { userIds });
    return response.data;
  },

  // Lấy số lượng người dùng theo vai trò
  getUserCountByRole: async (roleId) => {
    const response = await axios.get(`${constants.API_BASE_URL}/api/roles/${roleId}/count`);
    return response.data;
  },

  // Tìm kiếm người dùng theo tên
  searchUsersByName: async (name) => {
    const response = await axios.get(`${constants.API_BASE_URL}/api/users/search`, { params: { name } });
    return response.data;
  },

  // Lấy danh sách người dùng theo vai trò
  getUsersByRole: async (roleId) => {
    const response = await axios.get(`${constants.API_BASE_URL}/api/roles/manage/roles/${roleId}/users`);
    return response.data;
  },

  // Xóa một user khỏi role
  deleteUserFromRole: async (roleId, userId) => {
    try {
      const response = await axios.delete(`${constants.API_BASE_URL}/api/roles/manage/${roleId}/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting user from role:", error);
      throw error;
    }
  },

  // Lấy role cùng với danh sách permissions
  getRoleWithPermissions: async (roleId) => {
    const response = await axios.get(`${constants.API_BASE_URL}/api/roles/${roleId}/permissions`);
    return response.data;
  },

  // Lấy vai trò của người dùng hiện tại
  getCurrentUserRoles: async () => {
    const response = await axios.get(`${constants.API_BASE_URL}/api/roles/current`);
    return response.data;
  },

};

export default RoleService;
