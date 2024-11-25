import { useEffect, useState } from "react";
import TitleCard from "../../components/Cards/TitleCard";
import CustomerService from "../../services/CustomerService";
import AddCustomerModal from "./components/AddCustomerModal";
import UpdateCustomerModal from "./components/UpdateCustomerModal";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import { useDispatch } from "react-redux";
import { showNotification } from "../common/headerSlice";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import PencilIcon from "@heroicons/react/24/solid/PencilIcon";
import debounce from "lodash/debounce";

function Customer() {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [size, setSize] = useState(5);
  const [sortBy, setSortBy] = useState("fullname");
  const [sortDir, setSortDir] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const fetchCustomers = async () => {
    setIsFetching(true);
    try {
      const data = await CustomerService.getAllCustomers(
        currentPage,
        size,
        searchTerm
      );
      setCustomers(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setIsFetching(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, size, sortBy, sortDir, searchTerm]);

  const debouncedSearch = debounce((event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0);
  }, 300);

  const handleToggleStatus = async (userId) => {
    setLoading(true);
    try {
      await CustomerService.toggleCustomerStatus(userId);
      fetchCustomers();
      dispatch(
        showNotification({
          message: "Cập nhật trạng thái thành công!",
          status: 1,
        })
      );
    } catch (error) {
      console.error("Error toggling account status:", error);
      dispatch(
        showNotification({
          message: "Cập nhật trạng thái thất bại.",
          status: 0,
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSortChange = (newSortBy) => {
    const newSortDir =
      sortBy === newSortBy && sortDir === "asc" ? "desc" : "asc";
    setSortBy(newSortBy);
    setSortDir(newSortDir);
    setCurrentPage(0);
  };

  const handleUpdateModalOpen = (customer) => {
    if (!customer) {
      dispatch(
        showNotification({
          message: "Không thể tìm thấy khách hàng.",
          status: 0,
        })
      );
      return;
    }
    setCustomerDetails(customer);
    setShowUpdateModal(true);
  };

  const handleUpdateModalClose = () => {
    setShowUpdateModal(false);
    setCustomerDetails(null);
  };

  const handleDeleteCustomer = (userId) => {
    setUserIdToDelete(userId);
    setShowDeleteModal(true);
  };

  const confirmDeleteCustomer = async () => {
    if (userIdToDelete) {
      try {
        await CustomerService.deleteCustomer(userIdToDelete);
        fetchCustomers();
        dispatch(
          showNotification({ message: "Xóa khách hàng thành công!", status: 1 })
        );
      } catch (error) {
        console.error("Error deleting customer:", error);
        dispatch(
          showNotification({ message: "Xóa khách hàng thất bại.", status: 0 })
        );
      }
      setUserIdToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxPages = totalPages - 1;

    if (totalPages <= 5) {
      for (let i = 0; i <= maxPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(0, 1);

      if (currentPage > 3) pages.push("...");

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(maxPages - 2, currentPage + 1);

      for (let page = startPage; page <= endPage; page++) {
        pages.push(page);
      }

      if (currentPage < maxPages - 3) pages.push("...");

      pages.push(maxPages - 1, maxPages);
    }

    return (
      <div className="join mt-4 flex justify-center w-full">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="join-item btn"
          disabled={currentPage === 0}
        >
          Trước
        </button>

        {pages.map((page, index) =>
          page === "..." ? (
            <span key={index} className="join-item btn disabled">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`join-item btn ${
                currentPage === page ? "btn-primary" : ""
              }`}
            >
              {page + 1}
            </button>
          )
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="join-item btn"
          disabled={currentPage === maxPages}
        >
          Tiếp
        </button>
      </div>
    );
  };

  return (
    <TitleCard title="Quản lý khách hàng" topMargin="mt-2">
      <div className="flex justify-between mb-4 flex-wrap">
        <div className="flex space-x-4 mb-4 sm:mb-0">
          <label className="input input-bordered flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Tìm kiếm khách hàng"
              onChange={debouncedSearch}
              className="dark:bg-base-100 w-full sm:w-64"
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

        <button
          className="btn btn-primary sm:w-auto w-full"
          onClick={() => setShowModal(true)}
        >
          Tạo khách hàng mới
        </button>
      </div>

      {loading ? (
        <div className="relative w-full h-64">
          <div className="absolute inset-0 bg-opacity-50 bg-gray-100 flex justify-center items-center z-10">
            <div className="loader" />
          </div>
        </div>
      ) : (
        <>
          <table className="table w-full table-xs sm:table-md">
            <thead>
              <tr>
                <th>Avatar</th>
                <th onClick={() => handleSortChange("fullname")}>
                  Tên khách hàng
                </th>
                <th className="text-center">Số điện thoại</th>
                <th className="text-center">Email</th>
                <th className="text-center">Kích hoạt</th>
                <th className="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr key={customer.userId || index}>
                  <td>
                    <img
                      src={customer.avatar || "default-avatar.png"}
                      alt="Avatar"
                      className="w-16 h-16 rounded-full"
                    />
                  </td>
                  <td>{customer.fullname}</td>
                  <td className="text-center">{customer.phone}</td>
                  <td className="text-center">{customer.email}</td>
                  <td className="text-center">
                    <input
                      type="checkbox"
                      className="toggle toggle-success"
                      checked={customer.active}
                      onChange={() => handleToggleStatus(customer.userID)}
                    />
                  </td>
                  <td className="text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        className="btn btn-sm btn-outline btn-primary"
                        onClick={() => handleUpdateModalOpen(customer)}
                      >
                        <PencilIcon className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        className="btn btn-sm btn-outline btn-error"
                        onClick={() => handleDeleteCustomer(customer.userID)}
                      >
                        <TrashIcon className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {renderPagination()}
        </>
      )}

      <AddCustomerModal
        showModal={showModal}
        closeModal={() => setShowModal(false)}
        fetchCustomers={fetchCustomers}
      />

      <UpdateCustomerModal
        showModal={showUpdateModal}
        closeModal={handleUpdateModalClose}
        customer={customerDetails}
        fetchCustomers={fetchCustomers}
      />

      <ConfirmDeleteModal
        showModal={showDeleteModal}
        closeModal={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteCustomer}
        fetchCustomers={fetchCustomers}
      />
    </TitleCard>
  );
}

export default Customer;
