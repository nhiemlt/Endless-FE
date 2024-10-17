// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { updateVoucher } from "../voucherSlice";
// import { closeModal } from "../../common/modalSlice";
// import { showNotification } from "../../common/headerSlice";

// const UpdateVoucherModalBody = ({ voucher }) => {
//     const dispatch = useDispatch();
//     const [voucherData, setVoucherData] = useState(voucher);

//     const { loading } = useSelector((state) => state.vouchers);

//     useEffect(() => {
//         setVoucherData(voucher); // Đặt lại dữ liệu khi voucher thay đổi
//     }, [voucher]);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setVoucherData({
//             ...voucherData,
//             [name]: value,
//         });
//     };

//     const handleUpdateVoucher = () => {
//         dispatch(updateVoucher({ id: voucher.id, voucherModel: voucherData }))
//             .then(() => {
//                 dispatch(showNotification({
//                     message: "Voucher updated successfully!",
//                     status: 1
//                 }));
//                 dispatch(closeModal());
//                 // Bạn có thể làm mới danh sách voucher ở đây nếu cần
//             })
//             .catch(() => {
//                 dispatch(showNotification({
//                     message: "Failed to update voucher.",
//                     status: 0
//                 }));
//             });
//     };

//     return (
//         <div>
//             <div className="flex">
//                 <div className="w-1/2 pr-2">
//                     <div className="mb-4">
//                         <label className="block text-sm font-medium text-gray-700">Mã Voucher</label>
//                         <input
//                             type="text"
//                             name="voucherCode"
//                             value={voucherData.voucherCode}
//                             onChange={handleInputChange}
//                             className="input input-bordered w-full"
//                         />
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-sm font-medium text-gray-700">Giá giảm tối thiểu</label>
//                         <input
//                             type="number"
//                             name="leastDiscount"
//                             value={voucherData.leastDiscount}
//                             onChange={handleInputChange}
//                             className="input input-bordered w-full"
//                         />
//                     </div>

//                     <div className="mb-4">
//                         <label className="block text-sm font-medium text-gray-700">Hóa đơn tối thiểu</label>
//                         <input
//                             type="number"
//                             name="leastBill"
//                             value={voucherData.leastBill}
//                             onChange={handleInputChange}
//                             className="input input-bordered w-full"
//                         />
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-sm font-medium text-gray-700">Ngày bắt đầu</label>
//                         <input
//                             type="date"
//                             name="startDate"
//                             value={voucherData.startDate}
//                             onChange={handleInputChange}
//                             className="input input-bordered w-full"
//                         />
//                     </div>
//                 </div>
//                 <div className="w-1/2 pl-2">
//                     <div className="mb-4">
//                         <label className="block text-sm font-medium text-gray-700">Mức giảm giá</label>
//                         <input
//                             type="number"
//                             name="discountLevel"
//                             value={voucherData.discountLevel}
//                             onChange={handleInputChange}
//                             className="input input-bordered w-full"
//                         />
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-sm font-medium text-gray-700">Giá giảm tối đa</label>
//                         <input
//                             type="number"
//                             name="biggestDiscount"
//                             value={voucherData.biggestDiscount}
//                             onChange={handleInputChange}
//                             className="input input-bordered w-full"
//                         />
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-sm font-medium text-gray-700">Hình thức giảm giá</label>
//                         <input
//                             type="text"
//                             name="discountForm"
//                             value={voucherData.discountForm}
//                             onChange={handleInputChange}
//                             className="input input-bordered w-full"
//                         />
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-sm font-medium text-gray-700">Ngày kết</label>
//                         <input
//                             type="date"
//                             name="endDate"
//                             value={voucherData.endDate}
//                             onChange={handleInputChange}
//                             className="input input-bordered w-full"
//                         />
//                     </div>
//                 </div>
//             </div>
//             {/* Thêm các input khác tùy theo dữ liệu của bạn */}
//             <div className="flex justify-end">
                // <button
                //     className={`btn btn-primary ${loading ? 'loading' : ''}`}
                //     onClick={handleUpdateVoucher}
                //     disabled={loading}
                // >
                //     {loading ? 'Updating...' : 'Update Voucher'}
                // </button>
//             </div>
//         </div>
//     );
// };

// export default UpdateVoucherModalBody;
