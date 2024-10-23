import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";
import TitleCard from "../../components/Cards/TitleCard";
import { showNotification } from "../common/headerSlice";
import VoucherService from "../../services/voucherService";

function Vouchers() {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setIsLoading] = useState(true);
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
    const [isEditing, setIsEditing] = useState(false);
    const [editingVoucherId, setEditingVoucherId] = useState(null);
    const dispatch = useDispatch();

    // Hàm để lấy danh sách vouchers
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
                dispatch(showNotification({ message: "Không thể tải voucher, dữ liệu không hợp lệ.", status: 0 }));
            }
        } catch (err) {
            dispatch(showNotification({ message: "Không thể tải voucher", status: 0 }));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadVouchers();
    }, [dispatch]);

    // Xử lý thay đổi giá trị form
    const handleChange = (e) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value,
        });
    };

    // Sau khi thêm hoặc cập nhật, cần gọi lại hàm loadVouchers
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await VoucherService.updateVoucher(editingVoucherId, formState);
                dispatch(showNotification({ message: "Cập nhật voucher thành công", status: 1 }));
            } else {
                await VoucherService.addVoucherToAllActiveUsers(formState);
                dispatch(showNotification({ message: "Thêm voucher thành công", status: 1 }));
            }
            // Tắt modal và load lại danh sách voucher
            document.getElementById('my_modal_4').close();
            loadVouchers(); // Load lại danh sách vouchers
        } catch (error) {
            dispatch(showNotification({ message: "Lỗi trong quá trình thêm/cập nhật voucher", status: 0 }));
        }
    };

    // Hàm để mở modal trong chế độ cập nhật
    const handleEdit = (voucher) => {
        setFormState({
            voucherCode: voucher.voucherCode,
            discountLevel: voucher.discountLevel,
            leastDiscount: voucher.leastDiscount,
            biggestDiscount: voucher.biggestDiscount,
            leastBill: voucher.leastBill,
            discountForm: voucher.discountForm,
            startDate: voucher.startDate,
            endDate: voucher.endDate,
        });
        setEditingVoucherId(voucher.voucherID);
        setIsEditing(true);
        document.getElementById('my_modal_4').showModal();
    };

    // Hàm để mở modal trong chế độ thêm mới
    const handleAdd = () => {
        setFormState({
            voucherCode: "",
            discountLevel: 0,
            leastDiscount: 0,
            biggestDiscount: 0,
            leastBill: 0,
            discountForm: "",
            startDate: "",
            endDate: "",
        });
        setIsEditing(false);
        setEditingVoucherId(null);
        document.getElementById('my_modal_4').showModal();
    };

    return (
        <>
            <TitleCard title="Voucher" topMargin="mt-2">
                <button className="btn btn-sm btn-primary" onClick={handleAdd}>
                    {isEditing ? "Cập nhật voucher" : "Thêm voucher"}
                </button>
                <dialog id="my_modal_4" className="modal">
                    <div className="modal-box w-11/12 max-w-5xl">
                        <h3 className="font-bold text-lg">{isEditing ? "Cập nhật Voucher" : "Thêm Voucher"}</h3>
                        <form className="mt-3" onSubmit={handleSubmit}>
                            <div className="flex flex-wrap">
                                {/* Mã Voucher */}
                                <div className="w-full md:w-1/2 pr-2 mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Mã Voucher</label>
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
                                    <label className="block text-sm font-medium text-gray-700">Mức giảm giá</label>
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
                                    <label className="block text-sm font-medium text-gray-700">Giá giảm tối thiểu</label>
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
                                    <label className="block text-sm font-medium text-gray-700">Giá giảm tối đa</label>
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
                                    <label className="block text-sm font-medium text-gray-700">Hóa đơn tối thiểu</label>
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
                                    <label className="block text-sm font-medium text-gray-700">Hình thức giảm giá</label>
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
                                    <label className="block text-sm font-medium text-gray-700">Ngày bắt đầu</label>
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
                                    <label className="block text-sm font-medium text-gray-700">Ngày kết thúc</label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formState.endDate}
                                        onChange={handleChange}
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </div>
                                <div className="modal-action">
                                    <button type="submit" className="btn btn-primary btn-sm">
                                        {isEditing ? "Cập nhật" : "Thêm"}
                                    </button>
                                    <button className="btn btn-sm" onClick={() => document.getElementById('my_modal_4').close()}>Hủy</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </dialog>

                {/* Bảng hiển thị danh sách vouchers */}
                {
                    loading ? (
                        <div>Loading...</div>
                    ) : (
                        <table className="table table-xs mt-3">
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
                                    <tr key={voucher.id}>
                                        <td>{index + 1}</td>
                                        <td>{voucher.voucherCode}</td>
                                        <td>{voucher.discountLevel}</td>
                                        <td>{voucher.leastDiscount}</td>
                                        <td>{voucher.biggestDiscount}</td>
                                        <td>{voucher.leastBill}</td>
                                        <td>{voucher.discountForm}</td>
                                        <td>{new Date(voucher.startDate).toLocaleDateString()}</td>
                                        <td>{new Date(voucher.endDate).toLocaleDateString()}</td>
                                        <td>
                                            <button className="btn btn-sm" onClick={() => handleEdit(voucher)}>Cập nhật</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )
                }
            </TitleCard >
        </>
    );
}

export default Vouchers;
