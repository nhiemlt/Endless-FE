import axios from "axios";
import constants from "../utils/globalConstantUtil";

const PermissionService = {
  // Lấy permission theo ID
  getPermissionById: async (permissionId) => {
    const response = await axios.get(`${constants.API_BASE_URL}/api/permissions/${permissionId}`);
    return response.data;
  },

  // Tìm kiếm tất cả permissions theo từ khóa
  searchPermissions: async (keyword = "") => {
    const response = await axios.get(`${constants.API_BASE_URL}/api/permissions`, {
      params: { keyword },
    });
    return response.data;
  },

  // Lọc permissions theo module
  filterPermissionsByModule: async (moduleID) => {
    const response = await axios.get(`${constants.API_BASE_URL}/api/permissions/filter`, {
      params: { moduleID },
    });
    return response.data;
  },
};

export default PermissionService;
