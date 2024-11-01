import { useState, useEffect } from 'react';
import TitleCard from '../../components/Cards/TitleCard';
import UserAddressService from "../../services/userAddressService";
import ProfileService from "../../services/profileService";
import MapPinIcon from '@heroicons/react/24/outline/MapPinIcon';

function Purchase() {
  // Khai báo state để lưu trữ địa chỉ và thông tin người dùng
  const [userAddresses, setUserAddresses] = useState([]);
  const [userInfo, setUserInfo] = useState(null); // Thêm state cho thông tin người dùng
  const [selectedAddress, setSelectedAddress] = useState('');

  // Hàm để gọi API lấy danh sách địa chỉ của người dùng
  const fetchUserAddresses = async () => {
    try {
      const addresses = await UserAddressService.fetchUserAddresses(); // Lấy danh sách địa chỉ của người dùng
      setUserAddresses(addresses); // Cập nhật state với danh sách địa chỉ
    } catch (error) {
      console.error("Error fetching user addresses:", error);
    }
  };

  // Hàm để gọi API lấy thông tin người dùng hiện tại
  const fetchCurrentUser = async () => {
    try {
      const user = await ProfileService.fetchCurrentUser(); // Gọi API để lấy thông tin người dùng
      setUserInfo(user); // Cập nhật state với thông tin người dùng
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  // Gọi các hàm fetchUserAddresses và fetchCurrentUser khi component được mount
  useEffect(() => {
    fetchUserAddresses();
    fetchCurrentUser();
  }, []);

  return (
    <TitleCard>
      <div className="bg-white text-gray-800 rounded-lg px-4 py-4 flex flex-col">
        {/* Hiển thị họ và tên và số điện thoại */}
        <div className="mb-2">
          <div className="flex items-center">
            <MapPinIcon className="h-4 w-4 mr-2" />
            <label className="block text-sm font-medium text-gray-900">
              {userInfo ? `${userInfo.fullname} | ${userInfo.phone}` : 'Không có thông tin người dùng'}
            </label>
          </div>

        </div>
        <div>
          <label htmlFor="addressSelect" className="block text-sm font-medium text-gray-900">Địa chỉ</label>
          <select
            name="addressSelect"
            id="addressSelect"
            value={selectedAddress}
            onChange={(e) => setSelectedAddress(e.target.value)}
            className="select select-primary w-full mt-1.5 bg-white text-black"
          >
            {userAddresses.length > 0 && (
              <option value={userAddresses[0].addressID}>
                {`${userAddresses[0].detailAddress}, ${userAddresses[0].wardName}, ${userAddresses[0].districtName}, ${userAddresses[0].provinceName}`}
              </option>
            )}
            {userAddresses.slice(1).map((address) => (
              <option key={address.addressID} value={address.addressID}>
                {`${address.detailAddress}, ${address.wardName}, ${address.districtName}, ${address.provinceName}`}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="bg-white text-gray-800 rounded-lg px-4 py-4 flex flex-col mt-2">
        {/* Hiển thị thông tin đơn hàng */}
        <div className="flex items-center">
          {/* Hình ảnh sản phẩm */}
          <img src="link-to-your-image.jpg" alt="Product" className="h-16 w-16 object-cover rounded-lg mr-4" />

          {/* Thông tin sản phẩm */}
          <div className="flex flex-col">
            <span className="text-lg font-semibold">Tên sản phẩm</span>
            <span className="text-sm text-gray-600">Số lượng: 1</span>
            <span className="text-lg font-medium text-gray-900">Giá: 100.000 VNĐ</span>
          </div>
        </div>
      </div>

    </TitleCard>
  );
}

export default Purchase;
