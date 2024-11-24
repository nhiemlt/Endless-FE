import { useState, useEffect } from "react";
import OrderService from "../../services/OrderService";
import EyeIcon from '@heroicons/react/24/solid/EyeIcon';
import TruckIcon from '@heroicons/react/24/solid/TruckIcon';
import CheckIcon from '@heroicons/react/24/solid/CheckIcon';
import SearchBar from "../../components/Input/SearchBar";
import TitleCard from "../../components/Cards/TitleCard";

function Transactions() {
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(8);
    const [searchText, setSearchText] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // Quản lý modal xác nhận
    const [confirmMessage, setConfirmMessage] = useState("");
    const [confirmAction, setConfirmAction] = useState(null); // Lưu hành động khi người dùng xác nhận
    const [orderStatus, setOrderStatus] = useState('Tất cả');
    const [allOrders, setAllOrders] = useState([]);
    const [orders, setOrders] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    // Lấy dữ liệu từ API
    const fetchOrders = async () => {
        try {
            const response = await OrderService.getAllOrders(
                searchText,
                startDate ? new Date(startDate).toISOString() : null,
                endDate ? new Date(endDate).toISOString() : null,
                currentPage - 1,
                ordersPerPage
            );
            setAllOrders(response.data.content);
            setTotalPages(response.data.totalPages);

            // Thiết lập ngày bắt đầu và ngày kết thúc mặc định
            if (response.data.content.length > 0) {
                const orderDates = response.data.content.map(order => new Date(order.orderDate));
                const minDate = new Date(Math.min(...orderDates));
                minDate.setDate(minDate.getDate() - 1); // Cộng 1 ngày vào minDate

                const maxDate = new Date(Math.max(...orderDates));
                maxDate.setDate(maxDate.getDate() + 1); // Cộng 1 ngày vào maxDate
                maxDate.setHours(23, 59, 59, 999);     // Đặt thời gian maxDate thành 23:59:59.999

                // Đặt giá trị ngày bắt đầu và ngày kết thúc
                setStartDate(minDate.toISOString().slice(0, 10));  // Định dạng YYYY-MM-DD
                setEndDate(maxDate.toISOString().slice(0, 10));
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    // Lọc và phân trang dữ liệu
    useEffect(() => {
        const filteredOrders = allOrders.filter(order => {
            const orderDate = new Date(order.orderDate);
            const isInRange =
                (!startDate || orderDate >= new Date(startDate)) &&
                (!endDate || (new Date(endDate).setHours(23, 59, 59, 999), orderDate <= new Date(endDate)));


            const matchesSearch = order.customer.fullname.toLowerCase().includes(searchText.toLowerCase()) ||
                order.orderID.toString().includes(searchText);

            return (orderStatus === 'Tất cả' || order.status === orderStatus) && isInRange && matchesSearch;
        });

        const paginatedOrders = filteredOrders.slice(
            (currentPage - 1) * ordersPerPage,
            currentPage * ordersPerPage
        );

        setOrders(paginatedOrders);
    }, [allOrders, currentPage, orderStatus, startDate, endDate, searchText]);

    // Gọi API khi cần
    useEffect(() => {
        fetchOrders();
    }, [currentPage, searchText]);

    // Hàm xử lý tìm kiếm
    const applySearch = (value) => {
        setSearchText(value);
        setCurrentPage(1);
    };

    // Hàm xử lý xem chi tiết đơn hàng
    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    // Hàm xử lý phân trang
    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleStatusChange = (status) => {
        setOrderStatus(status);
        setCurrentPage(1);
    };

    const sortOrders = (option) => {
        let sortedOrders = [...orders];
        switch (option) {
            case 'Số tiền - Tăng dần':
                sortedOrders.sort((a, b) => a.totalMoney - b.totalMoney);
                break;
            case 'Số tiền - Giảm dần':
                sortedOrders.sort((a, b) => b.totalMoney - a.totalMoney);
                break;
            case 'Ngày - Tăng dần':
                sortedOrders.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
                break;
            case 'Ngày - Giảm dần':
                sortedOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
                break;
            default:
                break;
        }
        setOrders(sortedOrders);
    };

    const openConfirmModal = (message, action) => {
        setConfirmMessage(message);
        setConfirmAction(() => action);
        setIsConfirmModalOpen(true);
    };


    // Hàm xử lý xác nhận đơn hàng
    const handleConfirmOrder = (order) => {
        openConfirmModal("Bạn có chắc muốn xác nhận đơn hàng này?", async () => {
            try {
                await OrderService.markOrderAsConfirmed(order.orderID);
                fetchOrders(); // Cập nhật lại danh sách đơn hàng sau khi xác nhận
            } catch (error) {
                console.error("Error confirming order:", error);
            }
        });
    };

    const handleMarkOrderAsShipping = (order) => {
        openConfirmModal("Bạn có chắc muốn đánh dấu đơn hàng này là đang vận chuyển?", async () => {
            try {
                await OrderService.markOrderAsShipping(order.orderID);
                fetchOrders(); // Cập nhật lại danh sách đơn hàng sau khi xác nhận
            } catch (error) {
                console.error("Error marking order as shipping:", error);
            }
        });
    };
    return (
        <>
            <TitleCard
                topMargin="mt-1"
                TopSideButtons={
                    <div className="flex flex-col md:flex-row justify-between items-center w-full">
                        {/* Thanh tìm kiếm bên trái */}
                        <div className="flex justify-start items-center space-x-2 mb-2 mr-2 md:mb-0">
                            <SearchBar searchText={searchText} styleClass="w-full md:w-50" setSearchText={applySearch} />
                        </div>
                        {/* Các thành phần bên phải */}
                        <div className="flex items-center justify-end space-x-4 flex-nowrap">
                            {/* Tiêu đề cho input ngày bắt đầu */}
                            <div className="flex items-center space-x-2">
                                <label htmlFor="startDate" className="text-sm font-medium">Thời gian:</label>
                                <input
                                    id="startDate"
                                    type="date"
                                    value={startDate || ""}
                                    onChange={(e) => {
                                        setStartDate(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="input input-bordered w-full md:w-40 h-8"
                                />
                            </div>
                            <label htmlFor="endDate" className="text-sm font-medium">-</label>
                            {/* Tiêu đề cho input ngày kết thúc */}
                            <div className="flex items-center">
                                <input
                                    id="endDate"
                                    type="date"
                                    value={endDate || ""}
                                    onChange={(e) => {
                                        setEndDate(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="input input-bordered w-full md:w-40 h-8 ms-12 md:ms-0"
                                />
                            </div>

                            {/* Tiêu đề cho select trạng thái */}
                            <div className="flex items-center space-x-2">
                                <label className="text-sm font-medium">Trạng thái:</label>
                                <select
                                    value={orderStatus}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                    className="select select-sm select-bordered w-full md:w-40"
                                >
                                    {['Tất cả', 'Chờ xác nhận', 'Đã thanh toán', 'Đang giao hàng', 'Đã giao hàng', 'Đã hủy'].map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Tiêu đề cho dropdown sắp xếp */}
                            <div className="flex items-center space-x-2">
                                <label className="text-sm font-medium">Sắp xếp:</label>
                                <select
                                    className="select select-sm select-bordered w-full md:w-40"
                                    onChange={(e) => sortOrders(e.target.value)}
                                >
                                    <option value="">Sắp xếp</option>
                                    <option value="Số tiền - Tăng dần">Số tiền - Tăng dần</option>
                                    <option value="Số tiền - Giảm dần">Số tiền - Giảm dần</option>
                                    <option value="Ngày - Tăng dần">Ngày - Tăng dần</option>
                                    <option value="Ngày - Giảm dần">Ngày - Giảm dần</option>
                                </select>
                            </div>
                        </div>
                    </div>
                }
            >

                <div className="overflow-x-auto w-full">
                    <table className="table w-full text-center table-xs">
                        <thead>
                            <tr>
                                <th>Mã đơn hàng</th>
                                <th className="hidden md:table-cell">Khách hàng</th>
                                <th className="hidden md:table-cell">Ngày đặt hàng</th>
                                <th className="hidden md:table-cell">Voucher</th>
                                <th>Tổng tiền</th>
                                <th className="hidden md:table-cell">Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.orderID}>
                                    <td className="p-2">{order.orderID}</td>
                                    <td className="p-2 flex items-center">
                                        <img src={order.customer.avatar} className="w-7 h-7 rounded-full ring ring-offset-2 mr-2" alt="Customer Avatar" />
                                        <span>{order.customer.fullname}</span>
                                    </td>
                                    <td className="hidden md:table-cell p-2">{new Date(order.orderDate).toLocaleDateString()}</td>
                                    <td className="hidden md:table-cell p-2">{order?.voucher?.voucherCode || "Không có"}</td>
                                    <td className="p-2">{order.totalMoney.toLocaleString()} VND</td>
                                    <td className="hidden md:table-cell p-2">
                                        <span
                                            className={`badge badge-md ${order.status === "Chờ xác nhận"
                                                ? "bg-yellow-500"
                                                : order.status === "Đã thanh toán"
                                                    ? "bg-pink-500"
                                                    : order.status === "Đã xác nhận"
                                                        ? "bg-green-500"
                                                        : order.status === "Đang giao hàng"
                                                            ? "bg-blue-700"
                                                            : order.status === "Đã giao hàng"
                                                                ? "bg-lime-800"
                                                                : order.status === "Đã hủy"
                                                                    ? "bg-red-800"
                                                                    : "bg-gray-400"
                                                } pt-2 pb-3 text-white badge-outline`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-2 text-center">
                                        <div className="flex items-center space-x-1">
                                            <EyeIcon className="w-5 cursor-pointer text-yellow-600" onClick={() => handleViewDetails(order)} />
                                            {order.status === 'Chờ xác nhận' && (
                                                <>
                                                    <CheckIcon className="w-5 cursor-pointer text-green-700" onClick={() => handleConfirmOrder(order)}>Xác nhận</CheckIcon>
                                                </>
                                            )}
                                            {order.status === 'Đã xác nhận' && (
                                                <TruckIcon className="w-5 cursor-pointer text-blue-800" onClick={() => handleMarkOrderAsShipping(order)}>Vận chuyển</TruckIcon>
                                            )}
                                            {order.status === 'Đã thanh toán' && (
                                                <TruckIcon className="w-5 cursor-pointer text-blue-800" onClick={() => handleMarkOrderAsShipping(order)}>Vận chuyển</TruckIcon>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


                {/* Phân trang */}
                <div className="join mt-4 flex justify-center w-full">
                    <button onClick={handlePrevPage} className="join-item btn" disabled={currentPage === 1}>
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button key={index} onClick={() => setCurrentPage(index + 1)} className={`join-item btn ${currentPage === index + 1 ? "btn-active" : ""}`}>
                            {index + 1}
                        </button>
                    ))}
                    <button onClick={handleNextPage} className="join-item btn" disabled={currentPage === totalPages}>
                        Next
                    </button>
                </div>
            </TitleCard>

            {/* Modal hiển thị chi tiết đơn hàng */}
            {isModalOpen && selectedOrder && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-4xl bg-white dark:bg-gray-800">
                        <h2 className="text-lg font-bold mb-4 bg-gray-200 dark:bg-gray-700 p-2 rounded">Chi tiết đơn hàng</h2>
                        <p className="mb-2 text-gray-800 dark:text-gray-200"><strong>Mã đơn hàng:</strong> {selectedOrder.orderID}</p>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="p-4 bg-white shadow rounded dark:bg-gray-700">
                                <p className="text-gray-800 dark:text-gray-200"><strong>Khách hàng:</strong> {selectedOrder.customer.fullname}</p>
                                <p className="text-gray-800 dark:text-gray-200"><strong>Số điện thoại:</strong> {selectedOrder.orderPhone || 'Chưa cập nhật'}</p>
                            </div>
                            <div className="p-4 bg-white shadow rounded dark:bg-gray-700">
                                <p className="text-gray-800 dark:text-gray-200"><strong>Phí sản phẩm:</strong> {selectedOrder?.totalProductPrice.toLocaleString() || 'Không sử dụng'} VND</p>
                                <p className="text-gray-800 dark:text-gray-200"><strong>Phí giao hàng:</strong> {selectedOrder?.shipFee?.toLocaleString()} VND</p>
                            </div>
                            <div className="p-4 bg-white shadow rounded dark:bg-gray-700">
                                <p className="text-gray-800 dark:text-gray-200"><strong>Mã giảm giá:</strong> {selectedOrder?.voucher || 'Không sử dụng'}</p>
                                <p className="text-gray-800 dark:text-gray-200"><strong>Số tiền giảm:</strong> {selectedOrder?.voucherDiscount?.toLocaleString()} VND</p>
                            </div>
                            <div className="p-4 bg-white shadow rounded dark:bg-gray-700">
                                <p className="text-gray-800 dark:text-gray-200"><strong>Tổng số tiền:</strong> {selectedOrder?.money.toLocaleString()} VND</p>
                                <p className="text-gray-800 dark:text-gray-200"><strong>Thành tiền:</strong> {selectedOrder?.totalMoney.toLocaleString()} VND</p>
                            </div>
                        </div>
                        <p className="mb-2 text-gray-800 dark:text-gray-200"><strong>Địa chỉ giao hàng:</strong> {selectedOrder.orderAddress || 'Chưa cập nhật'}</p>
                        <table className="table-auto w-full mt-4">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-700">
                                    <th className="p-2 text-gray-800 dark:text-gray-200">Sản phẩm</th>
                                    <th className="p-2 text-gray-800 dark:text-gray-200">Phiên bản</th>
                                    <th className="p-2 text-gray-800 dark:text-gray-200">Số lượng</th>
                                    <th className="p-2 text-gray-800 dark:text-gray-200">Giá gốc</th>
                                    <th className="p-2 text-gray-800 dark:text-gray-200">Giá khuyến mãi</th>
                                    <th className="p-2 text-gray-800 dark:text-gray-200">Tổng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedOrder?.orderDetails?.map(detail => (
                                    <tr key={detail?.orderDetailID} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="text-center p-2 text-gray-800 dark:text-gray-200">{detail?.productName}</td>
                                        <td className="text-center p-2 text-gray-800 dark:text-gray-200">{detail?.productVersionName}</td>
                                        <td className="text-center p-2 text-gray-800 dark:text-gray-200">{detail?.quantity}</td>
                                        <td className="text-center p-2 text-gray-800 dark:text-gray-200">{detail?.price.toLocaleString()} VND</td>
                                        <td className="text-center p-2 text-gray-800 dark:text-gray-200">{detail?.discountPrice.toLocaleString()} VND</td>
                                        <td className="text-center p-2 text-gray-800 dark:text-gray-200">
                                            {(
                                                detail?.discountPrice > 0
                                                    ? detail?.discountPrice * detail.quantity
                                                    : detail?.price * detail.quantity
                                            ).toLocaleString()} VND
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="modal-action mt-4">
                            <button className="btn btn-primary" onClick={() => setIsModalOpen(false)}>
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal xác nhận */}
            {isConfirmModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h2 className="font-bold text-lg">Xác nhận</h2>
                        <p>{confirmMessage}</p>
                        <div className="modal-action">
                            <button className="btn btn-error" onClick={() => setIsConfirmModalOpen(false)}>Hủy bỏ</button>
                            <button className="btn btn-success" onClick={() => {
                                confirmAction();
                                setIsConfirmModalOpen(false);
                            }}>
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Transactions;