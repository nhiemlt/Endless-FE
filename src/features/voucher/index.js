import React, { useEffect } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { openModal } from "../common/modalSlice";
import { getVouchersContent, deleteVoucher } from "./voucherSlice";
import { MODAL_BODY_TYPES } from '../../utils/globalConstantUtil';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import { showNotification } from '../common/headerSlice.js';
import { fetchVoucherById } from './voucherSlice.js';
import UpdateVoucherModalBody from "./components/UpdateVoucherModalBody.js";

// Component để thêm nút "Add New" voucher
const TopSideButtons = () => {
    const dispatch = useDispatch();

    const openAddNewVoucherModal = () => {
        dispatch(openModal({
            title: "Thêm voucher mới",
            bodyType: MODAL_BODY_TYPES.VOUCHER_ADD_NEW
        }));
    };

    return (
        <div className="inline-block float-right">
            <button className="btn px-6 btn-sm normal-case btn-primary" onClick={openAddNewVoucherModal}>
                Thêm voucher
            </button>
        </div>
    );
};

// Component chính hiển thị danh sách vouchers
function Vouchers() {
    const { vouchers, isLoading, pagination, error } = useSelector((state) => state.voucher);
    const dispatch = useDispatch();

    // Tải danh sách vouchers khi component được render
    useEffect(() => {
        // Gọi getVouchersContent với các tham số mặc định
        dispatch(getVouchersContent({ page: 0, size: 10, sortBy: 'voucherID', sortDir: 'asc' }));
    }, [dispatch]);

    // Hàm xử lý khi xóa voucher
    const handleDeleteVoucher = (voucherID) => {
        dispatch(deleteVoucher(voucherID))
            .then(() => {
                dispatch(showNotification({
                    message: "Voucher deleted successfully!",
                    status: 1
                }));
            })
            .catch(() => {
                dispatch(showNotification({
                    message: "Failed to delete voucher.",
                    status: 0
                }));
            });
        window.location.reload();
    };

    const handleEditVoucher = async (voucherID) => {
        try {
            // Gọi API để lấy thông tin voucher theo ID
            const voucherData = await dispatch(fetchVoucherById(voucherID)).unwrap(); // Sử dụng unwrap để lấy dữ liệu

            // Khi đã có dữ liệu voucher, mở modal với dữ liệu voucher
            dispatch(openModal({
                title: "Cập nhật voucher",
                bodyType: MODAL_BODY_TYPES.UPDATE_VOUCHER,
                data: voucherData, // Truyền dữ liệu voucher vào modal
            }));
        } catch (error) {
            console.error("Failed to fetch voucher:", error);
        }
    };


    // Hàm xử lý khi thay đổi trang
    const handlePageChange = (page) => {
        dispatch(getVouchersContent({ page, size: 10, sortBy: 'voucherID', sortDir: 'asc' })); // Thay đổi nếu cần
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>
            <TitleCard title="Voucher" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>
                <div className="overflow-x-auto w-full">
                    <table className="table table-xs">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã Voucher</th>
                                <th>Mức giảm giá</th>
                                <th>Giảm giá tối thiểu</th>
                                <th>Giảm giá tối đa</th>
                                <th>Hóa đơn tối thiểu</th>
                                <th>Hình thức giảm giá</th>
                                <th>Ngày bắt đầu</th>
                                <th>Ngày kết thúc</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vouchers.map((voucher, index) => (
                                <tr key={voucher.voucherID}>
                                    <td>{index + 1}</td>
                                    <td>{voucher.voucherCode}</td>
                                    <td>{voucher.discountLevel}</td>
                                    <td>{voucher.leastDiscount}</td>
                                    <td>{voucher.biggestDiscount}</td>
                                    <td>{voucher.leastBill}</td>
                                    <td>{voucher.discountForm}</td>
                                    <td>{moment(voucher.startDate).format('YYYY-MM-DD')}</td>
                                    <td>{moment(voucher.endDate).format('YYYY-MM-DD')}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline btn-error border-0"
                                            onClick={() => handleDeleteVoucher(voucher.voucherID)}
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline btn-warning border-0"
                                            onClick={() => handleEditVoucher(voucher.voucherID)} // Gọi hàm chỉnh sửa
                                        >
                                            <PencilIcon className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="10" className="text-center">
                                    <div className="flex justify-center mt-4">
                                        {pagination?.pages?.length > 0 ? (
                                            pagination.pages.map((option, index) => (
                                                <input
                                                    key={index}
                                                    className={`join-item btn btn-xs btn-outline btn-circle me-1 ${option === pagination.currentPage ? 'checked:bg-accent' : ''}`}
                                                    type="radio"
                                                    name="options"
                                                    aria-label={`Page ${option}`}
                                                    defaultChecked={option === pagination.currentPage}
                                                    onClick={() => handlePageChange(option)}
                                                />
                                            ))
                                        ) : (
                                            <span>No pages available</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </TitleCard>
        </>
    );
}

export default Vouchers;
