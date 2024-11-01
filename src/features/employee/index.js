import React, { useEffect, useState } from "react";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import TitleCard from "../../components/Cards/TitleCard";
import UserService from "../../services/UserService";
import EmployeeModal from "./components/EmployeeModal";

function Staff() {
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchEmployees();
  }, [page, size, keyword]);

  const fetchEmployees = async () => {
    try {
      const response = await UserService.getInfor(page, size, keyword);

      const employeesData = response.content.filter((employee) => {
        const hasRole = employee.roles && employee.roles.length > 0;

        const matchesSearch =
          employee.fullName &&
          employee.fullName.toLowerCase().includes(keyword.toLowerCase());

        return hasRole && matchesSearch;
      });

      setEmployees(employeesData);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu nhân viên:", error);
    }
  };

  const handleSearchChange = (event) => {
    setKeyword(event.target.value);
  };  

  const addEmployee = async (newEmployee) => {
    try {
      await UserService.addEmployee(newEmployee);
      fetchEmployees();
    } catch (error) {
      console.error("Lỗi khi thêm nhân viên:", error);
    }
  };

  const editEmployee = async (employeeId, updatedData) => {
    try {
      await UserService.updateEmployee(employeeId, updatedData);
      fetchEmployees();
    } catch (error) {
      console.error("Lỗi khi sửa nhân viên:", error);
    }
  };

  const deleteEmployee = async (employeeId) => {
    try {
      await UserService.deleteEmployee(employeeId);
      fetchEmployees();
    } catch (error) {
      console.error("Lỗi khi xóa nhân viên:", error);
    }
  };

  const handleOpenModal = (employee = null) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
    setFormData({}); // Đặt lại dữ liệu
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedEmployee) {
      await editEmployee(selectedEmployee.userID, formData);
    } else {
      await addEmployee(formData);
    }
    handleCloseModal();
  };

  return (
    <TitleCard title="Nhân viên" topMargin="mt-2">
      <div>
        <div className="flex items-center my-4">
          <input
            type="text"
            placeholder="Tìm kiếm nhân viên..."
            value={keyword}
            onChange={handleSearchChange}
            className="rounded px-2 py-1 mr-2"
          />
          <button
            onClick={() => handleOpenModal()} // Mở modal thêm nhân viên
            className="text-blue-500 hover:text-blue-700 flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-1" /> Thêm nhân viên
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
            {employees.map((employee) => (
              <tr key={employee.userID}>
                <td className="py-2 px-4">
                  <img
                    src={employee.avatarUrl}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full mr-2"
                  />
                </td>
                <td className="py-2 px-4 flex items-center">
                  <div className="flex flex-col">
                    <div className="font-bold">{employee.fullName}</div>
                    <div className="text-sm">{employee.username}</div>
                  </div>
                </td>
                <td className="py-2 px-4">{employee.email}</td>
                <td className="py-2 px-4 flex space-x-2">
                  <button
                    onClick={() => handleOpenModal(employee)} // Mở modal để sửa nhân viên
                    className="py-2 px-4"
                    title="Chỉnh sửa"
                  >
                    <PencilIcon className="w-5 h-5 text-blue-500 hover:text-blue-700" />
                  </button>
                  <button
                    onClick={() => deleteEmployee(employee.userID)} // Xóa nhân viên
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
        <EmployeeModal
          onClose={handleCloseModal}
          employee={selectedEmployee}
          onSubmit={handleSubmit}
        />
      )}
    </TitleCard>
  );
}

export default Staff;
