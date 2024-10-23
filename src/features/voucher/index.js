import React, { useEffect, useState } from "react";
import moment from "moment";
import { useDispatch } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { openModal } from "../common/modalSlice";
import VoucherService from '../../services/voucherService';
import { MODAL_BODY_TYPES } from '../../utils/globalConstantUtil';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import { showNotification } from "../common/headerSlice";

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

const Vouchers = () => {
    const [vouchers, setVouchers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const loadVouchers = async () => {
            setIsLoading(true);
            try {
                const response = await VoucherService.fetchVouchers({
                    page: 0,
                    size: 10,
                    sortBy: 'voucherID',
                    sortDir: 'asc'
                });
                const fetchedVouchers = response.content;

                if (Array.isArray(fetchedVouchers)) {
                    const formattedVouchers = fetchedVouchers.map(voucher => ({
                        ...voucher,
                        startDate: moment(voucher.startDate).format('YYYY-MM-DD'),
                        endDate: moment(voucher.endDate).format('YYYY-MM-DD'),
                    }));

                    setVouchers(formattedVouchers);
                } else {
                    console.error("Dữ liệu không hợp lệ:", fetchedVouchers);
                    setError("Không thể tải voucher, dữ liệu không hợp lệ.");
                }
            } catch (err) {
                console.error("Không thể tải voucher:", err);
                setError("Không thể tải voucher.");
            } finally {
                setIsLoading(false);
            }
        };

        loadVouchers();
    }, [dispatch]);

    const handleFetchVoucherById = async (voucher) => {
        try {
            console.log(voucher)
            if (!voucher) {
                throw new Error("Dữ liệu voucher không tồn tại");
            }
            // Mở modal và truyền dữ liệu voucher
            dispatch(openModal({
                title: "Chỉnh sửa Voucher",

                bodyType: MODAL_BODY_TYPES.VOUCHER_ADD_NEW,

                voucherData: { voucher, isUpdate: true }
            }));
        } catch (error) {
            console.error("Error fetching voucher by ID:", error);
            dispatch(showNotification({
                message: "Không thể lấy thông tin voucher.",
                status: 0,
            }));
        }
    };    
    

    if (isLoading) return <div className="loading-spinner">Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const handleDeleteVoucher = async (voucherID) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa voucher này không?")) {
            try {
                await VoucherService.deleteVoucher(voucherID);
                setVouchers(vouchers.filter(voucher => voucher.voucherID !== voucherID));
                dispatch(showNotification({
                    message: "Xóa voucher thành công!",
                    status: 1,
                }));
            } catch (error) {
                console.error("Error deleting voucher:", error);
                dispatch(showNotification({
                    message: "Xóa voucher thất bại!",
                    status: 0,
                }));
            }
        }
    };

    return (
        <>
            <TitleCard title="Voucher" topMargin="mt-2" TopSideButtons={<TopSideButtons />} >
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
                                    <td>{voucher.startDate}</td>
                                    <td>{voucher.endDate}</td>
                                    <td>
                                        <button 
                                            className="btn btn-sm btn-info mr-2" 
                                            onClick={() => handleFetchVoucherById(voucher)}
                                        >
                                            <PencilIcon className="h-5 w-5" />
                                        </button>
                                        <button onClick={() => handleDeleteVoucher(voucher.voucherID)} className="btn btn-sm btn-danger">
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </TitleCard>
        </>
    );
};

export default Vouchers;
