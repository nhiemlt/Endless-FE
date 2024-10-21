import axios from 'axios';
import constants from '../utils/globalConstantUtil';

const RoleService = {
  getAllRoles: async () => {
    const response = await axios.get(`${constants.API_BASE_URL}/api/roles`);
    return response.data;
  },

  getRoleById: async (roleId) => {
    const response = await axios.get(`${constants.API_BASE_URL}/api/roles/${roleId}`);
    return response.data;
  },

  createRole: async (roleData) => {
    const response = await axios.post(`${constants.API_BASE_URL}/api/roles`, roleData);
    return response.data;
  },

  updateRole: async (roleData) => {
    const response = await axios.put(`${constants.API_BASE_URL}/api/roles`, roleData);
    return response.data;
  },

  deleteRole: async (roleId) => {
    await axios.delete(`${constants.API_BASE_URL}/api/roles/${roleId}`);
  },

  getAllPermissions: async () => {
    const response = await axios.get(`${constants.API_BASE_URL}/api/roles/permissions`);
    return response.data;
  }
};

export default RoleService;