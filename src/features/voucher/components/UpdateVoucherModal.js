import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from "../../common/headerSlice";
import VoucherService from "../../../services/voucherService";

const UpdateVoucherModal = ({ voucher, onClose, onReload }) => {
    const dispatch = useDispatch();

    const formatDate = (dateString) => {
        // Kiểm tra nếu dateString có giá trị
        if (dateString) {
            // Tách chuỗi ngày tháng và giờ ra từng phần
            const [day, month, year, hours, minutes] = dateString.split(/[- :]/);

            // Chuyển đổi thành định dạng yyyy-MM-ddTHH:mm
            return `${year}-${month}-${day}T${hours}:${minutes}`;
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
        startDate: voucher.startDate ? formatDate(voucher.startDate) : "", // Định dạng theo "DD-MM-yyyy HH:mm"
        endDate: voucher.endDate ? formatDate(voucher.endDate) : "",       // Định dạng theo "DD-MM-yyyy HH:mm"
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

        // Chuyển đổi lại ngày từ định dạng dd-mm-yyyy HH:mm sang yyyy-mm-ddTHH:mm
        const startDate = formState.startDate.split(" ")[0].split("-").reverse().join("-") + "T" + formState.startDate.split(" ")[1];
        const endDate = formState.endDate.split(" ")[0].split("-").reverse().join("-") + "T" + formState.endDate.split(" ")[1];

        const updatedVoucher = {
            ...formState,
            startDate,
            endDate,
        };
        console.log(updatedVoucher);

        try {
            await VoucherService.updateVoucher(voucher.voucherID, updatedVoucher);
            dispatch(showNotification({ message: "Cập nhật voucher thành công", status: 1 }));
            onClose();
            onReload();
        } catch (error) {
            // Hiển thị lỗi chi tiết từ backend
            const errorMessage = error.message || "Lỗi khi cập nhật voucher";
            if (errorMessage.includes(':')) {
                const errorMessages = errorMessage.split(', ').map((msg) => msg.trim());
                errorMessages.forEach((msg) => {
                    dispatch(showNotification({ message: `Lỗi: ${msg}`, status: 0 }));
                });
            } else {
                dispatch(showNotification({ message: `Lỗi: ${errorMessage}`, status: 0 }));
            }
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
                                />
                            </div>

                            {/* Giá giảm tối thiểu */}
                            <div className="w-full md:w-1/2 pl-2 mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-3">Hóa đơn tối thiểu</label>
                                <input
                                    type="number"
                                    name="leastBill"
                                    value={formState.leastBill}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                />
                            </div>

                            {/* Giá giảm tối đa */}
                            <div className="w-full md:w-1/2 pr-2 mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-3">Giá giảm tối thiểu</label>
                                <input
                                    type="number"
                                    name="leastDiscount"
                                    value={formState.leastDiscount}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                />
                            </div>

                            {/* Hóa đơn tối thiểu */}
                            <div className="w-full md:w-1/2 pl-2 mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-3">Giá giảm tối đa</label>
                                <input
                                    type="number"
                                    name="biggestDiscount"
                                    value={formState.biggestDiscount}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                />
                            </div>

                            {/* Ngày bắt đầu */}
                            <div className="w-full md:w-1/2 pr-2 mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-3">Ngày bắt đầu</label>
                                <input
                                    type="datetime-local"
                                    name="startDate"
                                    min={today}
                                    value={formState.startDate || ""} // Đảm bảo giá trị là đúng định dạng yyyy-MM-ddTHH:mm
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                />
                            </div>

                            {/* Ngày kết thúc */}
                            <div className="w-full md:w-1/2 pl-2 mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-3">Ngày kết thúc</label>
                                <input
                                    type="datetime-local"
                                    name="endDate"
                                    min={today}
                                    value={formState.endDate || ""} // Đảm bảo giá trị là đúng định dạng yyyy-MM-ddTHH:mm
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
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
