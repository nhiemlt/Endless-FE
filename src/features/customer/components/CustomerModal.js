import React, { useState, useEffect } from "react";

function CustomerModal({ onClose, employee, onSubmit }) {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        fullName: employee.fullName || "",
        username: employee.username || "",
        email: employee.email || "",
        phone: employee.phone || "",
      });
    }
  }, [employee]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 max-w-lg w-full relative">
        <h2 className="text-xl font-bold text-white mb-4">{employee ? "Chỉnh sửa nhân viên" : "Thêm nhân viên"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300">Họ và tên</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full rounded border border-gray-400"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full rounded border border-gray-400"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full rounded border border-gray-400"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300">Số điện thoại</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 p-2 w-full rounded border border-gray-400"
            />
          </div>
          <div className="flex justify-end mt-4">
            <button type="button" onClick={onClose} className="bg-gray-600 text-white px-4 py-2 rounded mr-2">
              Hủy
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              {employee ? "Cập nhật" : "Thêm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CustomerModal;
