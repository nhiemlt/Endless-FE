import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from "../../common/headerSlice";
import VoucherService from "../../../services/voucherService";
import UserSelectModal from "./UserSelectModal";

const CreateVoucherModal = ({ onClose, onReload }) => {
    const dispatch = useDispatch();
    const [formState, setFormState] = useState({
        voucherCode: "",
        discountLevel: 0,
        leastDiscount: 0,
        biggestDiscount: 0,
        leastBill: 0,
        discountForm: "",
        startDate: "",
        endDate: "",
    });

    const [showUserSelectModal, setShowUserSelectModal] = useState(false); // Trạng thái để hiển thị UserSelectModal

    const handleChange = (e) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmitAll = async () => {
        try {
            await VoucherService.addVoucherToAllActiveUsers(formState);
            dispatch(showNotification({ message: "Thêm voucher cho tất cả thành công", status: 1 }));
            onClose();
            onReload();
        } catch (error) {
            dispatch(showNotification({ message: "Lỗi khi thêm voucher cho tất cả", status: 0 }));
        }
    };

    const handleOpenUserSelectModal = () => {
        setShowUserSelectModal(true);
    };

    const closeUserSelectModal = () => {
        setShowUserSelectModal(false);
    };

    return (
        <>
            <dialog id="add_voucher_modal" className="modal" open>
                <div className="modal-box w-11/12 max-w-5xl relative">
                    <button
                        type="button"
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                    <h3 className="font-bold text-lg">Thêm Voucher</h3>
                    <form className="mt-3">
                        <form className="mt-3">
                            <div className="mb-4">
                                <div className="flex flex-wrap">
                                    {/* Mã Voucher */}
                                    <div className="w-full md:w-1/2 pr-2 mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-3">Mã Voucher</label>
                                        <input
                                            type="text"
                                            name="voucherCode"
                                            value={formState.voucherCode}
                                            onChange={handleChange}
                                            className="input input-bordered w-full"
                                            required
                                        />
                                    </div>

                                    {/* Mức giảm giá */}
                                    <div className="w-full md:w-1/2 pl-2 mb-4">
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
                                    <div className="w-full md:w-1/2 pr-2 mb-4">
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
                                    <div className="w-full md:w-1/2 pl-2 mb-4">
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
                                    <div className="w-full md:w-1/2 pr-2 mb-4">
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

                                    {/* Hình thức giảm giá */}
                                    <div className="w-full md:w-1/2 pl-2 mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-3">Hình thức giảm giá</label>
                                        <input
                                            type="text"
                                            name="discountForm"
                                            value={formState.discountForm}
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
                                            value={formState.startDate}
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
                                            value={formState.endDate}
                                            onChange={handleChange}
                                            className="input input-bordered w-full"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div className="modal-action">
                            <button type="button" className="btn btn-outline btn-sm btn-primary" onClick={handleSubmitAll}>Gửi tất cả</button>
                            <button type="button" className="btn btn-outline btn-sm btn-secondary" onClick={handleOpenUserSelectModal}>Gửi riêng</button>
                        </div>
                    </form>
                </div>
            </dialog>

            {/* Hiển thị UserSelectModal nếu showUserSelectModal là true */}
            {showUserSelectModal && (
                <UserSelectModal
                    showModal={showUserSelectModal}
                    closeModal={closeUserSelectModal}
                    biggestDiscount = {formState.biggestDiscount}
                    discountForm = {formState.discountForm}
                    discountLevel = {formState.discountLevel}
                    endDate = {formState.endDate}
                    leastBill = {formState.leastBill}
                    leastDiscount = {formState.leastDiscount}
                    startDate = {formState.startDate}
                    voucherCode = {formState.voucherCode}
                    close={closeUserSelectModal}
                />
            )}
        </>
    );
};

export default CreateVoucherModal;
