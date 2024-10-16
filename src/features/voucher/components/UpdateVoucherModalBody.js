// import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { closeModal } from '../../common/modalSlice'; // Đường dẫn chính xác
// import { someFunction } from '../voucherSlice'; 
// import { updateVoucher } from './voucherSlice';

// const UpdateVoucherModalBody = ({ voucher, onClose }) => {
//     const dispatch = useDispatch();
//     const [updatedVoucher, setUpdatedVoucher] = useState(voucher);

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setUpdatedVoucher({ ...updatedVoucher, [name]: value });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         dispatch(updateVoucher(updatedVoucher)); // Gửi thông tin voucher cập nhật
//         onClose(); // Đóng modal
//     };

//     useEffect(() => {
//         setUpdatedVoucher(voucher); // Cập nhật thông tin voucher vào state
//     }, [voucher]);

//     return (
//         <div className="modal">
//             <div className="modal-content">
//                 <span className="close" onClick={onClose}>&times;</span>
//                 <h2>Update Voucher</h2>
//                 <form onSubmit={handleSubmit}>
//                     <label>
//                         Voucher Code:
//                         <input type="text" name="voucherCode" value={updatedVoucher.voucherCode} onChange={handleInputChange} required />
//                     </label>
//                     <label>
//                         Giảm giá tối thiểu:
//                         <input type="number" name="leastDiscount" value={updatedVoucher.leastDiscount} onChange={handleInputChange} required />
//                     </label>
//                     <label>
//                         Mức giảm giá:
//                         <input type="number" name="discountLevel" value={updatedVoucher.discountLevel} onChange={handleInputChange} required />
//                     </label>
//                     <label>
//                         Ngày bắt đầu:
//                         <input type="date" name="startDate" value={updatedVoucher.startDate} onChange={handleInputChange} required />
//                     </label>
//                     <label>
//                         Hóa đơn tối thiểu:
//                         <input type="number" name="leastBill" value={updatedVoucher.leastBill} onChange={handleInputChange} required />
//                     </label>
//                     <label>
//                         Giảm giá tối đa:
//                         <input type="number" name="biggestDiscount" value={updatedVoucher.biggestDiscount} onChange={handleInputChange} required />
//                     </label>
//                     <label>
//                         Hình thức giảm giá:
//                         <input type="text" name="discountForm" value={updatedVoucher.discountForm} onChange={handleInputChange} required />
//                     </label>
//                     <label>
//                         Ngày kết thúc:
//                         <input type="date" name="endDate" value={updatedVoucher.endDate} onChange={handleInputChange} required />
//                     </label>
//                     <button type="submit">Cập nhật</button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default UpdateVoucherModalBody;
