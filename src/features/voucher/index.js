import moment from "moment";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { openModal } from "../common/modalSlice";
import { addNewVoucher, deleteVoucher, getVouchersContent } from "./voucherSlice";
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../../utils/globalConstantUtil';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import { showNotification } from '../common/headerSlice';

const TopSideButtons = () => {
    const dispatch = useDispatch();

    const openAddNewVoucherModal = () => {
        dispatch(openModal({title : "Add New Voucher", bodyType : MODAL_BODY_TYPES.VOUCHER_ADD_NEW}))
    }

    return (
        <div className="inline-block float-right">
            <button className="btn px-6 btn-sm normal-case btn-primary" onClick={openAddNewVoucherModal}>
                Add New
            </button>
        </div>
    );
};

function Vouchers() {
    const { vouchers, isLoading, pagination } = useSelector((state) => state.voucher);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getVouchersContent());
    }, [dispatch]);

    const handleDeleteVoucher = (index) => {
        dispatch(deleteVoucher({ index }));
        dispatch(showNotification({ message: "Voucher deleted successfully", type: "error" }));
    };

    const handlePageChange = (page) => {
        dispatch(getVouchersContent(page)); // Gọi API lấy nội dung theo trang
    };

    return (
        <>
            <TitleCard title="Voucher" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>
                <div className="overflow-x-auto w-full">
                    <table className="table table-xs">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Mã Voucher</th>
                                <th>Giảm giá tối thiểu</th>
                                <th>Mức giảm giá</th>
                                <th>Ngày bắt đầu</th>
                                <th>Hóa đơn tối thiểu</th>
                                <th>Giảm giá tối đa</th>
                                <th>Hình thức giảm giá</th>
                                <th>Ngày kết thúc</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vouchers.map((voucher, index) => (
                                <tr key={voucher.voucherID}>
                                    <td>{voucher.voucherID}</td>
                                    <td>{voucher.voucherCode}</td>
                                    <td>{voucher.leastDiscount}</td>
                                    <td>{voucher.discountLevel}</td>
                                    <td>{voucher.startDate}</td>
                                    <td>{voucher.leastBill}</td>
                                    <td>{voucher.biggestDiscount}</td>
                                    <td>{voucher.discountForm}</td>
                                    <td>{voucher.endDate}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline btn-error border-0"
                                            onClick={() => handleDeleteVoucher(index)}
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                        <button className="btn btn-sm btn-outline btn-warning border-0">
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
                                        {/* Kiểm tra nếu pagination.pages tồn tại */}
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
