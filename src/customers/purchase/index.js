import { useState, useEffect } from 'react';
import TitleCard from '../../components/Cards/TitleCard';
import UserAddressService from "../../services/userAddressService";
import ProfileService from "../../services/profileService";
import UserVoucherService from "../../services/userVoucherService";
import { useLocation } from 'react-router-dom';
import MapPinIcon from '@heroicons/react/24/outline/MapPinIcon';

const Purchase = () => {
  // Khai báo state để lưu danh sách địa chỉ người dùng, thông tin người dùng và địa chỉ đã chọn
  const [userAddresses, setUserAddresses] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const location = useLocation();
  const [selectedAddress, setSelectedAddress] = useState('');
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const selectedItems = location.state?.selectedItems || []; // Sử dụng toán tử `?` để tránh lỗi nếu state không tồn tại

  // Hàm định dạng tiền tệ
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  useEffect(() => {
    console.log("Danh sách sản phẩm được chọn:", selectedItems);
  }, [selectedItems]);

  // Hàm gọi API để lấy danh sách địa chỉ của người dùng
  const fetchUserAddresses = async () => {
    try {
      const addresses = await UserAddressService.fetchUserAddresses(); // Gọi API để lấy địa chỉ
      setUserAddresses(addresses); // Cập nhật state với danh sách địa chỉ
    } catch (error) {
      console.error("Lỗi khi lấy danh sách địa chỉ người dùng:", error); // Log lỗi nếu có
    }
  };

  // Hàm gọi API để lấy thông tin người dùng hiện tại
  const fetchCurrentUser = async () => {
    try {
      const user = await ProfileService.fetchCurrentUser(); // Gọi API để lấy thông tin người dùng
      setUserInfo(user); // Cập nhật state với thông tin người dùng
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error); // Log lỗi nếu có
    }
  };

  // Hàm lấy danh sách voucher từ UserVoucherService
  const fetchVouchers = async () => {
    setLoading(true);
    const response = await UserVoucherService.getUserVouchers();
    setVouchers(response?.length ? response : []);
    setLoading(false);
  };

  // Gọi các hàm fetchUserAddresses và fetchCurrentUser khi component được mount
  useEffect(() => {
    fetchUserAddresses(); // Lấy danh sách địa chỉ
    fetchCurrentUser(); // Lấy thông tin người dùng
    fetchVouchers(); //Lấy danh sách voucher
  }, []);


  // Hàm tính giá gốc tổng
  const calculateTotalOriginalPrice = () => {
    return selectedItems.reduce((total, item) => {
      return total + (item.discountPrice * item.quantity); // Tính tổng giá gốc cho từng sản phẩm
    }, 0);
  };

  return (
    <TitleCard>
      <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
        <form action="#" className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-12 xl:gap-16">

            {/* Thông tin sản phẩm */}
            <div className="mt-6 w-full space-y-6 sm:mt-8 lg:mt-0 lg:max-w-xs xl:max-w-md">
              <div className="flow-root">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                    {selectedItems.map((item, index) => (
                      <tr key={item.cartID} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                        <td>
                          <img
                            className="h-16 w-16 object-cover rounded"
                            src={item.image}
                          />
                        </td>
                        <td>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{item.productName} | {item.versionName}</p>
                          <p className="text-xs text-gray-900 dark:text-white"><s><i>{formatCurrency(item.price)}</i></s></p>
                          <p className="text-xs text-red-500">{formatCurrency(item.discountPrice)}</p>
                        </td>
                        <td className="px-4 py-2">
                          <p className="text-sm text-gray-500 dark:text-gray-400">x {item.quantity}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="-my-3 divide-y divide-gray-200 dark:divide-gray-800 mt-3">
                  {/* Hiển thị thông tin giá cả */}
                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Tổng tiền sản phẩm</dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">{formatCurrency(calculateTotalOriginalPrice())}</dd>
                  </dl>

                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Giá giảm voucher</dt>
                    <dd className="text-base font-medium text-green-500">0</dd>
                  </dl>

                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Phí vận chuyển</dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">$99</dd>
                  </dl>

                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Tổng tiền</dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">$8,193.00</dd>
                  </dl>
                </div>
              </div>

              <div className="space-y-3">
                <button type="submit" className="btn flex w-full items-center justify-center rounded-lg text-white bg-primary font-bold">Mua hàng</button>
                <p className="text-sm font-normal text-gray-500 dark:text-gray-400">Kiểm tra thông tin đầy đủ trước khi mua hàng bạn nhé!</p>
              </div>
            </div>

            {/* Thông tin người dùng */}
            <div className="min-w-0 flex-1 space-y-8">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Thông tin</h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="your_name" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Họ và tên</label>
                    <input
                      type="text"
                      id="your_name"
                      value={userInfo ? userInfo.fullname : ''} // Điền tên người dùng
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                      readOnly // Đặt thuộc tính readOnly nếu không muốn người dùng chỉnh sửa
                    />
                  </div>

                  <div>
                    <label htmlFor="your_phone" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Số điện thoại</label>
                    <input
                      type="text"
                      id="your_phone"
                      value={userInfo ? userInfo.phone : ''} // Điền số điện thoại người dùng
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                      readOnly // Đặt thuộc tính readOnly nếu không muốn người dùng chỉnh sửa
                    />
                  </div>
                </div>

                <div className="w-full">
                  <label htmlFor="your_address" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Địa chỉ</label>
                  <select
                    id="your_address"
                    className="select select-bordered w-full max-w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                    value={selectedAddress}
                    onChange={(e) => setSelectedAddress(e.target.value)} // Cập nhật địa chỉ đã chọn
                  >
                    <option disabled selected value="">Chọn địa chỉ</option>
                    {userAddresses.map((address, index) => (
                      <option key={index} value={address.id}>{address.detailAddress}, {address.wardName}, {address.districtName}, {address.provinceName} </option> // Điền địa chỉ thực tế
                    ))}
                    {/* Hiển thị thông báo nếu không có địa chỉ */}
                    {userAddresses.length === 0 && <option disabled>Bạn chưa có địa chỉ nào.</option>}
                  </select>
                </div>
              </div>
              <hr />
              <div className="w-full">
                <label htmlFor="your_voucher" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Voucher</label>
                <select
                  id="your_voucher"
                  className="select select-bordered w-full max-w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                >
                  <option disabled selected>Chọn mã voucher</option>
                  {/* Hiển thị mã voucher nếu có */}
                  {loading ? (
                    <option>Đang tải...</option> // Hiển thị thông báo đang tải
                  ) : (
                    vouchers.map(voucher => (
                      <option key={voucher.voucherID} value={voucher.voucherID}> {/* Thay `voucher.id` và `voucher.code` bằng thuộc tính thích hợp từ response của bạn */}
                        {voucher.voucherCode} - {voucher.discountLevel}% {/* Thay `voucher.name` bằng tên voucher */}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Phương thức thanh toán</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input id="credit-card" aria-describedby="credit-card-text" type="radio" name="payment-method" value="" className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" checked />
                      </div>
                      <div className="ms-4 text-sm">
                        <label htmlFor="credit-card" className="font-medium leading-none text-gray-900 dark:text-white"> Thẻ tín dụng </label>
                        <p id="credit-card-text" className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">Thanh toán bằng thẻ tín dụng của bạn</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input id="pay-on-delivery" aria-describedby="pay-on-delivery-text" type="radio" name="payment-method" value="" className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600" />
                      </div>

                      <div className="ms-4 text-sm">
                        <label htmlFor="pay-on-delivery" className="font-medium leading-none text-gray-900 dark:text-white"> Thanh toán khi nhận hàng </label>
                        <p id="pay-on-delivery-text" className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">Nhận hàng và thanh toán trực tiếp</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </TitleCard>
  );
};

export default Purchase;
