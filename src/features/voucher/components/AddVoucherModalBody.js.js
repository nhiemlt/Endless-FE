import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addVoucher } from "../voucherSlice";
import { closeModal } from "../../common/modalSlice";
import { showNotification } from "../../common/headerSlice";

// Component thân modal để thêm voucher mới
const AddVoucherModalBody = () => {
    const dispatch = useDispatch();
    const [voucherData, setVoucherData] = useState({
        voucherCode: '',
        leastDiscount: '',
        discountLevel: '',
        startDate: '',
        leastBill: '',
        biggestDiscount: '',
        discountForm: '',
        endDate: '',
    });

    const { isLoading } = useSelector((state) => state.voucher);

    // Cập nhật dữ liệu từ input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setVoucherData({
            ...voucherData,
            [name]: value,
        });
    };

    // Xử lý thêm voucher mới
    const handleAddVoucher = () => {
        dispatch(addVoucher(voucherData))
            .then(() => {
                dispatch(showNotification({
                    message: "Voucher added successfully!",
                    status: 1
                }));
                dispatch(closeModal());
                window.location.reload();
            })
            .catch(() => {
                dispatch(showNotification({
                    message: "Failed to add voucher.",
                    status: 0
                }));
            });
    };

    return (
        <div>
            <div className="flex">
                <div className="w-1/2 pr-2">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Mã Voucher</label>
                        <input
                            type="text"
                            name="voucherCode"
                            value={voucherData.voucherCode}
                            onChange={handleInputChange}
                            className="input input-bordered w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Giá giảm tối thiểu</label>
                        <input
                            type="number"
                            name="leastDiscount"
                            value={voucherData.leastDiscount}
                            onChange={handleInputChange}
                            className="input input-bordered w-full"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Hóa đơn tối thiểu</label>
                        <input
                            type="number"
                            name="leastBill"
                            value={voucherData.leastBill}
                            onChange={handleInputChange}
                            className="input input-bordered w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Ngày bắt đầu</label>
                        <input
                            type="date"
                            name="startDate"
                            value={voucherData.startDate}
                            onChange={handleInputChange}
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
                            onChange={handleInputChange}
                            className="input input-bordered w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Giá giảm tối đa</label>
                        <input
                            type="number"
                            name="biggestDiscount"
                            value={voucherData.biggestDiscount}
                            onChange={handleInputChange}
                            className="input input-bordered w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Hình thức giảm giá</label>
                        <input
                            type="text"
                            name="discountForm"
                            value={voucherData.discountForm}
                            onChange={handleInputChange}
                            className="input input-bordered w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Ngày kết</label>
                        <input
                            type="date"
                            name="endDate"
                            value={voucherData.endDate}
                            onChange={handleInputChange}
                            className="input input-bordered w-full"
                        />
                    </div>
                </div>
            </div>
            <div className="flex justify-end">
                <button
                    className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                    onClick={handleAddVoucher}
                    disabled={isLoading}
                >
                    {isLoading ? 'Đang thêm....' : 'Thêm'}
                </button>
            </div>
        </div>
    );
};

export default AddVoucherModalBody;
