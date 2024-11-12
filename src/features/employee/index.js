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
  const [totalPages, setTotalPages] = useState(1);
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
      setTotalPages(response.totalPages);
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
    const employee = employees.find((emp) => emp.userID === employeeId);
    if (employee.roles.some((role) => role.name === "SuperAdmin")) {
      alert("Không thể xóa nhân viên có vai trò SuperAdmin.");
      return;
    }
    try {
      await UserService.deleteEmployee(employeeId);
      fetchEmployees();
    } catch (error) {
      console.error("Lỗi khi xóa nhân viên:", error);
    }
  };

  const handleOpenModal = (employee = null) => {
    if (employee && employee.roles.some((role) => role.name === "SuperAdmin")) {
      alert("Không thể chỉnh sửa nhân viên có vai trò SuperAdmin.");
      return;
    }
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
      <div className="flex flex-col md:flex-row justify-between items-center w-full mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm nhân viên..."
          value={keyword}
          onChange={handleSearchChange}
          className="input input-bordered w-full md:w-50 h-8 m-3"
        />
        <button
          onClick={() => handleOpenModal()}
          className="btn btn-outline btn-sm btn-primary"
        >
          <PlusIcon className="w-5 h-5 mr-1" /> Thêm nhân viên
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-xs w-full">
          <thead>
            <tr>
              <th>STT</th>
              <th>Avatar</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((employee, index) => (
                <tr key={employee.userID}>
                  <td>{page * size + index + 1}</td>
                  <td>
                    <img
                      src={employee.avatarUrl}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full"
                    />
                  </td>
                  <td>{employee.fullName}</td>
                  <td>{employee.email}</td>
                  <td>
                    <div className="flex space-x-2">
                      <PencilIcon
                        onClick={() => handleOpenModal(employee)}
                        className="w-5 cursor-pointer text-green-600"
                      />
                      <TrashIcon
                        onClick={() => deleteEmployee(employee.userID)}
                        className="w-5 cursor-pointer text-red-500"
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">
                  Không có dữ liệu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="join mt-4 flex justify-center w-full">
        <button
          onClick={() => setPage(page - 1)}
          className="join-item btn btn-sm btn-primary"
          disabled={page === 0}
        >
          Trước
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setPage(index)}
            className={`join-item btn btn-sm btn-primary ${
              page === index ? "btn-active" : ""
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => setPage(page + 1)}
          className="join-item btn btn-sm btn-primary"
          disabled={page >= totalPages - 1}
        >
          Tiếp
        </button>
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
