import React, { useEffect, useState } from "react";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import TitleCard from "../../components/Cards/TitleCard";
import UserService from "../../services/UserService";
import CustomerModal from "./components/CustomerModal";

function Customer() {
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchCustomers();
  }, [page, size, keyword]);

  const fetchCustomers = async () => {
    try {
      const response = await UserService.getInfor(page, size, keyword);

      const customersData = response.content.filter((customer) => {
        const hasNoRole = !customer.roles || customer.roles.length === 0;
        const matchesSearch =
          customer.fullName &&
          customer.fullName.toLowerCase().includes(keyword.toLowerCase());

        return hasNoRole && matchesSearch;
      });

      setCustomers(customersData);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu người dùng:", error);
    }
  };

  const handleSearchChange = (event) => {
    setKeyword(event.target.value);
  };

  const addCustomer = async (newCustomer) => {
    try {
      await UserService.addCustomer(newCustomer);
      fetchCustomers();
    } catch (error) {
      console.error("Lỗi khi thêm người dùng:", error);
    }
  };

  const editCustomer = async (customerId, updatedData) => {
    try {
      await UserService.updateCustomer(customerId, updatedData);
      fetchCustomers();
    } catch (error) {
      console.error("Lỗi khi sửa người dùng:", error);
    }
  };

  const deleteCustomer = async (customerId) => {
    try {
      await UserService.deleteCustomer(customerId);
      fetchCustomers();
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
    }
  };

  const handleOpenModal = (customer = null) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
    setFormData({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedCustomer) {
      await editCustomer(selectedCustomer.userID, formData);
    } else {
      await addCustomer(formData);
    }
    handleCloseModal();
  };

  return (
    <TitleCard title="Người dùng" topMargin="mt-2">
      <div>
        <div className="flex items-center my-4">
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            value={keyword}
            onChange={handleSearchChange}
            className="rounded px-2 py-1 mr-2"
          />
          <button
            onClick={() => handleOpenModal()} // Mở modal thêm người dùng
            className="text-blue-500 hover:text-blue-700 flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-1" /> Thêm người dùng
          </button>
        </div>

        <table className="min-w-full">
          <thead>
            <tr>
              <th className="py-2 px-4">Avatar</th>
              <th className="py-2 px-4">Thông tin</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.userID}>
                <td className="py-2 px-4">
                  <img
                    src={customer.avatarUrl}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full mr-2"
                  />
                </td>
                <td className="py-2 px-4 flex items-center">
                  <div className="flex flex-col">
                    <div className="font-bold">{customer.fullName}</div>
                    <div className="text-sm">{customer.username}</div>
                  </div>
                </td>
                <td className="py-2 px-4">{customer.email}</td>
                <td className="py-2 px-4 flex space-x-2">
                  <button
                    onClick={() => handleOpenModal(customer)} // Mở modal để sửa người dùng
                    className="py-2 px-4"
                    title="Chỉnh sửa"
                  >
                    <PencilIcon className="w-5 h-5 text-blue-500 hover:text-blue-700" />
                  </button>
                  <button
                    onClick={() => deleteCustomer(customer.userID)} // Xóa người dùng
                    className="py-2 px-4"
                    title="Xóa"
                  >
                    <TrashIcon className="w-5 h-5 text-red-500 hover:text-red-700" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination flex justify-center mt-4 space-x-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
            className="border px-4 py-1 rounded"
          >
            Trang trước
          </button>
          <span className="px-4">Trang {page + 1}</span>
          <button
            onClick={() => setPage(page + 1)}
            className="border px-4 py-1 rounded"
          >
            Trang sau
          </button>
        </div>
      </div>
      {isModalOpen && (
        <CustomerModal
          onClose={handleCloseModal}
          employee={selectedCustomer}
          onSubmit={handleSubmit}
        />
      )}
    </TitleCard>
  );
}

export default Customer;
