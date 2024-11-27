import React, { useState, useEffect } from 'react';
import TitleCard from '../../components/Cards/TitleCard';
import UserAddressService from "../../services/userAddressService";
import ProfileService from "../../services/profileService";
import OrderService from "../../services/OrderService";
import UserVoucherService from "../../services/userVoucherService";
import GHNService from "../../services/GHNService";
import CreateNewAddress from './components/CreateNewAddress';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { showNotification } from "../../features/common/headerSlice";
import { useDispatch } from "react-redux";

const Purchase = ({ fromDistrictId, fromWardCode, productDetails }) => {

  const dispatch = useDispatch();

  const [userAddresses, setUserAddresses] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shippingFee, setShippingFee] = useState(null);
  const [error, setError] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [toDistrictId, setDistrictId] = useState('');
  const [toWardCode, setWardCode] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const selectedItems = location.state?.selectedItems || [];
  const [selectedVoucherDiscount, setSelectedVoucherDiscount] = useState(0);
  const product = location.state?.product;  // Lấy sản phẩm từ state
  const [selectedAddressDetails, setSelectedAddressDetails] = useState(null); // Thông tin chi tiết của địa chỉ đã chọn

  const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  useEffect(() => {
    fetchUserData();
    fetchVouchers();
    calculateShippingFee();
  }, []);

  useEffect(() => {
    if (toDistrictId && toWardCode) {
      calculateShippingFee();
    }
  }, [toDistrictId, toWardCode]);

  const fetchUserData = async () => {
    try {
      const [addresses, user] = await Promise.all([UserAddressService.fetchUserAddresses(), ProfileService.fetchCurrentUser()]);
      const sortedAddresses = addresses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setUserAddresses(sortedAddresses);
      setUserInfo(user);

      if (sortedAddresses.length > 0) {
        setSelectedAddress(sortedAddresses[0]);
        setDistrictId(sortedAddresses[0].districtID);
        setWardCode(sortedAddresses[0].wardCode);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
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
      }
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalOriginalPrice = () => {
    return selectedItems.reduce((total, item) => total + (item.discountPrice * item.quantity), 0);
  };

  const handleVoucherChange = (event) => {
    const selectedVoucherId = event.target.value;
    setSelectedVoucher(selectedVoucherId);

    if (calculateTotalOriginalPrice() <= 99000) {
      setSelectedVoucherDiscount(0);
      return;
    }

    const selected = vouchers.find(voucher => voucher.voucherID === selectedVoucherId);
    setSelectedVoucherDiscount(selected ? selected.discountLevel : 0);
  };

  const calculateShippingFee = async () => {
    if (!toDistrictId || !toWardCode) {
      setShippingFee(0);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const weight = selectedItems.reduce((total, item) => total + (item.weight * item.quantity), 0);
      const items = selectedItems.map(item => ({
        name: item.productName + " " + item.versionName,
        quantity: item.quantity,
        height: Math.round(item.height),
        weight: Math.round(item.weight),
        length: Math.round(item.length),
        width: Math.round(item.width),
      }));

      const response = await GHNService.calculateShippingFee({
        toDistrictId: Number(toDistrictId),
        toWardCode: String(toWardCode),
        weight: Math.round(weight),
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

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!paymentMethod) {
      setError('Vui lòng chọn phương thức thanh toán.');
      return;
    }

    // Kiểm tra nếu phương thức thanh toán là thanh toán khi nhận hàng
    if (paymentMethod === 'cod') {
      try {
        // Tạo đối tượng orderModel theo cấu trúc OrderModel
        const orderModel = {
          voucherID: selectedVoucher || null,  // Nếu voucher không có, trả về null
          orderAddress: selectedAddress?.addressID,
          orderPhone: userInfo?.phone,
          orderName: userInfo?.fullname,
          orderDetails: selectedItems.map(item => ({
            productVersionID: item.productVersionID,
            quantity: item.quantity,
          })),
          shipFee: shippingFee || 0,
          codValue: calculateTotalAmount() || 0,
          insuranceValue: 0,
          serviceTypeID: 2,
        };

        // Gọi API để tạo đơn hàng
        const response = await OrderService.createOrder(orderModel);
        console.log("Order created:", response);
        navigate('/home');
        dispatch(showNotification({ message: "Đặt hàng thành công, đơn hàng đang chờ xác nhận.", status: 1 })); // Hiển thị thông báo
      } catch (error) {
        console.error("Error creating order:", error);
        dispatch(showNotification({ message: "Không thể tạo đơn hàng, vui lòng thử lại.", status: 0 })); // Hiển thị thông báo lỗi
      }
    } else if (paymentMethod === 'zalopay') {
      try {
        // Tạo đối tượng orderModel theo cấu trúc OrderModel
        const orderModel = {
          voucherID: selectedVoucher || null,  // Nếu voucher không có, trả về null
          orderAddress: selectedAddress?.addressID,
          orderPhone: userInfo?.phone,
          orderName: userInfo?.fullname,
          orderDetails: selectedItems.map(item => ({
            productVersionID: item.productVersionID,
            quantity: item.quantity,
          })),
          shipFee: shippingFee || 0,
          codValue: calculateTotalAmount() || 0,
          insuranceValue: 0,
          serviceTypeID: 2,
        };
        try {
          // Tạo đơn hàng qua API
          const response = await OrderService.createOrderzalopay(orderModel);

          if (response.success) {
            // Lấy order_id từ phản hồi
            const orderId = response.data.orderID;

            // Gọi API tạo thanh toán ZaloPay
            const zaloPaymentData = await OrderService.createPayment(orderId);

            if (zaloPaymentData.returncode === 1 && zaloPaymentData.orderurl) {
              // Hiển thị thông báo trước khi chuyển hướng
              dispatch(showNotification({ message: "Chuyển hướng đến ZaloPay...", status: 1 }));

              // Chuyển hướng sang URL thanh toán của ZaloPay
              window.location.href = zaloPaymentData.orderurl;
            } else {
              // Hiển thị lỗi nếu không có URL
              dispatch(showNotification({ message: zaloPaymentData.returnmessage || "Không tìm thấy URL thanh toán ZaloPay.", status: 0 }));
            }
          } else {
            dispatch(showNotification({ message: response.message || "Lỗi khi tạo đơn hàng.", status: 0 }));
          }
        } catch (error) {
          console.error("Đã xảy ra lỗi:", error);
          dispatch(showNotification({ message: "Đã xảy ra lỗi, vui lòng thử lại sau.", status: 0 }));
        }
      } catch (error) {
        console.error("Error creating order:", error);
        dispatch(showNotification({ message: "Không thể tạo đơn hàng, vui lòng thử lại.", status: 0 })); // Hiển thị thông báo lỗi
      }
    }
  };

  // Hàm xử lý khi thay đổi địa chỉ
  const handleChangeAddress = (e) => {
    const wardCode = e.target.value;
    setSelectedAddressId(wardCode); // Cập nhật ID địa chỉ đã chọn

    // Tìm địa chỉ đã chọn trong danh sách
    const selectedAddress = userAddresses.find(address => address.wardCode === wardCode);
    setSelectedAddressDetails(selectedAddress); // Cập nhật thông tin địa chỉ đã chọn
  };

  useEffect(() => {
    if (userAddresses.length > 0) {
      // Nếu có ít nhất 1 địa chỉ, chọn địa chỉ đầu tiên làm mặc định
      setSelectedAddressId(userAddresses[0].wardCode);
      setSelectedAddressDetails(userAddresses[0]);
    }
  }, [userAddresses]);

  const calculateDiscountAmount = () => {
    const totalPrice = calculateTotalOriginalPrice();
    const selectedVoucherInfo = vouchers.find(voucher => voucher.voucherID === selectedVoucher);

    if (!selectedVoucherInfo) return 0;

    const { biggestDiscount, discountLevel, leastDiscount } = selectedVoucherInfo;
    let discountAmount = (totalPrice * discountLevel) / 100;

    // Điều chỉnh mức giảm giá theo giới hạn trên và dưới
    if (discountAmount > biggestDiscount) {
      discountAmount = biggestDiscount;
    } else if (discountAmount < leastDiscount) {
      discountAmount = leastDiscount;
    }

    return discountAmount;
  };

  const calculateTotalAmount = () => {
    const totalPrice = calculateTotalOriginalPrice();
    const discountAmount = calculateDiscountAmount();

    // Tổng tiền cuối cùng = tổng giá trị sản phẩm - giảm giá + phí vận chuyển
    return totalPrice - discountAmount + (shippingFee || 0);
  };


  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  // Mở Modal
  const handleOpenModal = () => setIsAddressModalOpen(true);

  // Đóng Modal
  const handleCloseModal = () => setIsAddressModalOpen(false);

  const handleAddNewAddress = (newAddress) => {
    // Thêm địa chỉ mới vào đầu danh sách
    setUserAddresses([newAddress, ...userAddresses]);

    // Cập nhật giá trị mặc định của select với địa chỉ mới
    setSelectedAddressId(newAddress.wardCode); // Hoặc một giá trị xác định khác của địa chỉ mới
  };

  return (
    <TitleCard>
      <section className="bg-white antialiased dark:bg-gray-900">
       <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
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
                    <dd className="text-base font-medium text-gray-900 dark:text-white"><i>{formatCurrency(calculateDiscountAmount())}</i></dd>
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
                    <dd className="text-base font-medium text-red-500 dark:text-white"><b>{formatCurrency(calculateTotalAmount())}</b></dd>
                  </dl>
                </div>
              </div>

              {/* Nút mua hàng */}
              <form onSubmit={handleSubmit}>
              <div className="space-y-3">
                <button
                  type="submit"
                  className="btn flex w-full items-center justify-center rounded-lg text-white bg-primary dark:bg-primary font-bold"
                >
                  Mua hàng
                </button>
                <p className="text-sm font-normal text-gray-500 dark:text-gray-400">Kiểm tra thông tin đầy đủ trước khi mua hàng bạn nhé!</p>
              </div>
              </form>
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
                  <div className="flex items-center gap-2">
                    <select
                      id="address-selector"
                      className="select select-bordered w-full max-w-full flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                      value={selectedAddressId}  // Giá trị mặc định
                      onChange={handleChangeAddress}
                    >
                      {userAddresses.map((address, index) => (
                        <option key={index} value={address.wardCode}>
                          {address.detailAddress}, {address.wardName}, {address.districtName}, {address.provinceName}
                        </option>
                      ))}
                    </select>
                    {/* Nút Thêm Địa Chỉ */}
                    <button onClick={handleOpenModal} className="btn btn-primary">
                      Thêm địa chỉ
                    </button>

                    {/* Hiển thị Modal Thêm Địa Chỉ */}
                    <CreateNewAddress
                      isModalOpen={isAddressModalOpen}
                      onCancel={handleCloseModal}
                      onAddNewAddress={handleAddNewAddress}
                      fetchUserData={fetchUserData}
                    />
                  </div>
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
                          value="zalopay" // Thêm giá trị cho phương thức zalopay
                          className="h-4 w-4 border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600"
                          onChange={handlePaymentMethodChange}
                          checked={paymentMethod === 'zalopay'} // Kiểm tra xem có được chọn không
                        />
                      </div>
                      <div className="ms-4 text-sm">
                        <label htmlFor="credit-card" className="font-medium leading-none text-gray-900 dark:text-white">Thanh toán zalopay</label>
                        <img
                          id="credit-card-text"
                          className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400"
                          src="./logo-zalopay-payment.png"
                          style={{ width: '100px', height: 'auto' }}
                        />
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
                        <img
                          id="credit-card-text"
                          className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400"
                          src="./logo-direct-payment.png"
                          style={{ width: '100px', height: 'auto' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
      </section>
    </TitleCard >
  );
};

export default Purchase;
