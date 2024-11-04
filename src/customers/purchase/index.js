import React, { useState, useEffect } from 'react';
import TitleCard from '../../components/Cards/TitleCard';
import UserAddressService from "../../services/userAddressService";
import ProfileService from "../../services/profileService";
import UserVoucherService from "../../services/userVoucherService";
import GHNService from "../../services/GHNService";
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Purchase = ({ fromDistrictId, fromWardCode, productDetails }) => {

  const [userAddresses, setUserAddresses] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const location = useLocation();
  const [selectedAddress, setSelectedAddress] = useState('');
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const selectedItems = location.state?.selectedItems || [];
  const [selectedVoucherDiscount, setSelectedVoucherDiscount] = useState(0);
  const [shippingFee, setShippingFee] = useState(null);
  const [error, setError] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [toDistrictId, setDistrictId] = useState('');
  const [toWardCode, setWardCode] = useState('');
  const navigate = useNavigate();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  useEffect(() => {
  }, [selectedItems]);

  const fetchUserAddresses = async () => {
    try {
      const addresses = await UserAddressService.fetchUserAddresses();
      const sortedAddresses = addresses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setUserAddresses(sortedAddresses);
      if (sortedAddresses.length > 0) {
        setSelectedAddress(sortedAddresses[0]);
        setDistrictId(sortedAddresses[0].districtID);
        setWardCode(sortedAddresses[0].wardCode);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách địa chỉ người dùng:", error);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const user = await ProfileService.fetchCurrentUser();
      setUserInfo(user);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const response = await UserVoucherService.getUserVouchers();
      const sortedVouchers = response?.length ? response.sort((a, b) => b.discountLevel - a.discountLevel) : [];
      setVouchers(sortedVouchers);
      if (sortedVouchers.length > 0) {
        const highestDiscountVoucher = sortedVouchers[0];
        setSelectedVoucher(highestDiscountVoucher.voucherID);
        setSelectedVoucherDiscount(highestDiscountVoucher.discountLevel);
      } else {
        setSelectedVoucher(null);
        setSelectedVoucherDiscount(0);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách voucher:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAddresses();
    fetchCurrentUser();
    fetchVouchers();
    calculateShippingFee();
  }, []);

  const calculateTotalOriginalPrice = () => {
    return selectedItems.reduce((total, item) => {
      return total + (item.discountPrice * item.quantity);
    }, 0);
  };

  const handleVoucherChange = (event) => {
    const selectedVoucherId = event.target.value;
    setSelectedVoucher(selectedVoucherId);

    if (calculateTotalOriginalPrice() <= 99000) {
      setSelectedVoucherDiscount(0);
      return;
    }

    const selected = vouchers.find(voucher => voucher.voucherID === selectedVoucherId);
    if (selected) {
      setSelectedVoucherDiscount(selected.discountLevel);
    } else {
      setSelectedVoucherDiscount(0);
    }
  };

  const calculatorWeight = async () => {
    let weight = 0;
    selectedItems.forEach(item => {
      weight += item.weight * item.quantity;
    });
    return Math.round(weight);
  };

  const getDistrictID = async () => {
    return userAddresses;
  }

  const calculateShippingFee = async () => {
    setLoading(true);
    setError(null);
    console.log('toDistrictId:', toDistrictId);
    console.log('toWardCode:', toWardCode);
    let weight = await calculatorWeight();
    let items = [];

    selectedItems.forEach(item => {
      items.push({
        "name": item.productName + " " + item.versionName,
        "quantity": item.quantity,
        "height": Math.round(item.height),
        "weight": Math.round(item.weight),
        "length": Math.round(item.length),
        "width": Math.round(item.width),
      });
    });

    try {
      const response = await GHNService.calculateShippingFee({
        toDistrictId: Number(toDistrictId), // đảm bảo là kiểu số
        toWardCode: String(toWardCode),
        weight,
        items
      });

      setShippingFee(response.data.total);
    } catch (err) {
      console.error('Error calculating shipping fee:', err);
      setError('Không thể tính phí vận chuyển, vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (toDistrictId && toWardCode) {
      calculateShippingFee();
    }
  }, [toDistrictId, toWardCode]);

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!paymentMethod) {
      setError('Vui lòng chọn phương thức thanh toán.');
      return;
    }

    if (paymentMethod === 'vnpay') {
      navigate('/pay');
    }
  };

  const handleChangeAddress = (event) => {
    // Lấy đúng districtID và wardCode từ các thuộc tính của option
    const selectedOption = event.target.selectedOptions[0];
    setDistrictId(selectedOption.getAttribute('data-district-id'));
    setWardCode(selectedOption.value);
  };

  // Hàm tính tổng tiền
  const calculateTotalAmount = () => {
    const totalPrice = calculateTotalOriginalPrice();
    const discountAmount = (totalPrice * selectedVoucherDiscount) / 100; // Tính số tiền giảm giá
    const totalAmount = totalPrice - discountAmount + (shippingFee || 0); // Tổng tiền = tổng giá - giảm giá + phí vận chuyển
    return totalAmount;
  };


  return (
    <TitleCard>
      <section className="bg-white antialiased dark:bg-gray-900">
        <form onSubmit={handleSubmit} action="#" className="mx-auto max-w-screen-xl px-4 2xl:px-0">
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
                    <dd className="text-base font-medium text-green-500">{selectedVoucherDiscount}%</dd>
                  </dl>


                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Phí vận chuyển</dt>
                    {loading ? (
                      <dd className="text-base font-medium text-gray-900 dark:text-white">Đang tính...</dd>
                    ) : error ? (
                      <dd className="text-base font-medium text-red-500">{error}</dd>
                    ) : (
                      <dd className="text-base font-medium text-gray-900 dark:text-white">
                        {shippingFee ? `${formatCurrency(shippingFee)}` : 'Chưa có phí'}
                      </dd>
                    )}
                  </dl>

                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Tổng tiền</dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">{formatCurrency(calculateTotalAmount())}</dd>
                  </dl>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  className="btn flex w-full items-center justify-center rounded-lg text-white bg-primary dark:bg-primary font-bold"
                >
                  Mua hàng
                </button>
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
                  <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Địa chỉ
                  </label>
                  <select
                    id="address-selector"
                    className="select select-bordered w-full max-w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                    onChange={handleChangeAddress}
                  >
                    {userAddresses.map((address, index) => (
                      <option
                        key={index}
                        value={address.wardCode}
                        data-district-id={address.districtID} // Lưu districtID làm thuộc tính data
                      >
                        {address.detailAddress}, {address.wardName}, {address.districtName}, {address.provinceName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <hr />

              <div className="w-full">
                <label htmlFor="your_voucher" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                  Voucher
                </label>
                <select
                  id="your_voucher"
                  value={selectedVoucher || ''} // Đặt giá trị mặc định
                  onChange={handleVoucherChange} // Thêm onChange để xử lý sự kiện
                  className="select select-bordered w-full max-w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                >
                  <option disabled value="">Chọn mã voucher</option>
                  {loading ? (
                    <option>Đang tải...</option>
                  ) : (
                    vouchers.map(voucher => (
                      <option key={voucher.voucherID} value={voucher.voucherID}>
                        {voucher.voucherCode} - {voucher.discountLevel}%
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
                        <input
                          id="credit-card"
                          aria-describedby="credit-card-text"
                          type="radio"
                          name="payment-method"
                          value="vnpay" // Thêm giá trị cho phương thức VNPAY
                          className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                          onChange={handlePaymentMethodChange}
                          checked={paymentMethod === 'vnpay'} // Kiểm tra xem có được chọn không
                        />
                      </div>
                      <div className="ms-4 text-sm">
                        <label htmlFor="credit-card" className="font-medium leading-none text-gray-900 dark:text-white">Thanh toán VNPAY</label>
                        <p id="credit-card-text" className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">Thanh toán bằng VNPay của bạn</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="pay-on-delivery"
                          aria-describedby="pay-on-delivery-text"
                          type="radio"
                          name="payment-method"
                          value="cod" // Thêm giá trị cho phương thức COD
                          className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                          onChange={handlePaymentMethodChange}
                          checked={paymentMethod === 'cod'} // Kiểm tra xem có được chọn không
                        />
                      </div>
                      <div className="ms-4 text-sm">
                        <label htmlFor="pay-on-delivery" className="font-medium leading-none text-gray-900 dark:text-white">Thanh toán khi nhận hàng</label>
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
