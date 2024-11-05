import React, { useState, useEffect } from 'react';
import OrderService from '../../services/OrderService';

function PurchaseHistory({ loggedInUserId }) {
  const [orders, setOrders] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const page = 1;
        const size = 10;
        const searchText = loggedInUserId;
        
        const fetchedOrders = await OrderService.getAllOrders(searchText, null, null, page, size);
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Lỗi khi lấy lịch sử mua hàng:", error);
      }
    };

    fetchOrders();
  }, [loggedInUserId]);

  const openModal = (order) => {
    setSelectedOrder(order);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="bg-base-200 min-h-screen py-12 px-8">
      <h1 className="text-4xl font-bold text-center mb-8">Lịch Sử Mua Hàng</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {orders.map((order) => (
          <div
            key={order.id}
            className="card bg-gray-100 shadow-xl p-4 rounded-lg cursor-pointer hover:shadow-2xl"
            onClick={() => openModal(order)}
          >
            <h2 className="text-xl font-semibold">Hóa Đơn #{order.id}</h2>
            <p className="text-gray-600">Trạng thái: {order.status}</p>
            <p className="text-gray-500">Sản phẩm: {order.items.join(", ")}</p>
          </div>
        ))}
      </div>

      {/* Modal hiển thị thông tin hóa đơn */}
      {modalIsOpen && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/2">
            <h2 className="text-2xl font-bold mb-4">Thông Tin Hóa Đơn #{selectedOrder.id}</h2>
            <h3 className="text-xl">Sản phẩm:</h3>
            <ul>
              {selectedOrder.items.map((item, index) => (
                <li key={index} className="text-gray-600">{item}</li>
              ))}
            </ul>
            <h3 className="text-xl mt-4">Trạng thái:</h3>
            <p className="text-gray-600">{selectedOrder.status}</p>
            <h3 className="text-xl mt-4">Các Giai Đoạn:</h3>
            <div className="steps">
              {selectedOrder.steps.map((step, index) => (
                <div key={index} className={`step ${index === selectedOrder.steps.length - 1 ? 'step-primary' : ''}`}>
                  <div className="step-title">{step}</div>
                  <div className="step-content">Thông tin về {step.toLowerCase()}</div>
                </div>
              ))}
            </div>
            <button onClick={closeModal} className="btn mt-4">Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PurchaseHistory;
