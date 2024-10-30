import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from "../../common/headerSlice";
import VoucherService from "../../../services/voucherService";

const UpdateVoucherModal = ({ voucher, onClose, onReload }) => {
    const dispatch = useDispatch();

    const formatDate = (dateString) => {
        if (dateString) {
            const [day, month, year] = dateString.split("-"); // Tách chuỗi ngày
            const date = new Date(year, month, day); // Tạo đối tượng ngày, tháng bắt đầu từ 0
            return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0]; // Chuyển đổi sang định dạng ISO
        }
        return ""; // Nếu không có giá trị, trả về chuỗi rỗng
    };

    const today = new Date().toISOString().split("T")[0];

    const [formState, setFormState] = useState({
        voucherCode: voucher.voucherCode,
        discountLevel: voucher.discountLevel,
        leastDiscount: voucher.leastDiscount,
        biggestDiscount: voucher.biggestDiscount,
        leastBill: voucher.leastBill,
        startDate: formatDate(voucher.startDate), // Sử dụng formatDate ở đây
        endDate: formatDate(voucher.endDate),     // Sử dụng formatDate ở đây
    });

    console.log(formState)

    const handleChange = (e) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await VoucherService.updateVoucher(voucher.voucherID, formState);
            dispatch(showNotification({ message: "Cập nhật voucher thành công", status: 1 }));
            onClose();
            onReload();
        } catch (error) {
            dispatch(showNotification({ message: "Lỗi khi cập nhật voucher", status: 0 }));
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
            <dialog id="edit_voucher_modal" className="modal" role="dialog" open>
                <div className="modal-box w-11/12 max-w-5xl" >
                    <h3 className="font-bold text-lg">Cập nhật Voucher</h3>
                    <form className="mt-3" onSubmit={handleSubmit}>
                        {/* Mã Voucher */}
                        <div className="w-full md:w-1/2 pr-2 mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-3">Mã Voucher</label>
                            <input
                                type="text"
                                name="voucherCode"
                                value={formState.voucherCode}
                                onChange={handleChange}
                                className="input input-bordered w-full"
                                readOnly
                            />
                        </div>

                        <div className="flex flex-wrap">
                            {/* Mức giảm giá */}
                            <div className="w-full md:w-1/2 pr-2 mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-3">Mức giảm giá</label>
                                <input
                                    type="number"
                                    name="discountLevel"
                                    value={formState.discountLevel}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            {/* Giá giảm tối thiểu */}
                            <div className="w-full md:w-1/2 pl-2 mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-3">Giá giảm tối thiểu</label>
                                <input
                                    type="number"
                                    name="leastDiscount"
                                    value={formState.leastDiscount}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            {/* Giá giảm tối đa */}
                            <div className="w-full md:w-1/2 pr-2 mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-3">Giá giảm tối đa</label>
                                <input
                                    type="number"
                                    name="biggestDiscount"
                                    value={formState.biggestDiscount}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            {/* Hóa đơn tối thiểu */}
                            <div className="w-full md:w-1/2 pl-2 mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-3">Hóa đơn tối thiểu</label>
                                <input
                                    type="number"
                                    name="leastBill"
                                    value={formState.leastBill}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            {/* Ngày bắt đầu */}
                            <div className="w-full md:w-1/2 pr-2 mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-3">Ngày bắt đầu</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    min={today}
                                    value={formState.startDate} // Giá trị lấy từ formState
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            {/* Ngày kết thúc */}
                            <div className="w-full md:w-1/2 pl-2 mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-3">Ngày kết thúc</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    min={today}
                                    value={formState.endDate} // Giá trị lấy từ formState
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>
                        </div>

                        <div className="modal-action">
                            <button type="submit" className="btn btn-outline btn-sm btn-primary">Cập nhật</button>
                            <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>Đóng</button>
                        </div>
                    </form>

                </div>
            </dialog>
        </>
    );
};

export default UpdateVoucherModal;
