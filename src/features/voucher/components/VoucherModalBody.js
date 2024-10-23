import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import VoucherService from '../../../services/voucherService'; // Đảm bảo đường dẫn này đúng
import { showNotification } from "../../common/headerSlice";
import { closeModal } from "../../common/modalSlice";

const VoucherModalBody = ({ voucherData, isUpdate }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        voucherID: '',
        voucherCode: '',
        discountLevel: '',
        leastDiscount: '',
        biggestDiscount: '',
        leastBill: '',
        discountForm: '',
        startDate: '',
        endDate: ''
    });

    // Cập nhật form với dữ liệu hiện có nếu voucherData thay đổi
    useEffect(() => {
        if (voucherData) {
            setFormData(voucherData); // Điền dữ liệu voucher vào form
        } else {
            console.error("Không có dữ liệu voucher");
            console.log(voucherData);
        }
    }, [voucherData]);

    // Xử lý thay đổi giá trị của form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Xử lý gửi form
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra xem các trường bắt buộc đã được điền chưa
        if (Object.values(formData).some(field => field === '')) {
            dispatch(showNotification({
                message: "Vui lòng điền đầy đủ thông tin.",
                status: 0
            }));
            return;
        }

        try {
            if (isUpdate) {
                // Gọi API để cập nhật voucher
                await VoucherService.updateVoucher(formData.voucherID, formData);
                dispatch(showNotification({
                    message: "Cập nhật voucher thành công!",
                    status: 1
                }));
            } else {
                // Gọi API để thêm voucher mới
                await VoucherService.addVoucher(formData);
                dispatch(showNotification({
                    message: "Thêm voucher thành công!",
                    status: 1
                }));
            }

            dispatch(closeModal()); // Đóng modal sau khi lưu thành công
        } catch (error) {
            console.error("Lỗi khi lưu voucher:", error.response?.data);
            dispatch(showNotification({
                message: "Lưu voucher không thành công. " + (error.response?.data?.message || "Lỗi không xác định."),
                status: 0
            }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4">
            <div className="flex flex-wrap">
                <div className="w-full md:w-1/2 pr-2 mb-4">
                    <label className="block text-sm font-medium text-gray-700">Mã Voucher</label>
                    <input
                        type="text"
                        name="voucherCode"
                        value={formData.voucherCode}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        required
                    />
                </div>
                <div className="w-full md:w-1/2 pl-2 mb-4">
                    <label className="block text-sm font-medium text-gray-700">Mức giảm giá</label>
                    <input
                        type="number"
                        name="discountLevel"
                        value={formData.discountLevel}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        required
                    />
                </div>
                <div className="w-full md:w-1/2 pr-2 mb-4">
                    <label className="block text-sm font-medium text-gray-700">Giá giảm tối thiểu</label>
                    <input
                        type="number"
                        name="leastDiscount"
                        value={formData.leastDiscount}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        required
                    />
                </div>
                <div className="w-full md:w-1/2 pl-2 mb-4">
                    <label className="block text-sm font-medium text-gray-700">Giá giảm tối đa</label>
                    <input
                        type="number"
                        name="biggestDiscount"
                        value={formData.biggestDiscount}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        required
                    />
                </div>
                <div className="w-full md:w-1/2 pr-2 mb-4">
                    <label className="block text-sm font-medium text-gray-700">Hóa đơn tối thiểu</label>
                    <input
                        type="number"
                        name="leastBill"
                        value={formData.leastBill}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        required
                    />
                </div>
                <div className="w-full md:w-1/2 pl-2 mb-4">
                    <label className="block text-sm font-medium text-gray-700">Hình thức giảm giá</label>
                    <input
                        type="text"
                        name="discountForm"
                        value={formData.discountForm}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        required
                    />
                </div>
                <div className="w-full md:w-1/2 pr-2 mb-4">
                    <label className="block text-sm font-medium text-gray-700">Ngày bắt đầu</label>
                    <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        required
                    />
                </div>
                <div className="w-full md:w-1/2 pl-2 mb-4">
                    <label className="block text-sm font-medium text-gray-700">Ngày kết thúc</label>
                    <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        required
                    />
                </div>
            </div>
            <button type="submit" className="btn btn-primary mt-4">
                {isUpdate ? "Cập nhật" : "Thêm"}
            </button>
        </form>
    );
};

export default VoucherModalBody;
