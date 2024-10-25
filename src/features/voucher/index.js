import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";
import TitleCard from "../../components/Cards/TitleCard";
import { showNotification } from "../common/headerSlice";
import VoucherService from "../../services/voucherService";
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';


function Vouchers() {
    const dispatch = useDispatch();

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
    const [page, setPage] = useState(0); // Trang hiện tại
    const [size, setSize] = useState(10); // Số lượng bản ghi trên mỗi trang
    const [totalPages, setTotalPages] = useState(1); // Tổng số trang
    const [searchVoucherCode, setSearchVoucherCode] = useState(''); // Để lưu voucherCode tìm kiếm

    // Hàm để lấy danh sách vouchers
    const loadVouchers = async () => {
        setIsLoading(true);
        try {
            const response = await VoucherService.fetchVouchers({
                page: page, // Số trang hiện tại
                size: size, // Số lượng bản ghi trên mỗi trang
                sortBy: 'voucherID',
                sortDir: 'asc',
                voucherCode: searchVoucherCode, // VoucherCode tìm kiếm
            });

            const fetchedVouchers = response.content;
            setTotalPages(response.totalPages); // Cập nhật tổng số trang

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

    // Gọi loadVouchers mỗi khi page, size hoặc searchVoucherCode thay đổi
    useEffect(() => {
        loadVouchers();
    }, [page, size, searchVoucherCode, dispatch]);


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

    const closeAddModel = function () {
        document.getElementById('my_modal_4').close();
        setEditingVoucherId(null)
        setIsEditing(false);
    }

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
                <div className="flex flex-col md:flex-row justify-between items-center w-full mb-4">
                    {/* Thanh tìm kiếm voucherCode */}
                    <div className="flex justify-start items-center space-x-2 mb-2 mr-2 md:mb-0">
                        <input
                            type="text"
                            placeholder="Tìm kiếm mã voucher..."
                            value={searchVoucherCode}
                            onChange={(e) => setSearchVoucherCode(e.target.value)}
                            className="input input-bordered w-full md:w-50 h-8"
                            onClick={loadVouchers}
                        />
                        
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button className="btn btn-outline btn-sm btn-primary" onClick={handleAdd}>
                            {isEditing ? "Cập nhật voucher" : "Thêm voucher"}
                        </button>
                    </div>
                </div>
                <dialog id="my_modal_4" className="modal">
                    <div className="modal-box w-11/12 max-w-5xl">
                        <h3 className="font-bold text-lg">{isEditing ? "Cập nhật Voucher" : "Thêm Voucher"}</h3>
                        <form className="mt-3" onSubmit={handleSubmit}>
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
                                <div className="modal-action" style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px' }}>
                                    <button type="submit" className="btn btn-primary btn-sm">
                                        {isEditing ? "Cập nhật" : "Thêm"}
                                    </button>
                                    <a onClick={closeAddModel} className="btn btn-sm">Hủy</a>
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
                                            <PencilIcon className="h-10 w-5 text-warning" onClick={() => handleEdit(voucher)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="10">
                                        <div className="flex justify-center mt-4">
                                            {[...Array(totalPages)].map((_, index) => (
                                                <button
                                                    key={index}
                                                    className={`btn btn-xs btn-outline btn-circle me-1 ${page === index ? 'btn-active' : ''}`}
                                                    onClick={() => setPage(index)} // Chuyển trang
                                                >
                                                    {index + 1}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    )
                }
            </TitleCard >
        </>
    );
}

export default Vouchers;
