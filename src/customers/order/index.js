import React, { useState, useEffect } from "react";
import {
  CheckCircleIcon,
  TruckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ClipboardDocumentCheckIcon,
  ShieldCheckIcon,
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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchedOrders = await OrderService.getAllOrderByUserLogin(
          null,
          searchText,
          null,
          currentPage,
          size
        );

        // Set both orders and filtered orders
        setOrders(fetchedOrders.data.content);
        setTotalPages(fetchedOrders.data.totalPages);
        setFilteredOrders(fetchedOrders.data.content);
      } catch (error) {
        console.error("Lỗi khi lấy lịch sử mua hàng:", error);
      }
    };

    fetchOrders();
  }, [searchText, currentPage, size]);

  useEffect(() => {
    if (activeTab === "Tất cả") {
      setFilteredOrders(
        orders.filter(
          (order) =>
            order.orderID.toLowerCase().includes(searchText.toLowerCase()) ||
            order.orderDetails.some((item) =>
              item.productName.toLowerCase().includes(searchText.toLowerCase())
            )
        )
      );
    } else {
      setFilteredOrders(
        orders
          .filter((order) => order.status === activeTab)
          .filter(
            (order) =>
              order.orderID.toLowerCase().includes(searchText.toLowerCase()) ||
              order.orderDetails.some((item) =>
                item.productName
                  .toLowerCase()
                  .includes(searchText.toLowerCase())
              )
          )
      );
    }
  }, [activeTab, orders, searchText]);

  const openModal = (order) => {
    setSelectedOrder(order);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedOrder(null);
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
      await OrderService.cancelOrder(orderToCancel.orderID);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderID === orderToCancel.orderID
            ? { ...order, status: "Đã hủy" }
            : order
        )
      );

      dispatch(
        showNotification({
          message: "Đơn hàng đã được hủy thành công!",
          status: 1,
        })
      );
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);

      dispatch(
        showNotification({
          message: "Lỗi khi hủy đơn hàng. Vui lòng thử lại.",
          status: 0,
        })
      );
    } finally {
      closeConfirmCancelModal();
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxPages = totalPages - 1;

    if (totalPages <= 5) {
      for (let i = 0; i <= maxPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(0, 1);

      if (currentPage > 3) pages.push("...");

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(maxPages - 2, currentPage + 1);

      for (let page = startPage; page <= endPage; page++) {
        pages.push(page);
      }

      if (currentPage < maxPages - 3) pages.push("...");

      pages.push(maxPages - 1, maxPages);
    }

    return (
      <div className="join mt-4 flex justify-center w-full">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className="join-item btn"
          disabled={currentPage === 0}
        >
          Trước
        </button>

        {pages.map((page, index) =>
          page === "..." ? (
            <span key={index} className="join-item btn disabled">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`join-item btn ${
                currentPage === page ? "btn-primary" : ""
              }`}
            >
              {page + 1}
            </button>
          )
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className="join-item btn"
          disabled={currentPage === maxPages}
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
      const updatedOrder = await OrderService.markOrderAsDelivered(orderId);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderID === orderId
            ? { ...order, status: "Đã giao hàng" }
            : order
        )
      );

      dispatch(
        showNotification({
          message: "Đơn hàng đã được nhận!",
          status: 1,
        })
      );
    } catch (error) {
      console.error("Failed to mark order as delivered:", error);

      dispatch(
        showNotification({
          message: "Lỗi khi cập nhật trạng thái đơn hàng.",
          status: 0,
        })
      );
    }
  };

  return (
    <div className="bg-base-200 min-h-screen py-12 px-8">
      <h1 className="text-4xl font-bold text-center mb-8">Lịch Sử Mua Hàng</h1>

      {/* Tabs Section */}
      <div className="tabs tabs-lifted">
        {orderStatuses.map((status) => (
          <a
            key={status}
            className={`tab tab-lifted ${
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
                      ? "bg-yellow-300 text-yellow-800"
                      : order.status === "Đã giao hàng"
                      ? "bg-green-300 text-green-800"
                      : order.status === "Đã hủy"
                      ? "bg-red-300 text-red-800"
                      : "bg-gray-300 text-gray-800"
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

                  <div className="flex justify-between items-center">
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

              <div className="flex justify-between items-center mt-4">
                {(order.status === "Chờ xác nhận" ||
                  order.status === "Chờ thanh toán") && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openConfirmCancelModal(order);
                    }}
                    className="btn btn-error w-auto text-sm"
                  >
                    Hủy Đơn Hàng
                  </button>
                )}
                {/* {order.status === "Chờ thanh toán" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePayment(order.orderID);
                    }}
                    className="btn btn-primary w-auto text-sm"
                  >
                    Thanh toán
                  </button>
                )} */}
                {order.status === "Đang giao hàng" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsDelivered(order.orderID);
                    }}
                    className="btn btn-success w-auto text-sm"
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-11/12 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/2">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">
              Thông Tin Hóa Đơn
            </h2>

            {/* Order ID display */}
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
                      {item.discountPrice ? (
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
                </li>
              ))}
            </ul>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Địa chỉ giao hàng:</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {selectedOrder.orderAddress}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {selectedOrder.orderPhone}
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <h3 className="text-xl font-semibold">Thông tin thanh toán:</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-lg font-semibold">Tổng tiền:</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatMoney(selectedOrder.totalProductPrice)}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-lg font-semibold">Phí vận chuyển:</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatMoney(selectedOrder.shipFee)}
                  </p>
                </div>
                {selectedOrder.voucherDiscount > 0 && (
                  <div className="flex justify-between">
                    <p className="text-lg font-semibold">Giảm giá voucher:</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      -{formatMoney(selectedOrder.voucherDiscount)}
                    </p>
                  </div>
                )}
                <div className="flex justify-between border-t pt-4">
                  <p className="text-lg font-semibold">Tổng thanh toán:</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatMoney(selectedOrder.totalMoney)}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={closeModal}
              className="btn w-full bg-gray-800 text-white hover:bg-gray-700 py-2 rounded-lg dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500 mt-4"
            >
              Đóng
            </button>
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
