import { useEffect, useState } from 'react';
import TitleCard from "../../components/Cards/TitleCard";
import RoleService from '../../services/roleService';
import AddRoleModal from './components/AddRoleModal';
import UpdateRoleModal from './components/UpdateRoleModal';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import { useDispatch } from 'react-redux';
import { showNotification } from "../common/headerSlice";
import TrashIcon from '@heroicons/react/24/solid/TrashIcon';
import PencilIcon from '@heroicons/react/24/solid/PencilIcon';

function Role() {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleDetails, setRoleDetails] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState('roleName');
  const [sortDir, setSortDir] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleIdToDelete, setRoleIdToDelete] = useState(null);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const data = await RoleService.getAllRoles(
        currentPage,
        size,
        searchTerm,
        sortBy,
        sortDir
      );
      setRoles(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [currentPage, size, sortBy, sortDir, searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSortChange = (newSortBy) => {
    const newSortDir = (sortBy === newSortBy && sortDir === 'asc') ? 'desc' : 'asc';
    setSortBy(newSortBy);
    setSortDir(newSortDir);
    setCurrentPage(0);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleUpdateModalOpen = (role) => {
    setRoleDetails(role);
    setShowUpdateModal(true);
  };

  const handleUpdateModalClose = () => {
    setShowUpdateModal(false);
    setRoleDetails(null);
  };

  const handleDeleteRole = (roleId) => {
    setRoleIdToDelete(roleId); // Lưu ID vai trò để xóa
    setShowDeleteModal(true); // Mở modal xác nhận xóa
  };

  const confirmDeleteRole = async () => {
    if (roleIdToDelete) {
      try {
        await RoleService.deleteRole(roleIdToDelete);
        fetchRoles(); // Cập nhật danh sách vai trò
        dispatch(showNotification({ message: 'Xóa vai trò thành công!', status: 1 }));
      } catch (error) {
        console.error("Error deleting role:", error);
        dispatch(showNotification({ message: error.response.data, status: 0 }));
      }
      setRoleIdToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const renderPagination = () => {
    const maxPageButtons = 5;
    const halfMax = Math.floor(maxPageButtons / 2);
    let startPage = Math.max(0, currentPage - halfMax);
    let endPage = Math.min(totalPages - 1, currentPage + halfMax);

    if (endPage - startPage < maxPageButtons - 1) {
      if (startPage === 0) {
        endPage = Math.min(maxPageButtons - 1, totalPages - 1);
      } else if (endPage === totalPages - 1) {
        startPage = Math.max(0, totalPages - maxPageButtons);
      }
    }

    return (
      <div className="join mt-4 flex justify-center w-full">
        <button onClick={handlePrevPage} className="join-item btn" disabled={currentPage === 0}>
          Previous
        </button>
        {Array.from({ length: endPage - startPage + 1 }, (_, index) => {
          const page = startPage + index;
          return (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`join-item btn ${currentPage === page ? 'btn-primary' : ''}`}
            >
              {page + 1}
            </button>
          );
        })}
        <button onClick={handleNextPage} className="join-item btn" disabled={currentPage === totalPages - 1}>
          Next
        </button>
      </div>
    );
  };

  return (
    <TitleCard title="Quản lý vai trò" topMargin="mt-2">
      <div className="flex justify-between mb-4">
        <div className="flex space-x-4">
          <label className="input input-bordered flex items-center gap-2">
            <input
              type="text"
              placeholder="Tìm kiếm vai trò"
              value={searchTerm}
              onChange={handleSearch}
              className=" dark:bg-base-100"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </label>
        </div>

        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Tạo vai trò mới
        </button>
      </div>

      {loading ? (
        <p>Đang tải danh sách vai trò...</p>
      ) : (
        <>
          <table className="table w-full table-xs">
            <thead>
              <tr>
                <th onClick={() => handleSortChange('roleName')}>Tên vai trò</th>
                <th className="text-center">Tổng nhân viên</th>
                <th className="text-center">Đang kích hoạt</th>
                <th className="text-center">Ngừng kích hoạt</th>
                <th className="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.roleId}>
                  <td>{role.roleName}</td>
                  <td className="text-center">{role.employees}</td>
                  <td className="text-center">{role.employeeActives}</td>
                  <td className="text-center">{role.employeeInactive}</td>
                  <td className="space-x-2 text-center">
                    <button className="btn btn-sm btn-outline btn-primary" onClick={() => handleUpdateModalOpen(role)}>
                      <PencilIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      className="btn btn-sm btn-outline btn-error"
                      onClick={() => handleDeleteRole(role.roleId)}>
                      <TrashIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>


          {renderPagination()}
        </>
      )}

      <AddRoleModal
        showModal={showModal}
        closeModal={() => setShowModal(false)}
        onRoleCreated={fetchRoles}
      />

      <UpdateRoleModal
        showModal={showUpdateModal}
        closeModal={handleUpdateModalClose}
        role={roleDetails}
        onRoleUpdated={fetchRoles}
      />

      <ConfirmDeleteModal
        showModal={showDeleteModal}
        closeModal={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteRole}
      />

    </TitleCard>
  );
}

export default Role;
