// PasswordChange.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import TitleCard from "../../../components/Cards/TitleCard";
import { showNotification } from '../../common/headerSlice';
import UserService from '../../../services/UserService';
import { useSelector } from 'react-redux';
import EyeIcon from "@heroicons/react/24/outline/EyeIcon";
import EyeSlashIcon from "@heroicons/react/24/outline/EyeSlashIcon";


function PasswordChange() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useDispatch();

  // Lấy username từ Redux store
  const username = useSelector((state) => state.user.username);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Kiểm tra xem mật khẩu mới có khớp với xác nhận mật khẩu không
    if (newPassword !== confirmPassword) {
      dispatch(showNotification({ message: "Mật khẩu mới và xác nhận mật khẩu không khớp.", status: 0 }));
      return;
    }

    // Gọi service để thay đổi mật khẩu
    const response = await UserService.changePassword({
      oldPassword,
      newPassword,
    });

    // Xử lý phản hồi từ service
    if (response.success) {
      dispatch(showNotification({ message: "Đổi mật khẩu thành công.", status: 1 }));
      // Reset lại các trường input sau khi đổi mật khẩu thành công
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      dispatch(showNotification({ message: response.message || "Đổi mật khẩu thất bại.", status: 0 }));
    }
  };

  return (
    <>
      <TitleCard title="Đổi mật khẩu">
        <div className="flex justify-center items-center min-h-screen">
          <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Đổi Mật Khẩu</h2>

            <form onSubmit={handleChangePassword}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="oldPassword">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  id="oldPassword"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="newPassword">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  id="newPassword"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="confirmPassword">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-sm btn-outline btn-primary w-full"
              >
                Cập nhật mật khẩu
              </button>
            </form>
          </div>
        </div>
      </TitleCard>
    </>
  );
}

export default PasswordChange;
