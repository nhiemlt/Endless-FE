import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";
import TitleCard from "../../components/Cards/TitleCard";
import { showNotification } from "../common/headerSlice";
import VoucherService from "../../services/voucherService";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import AddVoucherModal from "./components/CreateVoucherModal";
import EditVoucherModal from "./components/UpdateVoucherModal";

function Vouchers() {
    const dispatch = useDispatch();

    const [vouchers, setVouchers] = useState([]);
    const [loading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [searchVoucherCode, setSearchVoucherCode] = useState("");

    const loadVouchers = async () => {
        setIsLoading(true);
        try {
            const response = await VoucherService.fetchVouchers({
                page: currentPage,
                size: size,
                sortBy: "voucherID",
                sortDir: "asc",
                voucherCode: searchVoucherCode,
            });

            const fetchedVouchers = response.content;
            setTotalPages(response.totalPages);

            if (Array.isArray(fetchedVouchers)) {
                const formattedVouchers = fetchedVouchers.map((voucher) => ({
                    ...voucher,
                    startDate: moment(voucher.startDate).format("DD-MM-YYYY"),
                    endDate: moment(voucher.endDate).format("DD-MM-YYYY"),

                }));
                setVouchers(formattedVouchers);
            } else {
                dispatch(showNotification({ message: "Không thể tải voucher.", status: 0 }));
            }
        } catch (err) {
            dispatch(showNotification({ message: "Không thể tải voucher", status: 0 }));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadVouchers();
    }, [currentPage, size, searchVoucherCode]);

    const handleAdd = () => setIsAdding(true);
    const handleEdit = (voucher) => {
        setEditingVoucher(voucher);
        setIsEditing(true);
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const closeAddModal = () => setIsAdding(false);
    const closeEditModal = () => setIsEditing(false);

    return (
        <>
            <TitleCard title="Voucher" topMargin="mt-2">
                {/* Các thành phần trong giao diện */}
                <div className="flex flex-col md:flex-row justify-between items-center w-full mb-4">
                    {/* Thanh tìm kiếm voucherCode */}
                    <div className="flex justify-start items-center space-x-2 mb-2 mr-2 md:mb-0">
                        <input
                            type="text"
                            placeholder="Tìm kiếm mã voucher..."
                            value={searchVoucherCode}
                            onChange={(e) => {
                                setSearchVoucherCode(e.target.value);
                                setCurrentPage(0); // Đặt lại currentPage về 0 khi tìm kiếm
                            }}
                            className="input input-bordered w-full md:w-50 h-8"
                            onClick={loadVouchers}
                        />
                    </div>
                    <button className="btn btn-outline btn-sm btn-primary" onClick={handleAdd}>Thêm voucher</button>
                </div>
                {/* Bảng danh sách voucher */}
                <div className="overflow-x-auto">
                    <table className="table table-xs w-full">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã Voucher</th>
                                <th>Giảm giá</th>
                                <th>Giá giảm tối thiểu</th>
                                <th>Giá giảm tối đa</th>
                                <th>Hóa đơn tối thiểu</th>
                                <th>Ngày bắt đầu</th>
                                <th>Ngày kết thúc</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={10} className="text-center">Đang tải...</td>
                                </tr>
                            ) : vouchers.length > 0 ? (
                                vouchers.map((voucher, index) => (
                                    <tr key={voucher.voucherID}>
                                        <td>{currentPage * size + index + 1}</td>
                                        <td>{voucher.voucherCode}</td>
                                        <td>{voucher.discountLevel} %</td>
                                        <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(voucher.leastDiscount)}</td>
                                        <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(voucher.biggestDiscount)}</td>
                                        <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(voucher.leastBill)}</td>
                                        <td>{voucher.startDate}</td>
                                        <td>{voucher.endDate}</td>
                                        <td>
                                            <PencilIcon
                                                className="w-5 cursor-pointer text-green-600"
                                                onClick={() => handleEdit(voucher)}
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={10} className="text-center">Không có dữ liệu.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Điều hướng trang */}
                <div className="join mt-4 flex justify-center w-full">
                    <button onClick={handlePrevPage} className="join-item btn btn-sm btn-primary" disabled={currentPage === 0}>
                        Trước
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentPage(index)}
                            className={`join-item btn btn-sm btn-primary ${currentPage === index ? "btn-active" : ""}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button onClick={handleNextPage} className="join-item btn btn-sm btn-primary" disabled={currentPage >= totalPages - 1}>
                        Tiếp
                    </button>
                </div>
            </TitleCard>

            {/* Hiển thị modal thêm */}
            {isAdding && <AddVoucherModal onClose={closeAddModal} onReload={loadVouchers} />}

            {/* Hiển thị modal cập nhật */}
            {isEditing && (
                <EditVoucherModal
                    voucher={editingVoucher}
                    onClose={closeEditModal}
                    onReload={loadVouchers}
                />
            )}
        </>
    );
}

export default Vouchers;
