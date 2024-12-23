import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircleIcon,
  TruckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ClipboardDocumentCheckIcon,
  ShieldCheckIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import OrderService from "../../services/OrderService";
import ConfirmCancelModal from "./components/ConfirmCancelModal";
import { showNotification } from "../../features/common/headerSlice";
import { useDispatch } from "react-redux";

function PurchaseHistory() {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [size, setSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [confirmCancelModalIsOpen, setConfirmCancelModalIsOpen] =
    useState(false);

  const orderStatuses = [
    "Tất cả",
    "Chờ xác nhận",
    "Chờ thanh toán",
    "Đã thanh toán",
    "Đã xác nhận",
    "Đang giao hàng",
    "Đã giao hàng",
    "Đã hủy",
  ];

  const fetchOrders = async () => {
    try {
      const response = await OrderService.getAllOrderByUserLogin(
        searchText,
      );

      console.log(response)
      if (response?.data) {
        const updatedOrders = response.data.map((order) => {
          const hasPendingRatings = order.orderDetails.some(
            (detail) => !detail.rated
          );
          return {
            ...order,
            hasPendingRatings,
          };
        });

        setOrders(updatedOrders);
        setFilteredOrders(updatedOrders);
        setTotalPages(response.data.totalPages);
      } else {
        console.log(response);
        
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách hóa đơn:", error);
      console.log(error);
      dispatch(
        showNotification({
          message: "Không thể tải danh sách hóa đơn. Vui lòng thử lại.",
          status: 0,
        })
      );
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [searchText, currentPage, size]);

  useEffect(() => {
    const filtered = orders.filter((order) => {
      const matchesStatus =
        activeTab === "Tất cả" || order.status === activeTab;
      const matchesSearch =
        order.orderID.toLowerCase().includes(searchText.toLowerCase()) ||
        order.orderDetails.some((item) =>
          item.productName.toLowerCase().includes(searchText.toLowerCase())
        );

      return matchesStatus && matchesSearch;
    });

    setFilteredOrders(filtered);
  }, [activeTab, orders, searchText]);

  const openModal = (order) => {
    setSelectedOrder(order);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedOrder(null);
    setSelectedPaymentMethod("");
  };

  const openConfirmCancelModal = (order) => {
    setOrderToCancel(order);
    setConfirmCancelModalIsOpen(true);
  };

  const closeConfirmCancelModal = () => {
    setOrderToCancel(null);
    setConfirmCancelModalIsOpen(false);
  };

  const confirmCancelOrder = async () => {
    if (!orderToCancel) return;

    try {
      const response = await OrderService.cancelOrder(orderToCancel.orderID);
      console.log(response);
      if (response.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderID === orderToCancel.orderID
              ? { ...order, status: "Đã hủy" }
              : order
          )
        );

        dispatch(
          showNotification({
            message: `Đơn hàng #${orderToCancel.orderID} đã được hủy thành công.`,
            status: 1,
          })
        );
      } else {
        throw new Error("Phản hồi API không thành công.");
      }
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);

      dispatch(
        showNotification({
          message: `Không thể hủy đơn hàng #${orderToCancel.orderID}. Vui lòng thử lại.`,
          status: 0,
        })
      );
    } finally {
      closeConfirmCancelModal();
    }
  };

  const handlePayment = async () => {
    try {
      if (!selectedOrder || !selectedOrder.orderID) {
        dispatch(
          showNotification({
            message: "Đơn hàng không hợp lệ. Vui lòng chọn đơn hàng khác.",
            status: 0,
          })
        );
        return;
      }

      const orderID = selectedOrder.orderID; // Lấy ID hóa đơn từ `selectedOrder`

      if (selectedPaymentMethod === "zalopay") {
        const zaloPaymentData = await OrderService.createPayment(orderID);

        if (zaloPaymentData?.returncode === 1 && zaloPaymentData?.orderurl) {
          dispatch(
            showNotification({
              message: "Chuyển hướng đến ZaloPay...",
              status: 1,
            })
          );
          window.location.href = zaloPaymentData.orderurl;
        } else {
          dispatch(
            showNotification({
              message: "Không tìm thấy URL thanh toán ZaloPay.",
              status: 0,
            })
          );
        }
      } else if (selectedPaymentMethod === "vnpay") {
        const vnpayPaymentData = await OrderService.createVNPayPaymentUrl(
          orderID
        );

        if (typeof vnpayPaymentData === "string") {
          dispatch(
            showNotification({
              message: "Chuyển hướng đến VNPay...",
              status: 1,
            })
          );
          window.location.href = vnpayPaymentData;
        } else {
          dispatch(
            showNotification({
              message: "Không tìm thấy URL thanh toán VNPay.",
              status: 0,
            })
          );
        }
      } else {
        dispatch(
          showNotification({
            message: "Phương thức thanh toán không hợp lệ.",
            status: 0,
          })
        );
      }
    } catch (error) {
      console.error("Lỗi trong quá trình thanh toán:", error);
      dispatch(
        showNotification({
          message: "Không thể xử lý thanh toán, vui lòng thử lại.",
          status: 0,
        })
      );
    } finally {
      closeModal();
    }
  };

  const renderPagination = () => {
    const pages = Array.from({ length: totalPages }, (_, index) => index);

    return (
      <div className="join mt-4 flex justify-center w-full">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="join-item btn"
          disabled={currentPage === 0}
        >
          Trước
        </button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`join-item btn ${
              currentPage === page ? "btn-primary" : ""
            }`}
          >
            {page + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="join-item btn"
          disabled={currentPage === totalPages - 1}
        >
          Tiếp
        </button>
      </div>
    );
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const formatMoney = (value) => {
    if (value === undefined || value === null) {
      return "0";
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " đ";
  };

  const handleMarkAsDelivered = async (orderId) => {
    try {
      const response = await OrderService.markOrderAsDelivered(orderId);

      if (response.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderID === orderId
              ? { ...order, status: "Đã giao hàng" }
              : order
          )
        );

        dispatch(
          showNotification({
            message: `Đơn hàng #${orderId} đã được cập nhật thành 'Đã giao hàng'.`,
            status: 1,
          })
        );
      } else {
        dispatch(
          showNotification({
            message: `Không thể cập nhật trạng thái đơn hàng #${orderId}.`,
            status: 0,
          })
        );
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);

      dispatch(
        showNotification({
          message: "Có lỗi xảy ra trong quá trình cập nhật trạng thái.",
          status: 0,
        })
      );
    }
  };

  const handlePaymentMethodChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };  

  return (
    <div className="bg-base-200 min-h-screen py-12 px-8">
      <h1 className="text-4xl font-bold text-center mb-8">Lịch Sử Mua Hàng</h1>

      {/* Tabs Section */}
      <div className="tabs tabs-lifted">
        {orderStatuses.map((status) => (
          <a
            key={status}
            className={`tab tab-lifted font-semibold ${
              activeTab === status ? "tab-active" : ""
            }`}
            onClick={() => setActiveTab(status)}
          >
            {status}
          </a>
        ))}
      </div>

      {/* Orders List */}
      <div className="flex flex-col gap-8 tab-content bg-base-100 border-base-300 p-6">
        {activeTab === "Tất cả" && (
          <div className="flex justify-center mb-4">
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Tìm kiếm theo mã đơn hàng hoặc tên sản phẩm"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        )}

        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.orderID}
              className="card bg-white dark:bg-gray-800 shadow-xl p-4 rounded-lg cursor-pointer hover:shadow-2xl transition duration-300"
              onClick={() => openModal(order)}
            >
              <div className="flex justify-between items-start">
                <span
                  className={`text-sm font-semibold px-2 py-1 rounded ${
                    order.status === "Chờ xác nhận"
                      ? "bg-yellow-400 text-white"
                      : order.status === "Đã giao hàng"
                      ? "bg-green-500 text-white"
                      : order.status === "Đã hủy"
                      ? "bg-red-500 text-white"
                      : "bg-pink-400 text-white"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="flex items-start space-x-4 mt-4">
                <img
                  src={order.orderDetails[0].productVersionImage}
                  alt={order.orderDetails[0].productName}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex flex-col justify-between flex-1">
                  <h2 className="text-lg font-semibold">
                    {order.orderDetails[0].productName}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {order.orderDetails[0].productVersionName}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Số lượng: {order.orderDetails[0].quantity}
                    </p>
                    <div className="flex justify-between items-center space-x-2 mt-4">
                      {order.orderDetails[0].discountPrice &&
                      order.orderDetails[0].discountPrice !==
                        order.orderDetails[0].price ? (
                        <>
                          <p className="text-sm text-gray-400 dark:text-gray-500 line-through">
                            {formatMoney(order.orderDetails[0].price)}
                          </p>
                          <p className="text-lg font-semibold text-gray-800 dark:text-white">
                            {formatMoney(order.orderDetails[0].discountPrice)}
                          </p>
                        </>
                      ) : (
                        <p className="text-lg font-semibold text-gray-800 dark:text-white">
                          {formatMoney(order.orderDetails[0].discountPrice)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <span className="text-lg font-semibold">Tổng tiền:</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatMoney(order.totalMoney)}
                </span>
              </div>

              {order.status === "Đã giao hàng" &&
                !order.orderDetails.every((detail) => detail.rated) && (
                  <p className="text-warning text-sm mt-2 font-medium animate-pulse">
                    Bạn có sản phẩm chưa đánh giá trong đơn hàng này
                  </p>
                )}

              <div className="flex justify-end items-center mt-4">
                {(order.status === "Chờ xác nhận" ||
                  order.status === "Chờ thanh toán") && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openConfirmCancelModal(order);
                    }}
                    className="btn btn-error w-auto text-sm text-white mb-2"
                  >
                    Hủy Đơn Hàng
                  </button>
                )}
                {order.status === "Đang giao hàng" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsDelivered(order.orderID);
                    }}
                    className="btn btn-success w-auto text-sm mb-2"
                  >
                    Đã nhận hàng
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-300">
            Không có đơn hàng nào
          </p>
        )}
      </div>

      {renderPagination()}

      {modalIsOpen && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/2 relative">
            <button
              className="btn btn-square absolute top-2 right-2 text-2xl"
              onClick={closeModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">
              Thông Tin Hóa Đơn
            </h2>

            {/* Mã hóa đơn */}
            <p className="text-sm text-center text-gray-600 dark:text-gray-300 mb-4">
              Mã hóa đơn:{" "}
              <span className="font-semibold">{selectedOrder.orderID}</span>
            </p>

            <div className="steps mb-6 flex justify-between w-full items-stretch">
              {/* Step 1 - Chờ xác nhận */}
              <div
                className={`step flex-1 flex flex-col items-center ${
                  [
                    "Chờ xác nhận",
                    "Chờ thanh toán",
                    "Đã thanh toán",
                    "Đã xác nhận",
                    "Đang giao hàng",
                    "Đã giao hàng",
                  ].includes(selectedOrder.status)
                    ? "step-primary text-yellow-500"
                    : "step-inactive text-gray-400 dark:text-gray-500"
                }`}
              >
                <ClockIcon className="w-10 h-10 mb-2" />
                <span className="text-sm text-center text-gray-900 dark:text-white">
                  Chờ xác nhận
                </span>
              </div>

              {/* Step 2 - Chờ thanh toán */}
              <div
                className={`step flex-1 flex flex-col items-center ${
                  [
                    "Chờ thanh toán",
                    "Đã thanh toán",
                    "Đã xác nhận",
                    "Đang giao hàng",
                    "Đã giao hàng",
                  ].includes(selectedOrder.status)
                    ? "step-primary text-blue-500"
                    : "step-inactive text-gray-400 dark:text-gray-500"
                }`}
              >
                <CurrencyDollarIcon className="w-10 h-10 mb-2" />
                <span className="text-sm text-center text-gray-900 dark:text-white">
                  Chờ thanh toán
                </span>
              </div>

              {/* Step 3 - Đã thanh toán */}
              <div
                className={`step flex-1 flex flex-col items-center ${
                  [
                    "Đã thanh toán",
                    "Đã xác nhận",
                    "Đang giao hàng",
                    "Đã giao hàng",
                  ].includes(selectedOrder.status)
                    ? "step-primary text-green-500"
                    : "step-inactive text-gray-400 dark:text-gray-500"
                }`}
              >
                <ClipboardDocumentCheckIcon className="w-10 h-10 mb-2" />
                <span className="text-sm text-center text-gray-900 dark:text-white">
                  Đã thanh toán
                </span>
              </div>

              {/* Step 4 - Đã xác nhận */}
              <div
                className={`step flex-1 flex flex-col items-center ${
                  ["Đã xác nhận", "Đang giao hàng", "Đã giao hàng"].includes(
                    selectedOrder.status
                  )
                    ? "step-primary text-purple-500"
                    : "step-inactive text-gray-400 dark:text-gray-500"
                }`}
              >
                <ShieldCheckIcon className="w-10 h-10 mb-2" />
                <span className="text-sm text-center text-gray-900 dark:text-white">
                  Đã xác nhận
                </span>
              </div>

              {/* Step 5 - Đang giao hàng */}
              <div
                className={`step flex-1 flex flex-col items-center ${
                  ["Đang giao hàng", "Đã giao hàng"].includes(
                    selectedOrder.status
                  )
                    ? "step-primary text-orange-500"
                    : "step-inactive text-gray-400 dark:text-gray-500"
                }`}
              >
                <TruckIcon className="w-10 h-10 mb-2" />
                <span className="text-sm text-center text-gray-900 dark:text-white">
                  Đang giao hàng
                </span>
              </div>

              {/* Step 6 - Đã giao hàng */}
              <div
                className={`step flex-1 flex flex-col items-center ${
                  selectedOrder.status === "Đã giao hàng"
                    ? "step-primary text-teal-500"
                    : "step-inactive text-gray-400 dark:text-gray-500"
                }`}
              >
                <CheckCircleIcon className="w-10 h-10 mb-2" />
                <span className="text-sm text-center text-gray-900 dark:text-white">
                  Đã giao hàng
                </span>
              </div>
            </div>

            <ul className="space-y-4 mb-6">
              {selectedOrder.orderDetails.map((item, index) => (
                <li key={index} className="flex items-center space-x-4">
                  <img
                    src={item.productVersionImage}
                    alt={item.productName}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{item.productName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {item.productVersionName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Số lượng: {item.quantity} | Giá:{" "}
                      {item.discountPrice &&
                      item.discountPrice !== item.price ? (
                        <>
                          <span className="line-through text-gray-500">
                            {formatMoney(item.price)}
                          </span>{" "}
                          <span className="font-semibold text-red-600">
                            {formatMoney(item.discountPrice)}
                          </span>
                        </>
                      ) : (
                        <span className="font-semibold">
                          {formatMoney(item.price)}
                        </span>
                      )}
                    </p>
                  </div>

                  {selectedOrder.status === "Đã giao hàng" && (
                    <Link
                      to={{
                        pathname: "/rating",
                      }}
                      state={{ orderDetailID: item.orderDetailID }}
                      className={`flex items-center gap-2 px-4 py-2 btn btn-outline ${
                        item.isRated === undefined || item.isRated === false
                          ? "btn-warning"
                          : "btn-disabled bg-gray-300 cursor-not-allowed"
                      }`}
                      onClick={(e) => {
                        if (item.rated) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <StarIcon
                        className={`w-6 h-6 ${
                          item.rated ? "text-gray-400" : "text-danger"
                        }`}
                      />
                      {item.rated ? "Đã Đánh Giá" : "Đánh Giá"}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            {/* Phương thức thanh toán */}
            {selectedOrder.status === "Chờ thanh toán" && (
              <div className="space-y-4 mt-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Chọn phương thức thanh toán:
                </h4>

                <div className="flex flex-wrap gap-4">
                  {/* Thanh toán VNPay */}
                  <label
                    className={`flex items-center space-x-4 p-4 rounded-lg border cursor-pointer ${
                      selectedPaymentMethod === "vnpay"
                        ? "bg-blue-100 border-blue-500"
                        : "bg-gray-50 border-gray-300 dark:bg-gray-800 dark:border-gray-700"
                    }`}
                  >
                    <input
                      type="radio"
                      id="vnpay"
                      name="selectedPaymentMethod"
                      value="vnpay"
                      className="h-4 w-4"
                      onChange={handlePaymentMethodChange}
                      checked={selectedPaymentMethod === "vnpay"}
                    />
                    <span className="font-medium text-gray-900 dark:text-white">
                      Thanh toán VNPay
                    </span>
                    <img
                      src="./logo-vnpay-payment.png"
                      alt="VNPay Logo"
                      className="w-16"
                    />
                  </label>

                  {/* Thanh toán ZaloPay */}
                  <label
                    className={`flex items-center space-x-4 p-4 rounded-lg border cursor-pointer ${
                      selectedPaymentMethod === "zalopay"
                        ? "bg-blue-100 border-blue-500"
                        : "bg-gray-50 border-gray-300 dark:bg-gray-800 dark:border-gray-700"
                    }`}
                  >
                    <input
                      type="radio"
                      id="zalopay"
                      name="selectedPaymentMethod"
                      value="zalopay"
                      className="h-4 w-4"
                      onChange={handlePaymentMethodChange}
                      checked={selectedPaymentMethod === "zalopay"}
                    />
                    <span className="font-medium text-gray-900 dark:text-white">
                      Thanh toán ZaloPay
                    </span>
                    <img
                      src="./logo-zalopay-payment.png"
                      alt="ZaloPay Logo"
                      className="w-16"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Thông tin thanh toán - giữ lại chỉ một lần */}
            <div className="mt-8 space-y-4 border-t pt-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Thông tin thanh toán:
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Tổng tiền:
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatMoney(selectedOrder.totalProductPrice)}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Phí vận chuyển:
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatMoney(selectedOrder.shipFee)}
                  </p>
                </div>
                {selectedOrder.voucherDiscount > 0 && (
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Giảm giá voucher:
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      -{formatMoney(selectedOrder.voucherDiscount)}
                    </p>
                  </div>
                )}
                <div className="flex justify-between items-center border-t pt-4">
                  <p className="text-lg font-bold">Tổng thanh toán:</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatMoney(selectedOrder.totalMoney)}
                  </p>
                </div>
              </div>

              {/* Nút thanh toán */}
              {selectedPaymentMethod &&
                selectedOrder.status === "Chờ thanh toán" && (
                  <button
                    onClick={handlePayment}
                    className="btn btn-primary w-full py-2 rounded-lg mt-6"
                  >
                    Thanh toán ngay
                  </button>
                )}
            </div>
          </div>
        </div>
      )}

      <ConfirmCancelModal
        isOpen={confirmCancelModalIsOpen}
        onClose={closeConfirmCancelModal}
        onConfirm={confirmCancelOrder}
      />
    </div>
  );
}

export default PurchaseHistory;
