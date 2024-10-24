import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../common/modalSlice"; // Đảm bảo rằng bạn có action này để đóng modal
import { updateVoucher, fetchVoucherById } from "../../../services/voucherSlice"; // Phương thức fetchVoucherById cần được thêm vào voucherSlice

const UpdateVoucherModalBody = ({ voucherID }) => {
    const dispatch = useDispatch();
    const [voucherData, setVoucherData] = useState({}); // Trạng thái để lưu thông tin voucher
    const { voucher } = useSelector((state) => state.voucher); // Lấy thông tin voucher từ store

    useEffect(() => {
        if (voucherID) {
            dispatch(fetchVoucherById(voucherID)); // Fetch thông tin voucher khi modal mở
        }
    }, [dispatch, voucherID]);

    useEffect(() => {
        if (voucher) {
            setVoucherData(voucher); // Cập nhật trạng thái với dữ liệu voucher
        }
    }, [voucher]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVoucherData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const { isLoading } = useSelector((state) => state.voucher);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateVoucher(voucherData)); // Gọi phương thức updateVoucher để cập nhật voucher
        dispatch(closeModal()); // Đóng modal
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="flex">
                    <div className="w-1/2 pr-2">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Mã Voucher</label>
                            <input
                                type="text"
                                name="voucherCode"
                                value={voucherData.voucherCode}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Giá giảm tối thiểu</label>
                            <input
                                type="number"
                                name="leastDiscount"
                                value={voucherData.leastDiscount}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Hóa đơn tối thiểu</label>
                            <input
                                type="number"
                                name="leastBill"
                                value={voucherData.leastBill}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Ngày bắt đầu</label>
                            <input
                                type="date"
                                name="startDate"
                                value={voucherData.startDate}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                            />
                        </div>
                    </div>
                    <div className="w-1/2 pl-2">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Mức giảm giá</label>
                            <input
                                type="number"
                                name="discountLevel"
                                value={voucherData.discountLevel}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Giá giảm tối đa</label>
                            <input
                                type="number"
                                name="biggestDiscount"
                                value={voucherData.biggestDiscount}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Hình thức giảm giá</label>
                            <input
                                type="text"
                                name="discountForm"
                                value={voucherData.discountForm}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Ngày kết</label>
                            <input
                                type="date"
                                name="endDate"
                                value={voucherData.endDate}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Đang cập nhât....' : 'Cập nhật'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateVoucherModalBody;
