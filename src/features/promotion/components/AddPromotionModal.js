import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../common/headerSlice';
import PromotionService from '../../../services/PromotionService';
import UploadFileService from '../../../services/UploadFileService';
import MinusIcon from '@heroicons/react/24/outline/MinusIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';

const AddPromotionModal = ({ isOpen, onClose, onPromotionAdded }) => {
    const [promotionName, setPromotionName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [promotionPoster, setPromotionPoster] = useState(null);
    const [previewPoster, setPreviewPoster] = useState(null);
    const [percentDiscounts, setPercentDiscounts] = useState([]);
    const dispatch = useDispatch();
    const dialogRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (file && validImageTypes.includes(file.type)) {
            setPromotionPoster(file);
            setPreviewPoster(URL.createObjectURL(file));
        } else {
            dispatch(showNotification({ message: 'Định dạng tệp không hợp lệ! Vui lòng chọn hình ảnh (JPEG, PNG, GIF).', status: 0 }));
            resetImage();
        }
    };

    const resetImage = () => {
        setPromotionPoster(null);
        setPreviewPoster(null);
    };

    // Hàm kiểm tra tên khuyến mãi có duy nhất không
    const isPromotionNameUnique = async (name) => {
        const promotions = await PromotionService.getAllPromotions();
        // Kiểm tra nếu promotions không phải là mảng, gán thành mảng rỗng
        const promotionList = Array.isArray(promotions) ? promotions : [];
        return !promotionList.some(promo => promo.name.toLowerCase() === name.toLowerCase());
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (new Date(startDate) > new Date(endDate)) {
            dispatch(showNotification({ message: 'Ngày kết thúc phải sau ngày bắt đầu!', status: 0 }));
            return;
        }

        try {
            if (!promotionPoster) {
                throw new Error("Poster là bắt buộc");
            }

            // Kiểm tra các giá trị percentDiscount
            const validDiscounts = percentDiscounts.filter(discount => !isNaN(discount) && discount > 0);  // Chỉ giữ các phần trăm hợp lệ
            if (validDiscounts.length === 0) {
                dispatch(showNotification({ message: 'Giảm giá không hợp lệ!', status: 0 }));
                return;
            }

            const isUnique = await isPromotionNameUnique(promotionName);
            if (!isUnique) {
                dispatch(showNotification({ message: 'Tên khuyến mãi đã tồn tại!', status: 0 }));
                return;
            }

            const posterUrl = await UploadFileService.uploadPromotionImage(promotionPoster);

            // Đảm bảo gửi đúng cấu trúc với 'promotionDetails'
            const newPromotion = {
                name: promotionName,
                startDate,
                endDate,
                poster: posterUrl,
                promotionDetails: validDiscounts.map((percent) => ({ percentDiscount: Number(percent) }))  // Bao phần trăm giảm giá vào 'promotionDetails'
            };
            console.log(newPromotion); // Để kiểm tra đối tượng trước khi gửi

            // Gửi yêu cầu tạo khuyến mãi
            await PromotionService.createPromotion(newPromotion);
            dispatch(showNotification({ message: 'Thêm khuyến mãi thành công!', status: 1 }));
            resetForm();
            dialogRef.current.close();
            onClose();

        } catch (error) {
            console.error("Lỗi khi tạo khuyến mãi:", error);
            dispatch(showNotification({ message: 'Thêm khuyến mãi thất bại!', status: 0 }));
        }
    };



    const resetForm = () => {
        setPromotionName('');
        setStartDate('');
        setEndDate('');
        setPercentDiscounts(['']);
        resetImage();
    };

    // Thêm giá trị phần trăm
    const addPercentDiscountField = () => {
        setPercentDiscounts([...percentDiscounts, '']);
    };

    // Cập nhật giá trị phần trăm
    const updatePercentDiscount = (index, newPercent) => {
        const updatedPercentDiscounts = [...percentDiscounts];
        updatedPercentDiscounts[index] = newPercent;
        setPercentDiscounts(updatedPercentDiscounts);
    };

    // Xóa giá trị phần trăm
    const removePercentDiscountField = (index) => {
        const updatedPercentDiscounts = percentDiscounts.filter((_, i) => i !== index);
        setPercentDiscounts(updatedPercentDiscounts);
    };

    return isOpen ? (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
            <dialog ref={dialogRef} id="add_promotion_modal" className="modal" role="dialog" open>
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Thêm Khuyến Mãi</h3>
                    <form className='mt-4' onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <input
                                type="text"
                                value={promotionName}
                                onChange={(e) => setPromotionName(e.target.value)}
                                placeholder="Tên Khuyến Mãi"
                                className="input input-bordered w-full"
                                required
                            />
                        </div>
                        <div className="flex space-x-4 mb-4">
                            <div className="form-control w-full">
                                <label className="label">Ngày bắt đầu</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                    className="input input-bordered"
                                />
                            </div>
                            <div className="form-control w-full">
                                <label className="label">Ngày kết thúc</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    required
                                    className="input input-bordered"
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <input id="posterInput" type="file" onChange={handleImageChange} className="hidden" />
                            <div className="h-40 flex justify-center items-center rounded-lg bg-cover cursor-pointer" onClick={() => document.getElementById('posterInput').click()}>
                                {previewPoster ? (
                                    <img src={previewPoster} alt="Xem trước" className="h-full object-cover rounded-lg" />
                                ) : (
                                    <span className="text-gray-400 opacity-75">Chọn poster</span>
                                )}
                            </div>
                        </div>

                        <div className="mb-4">
                            <h4 className="font-bold">Giảm giá (%)</h4>
                            <div className="grid grid-cols-2 gap-4">
                                {percentDiscounts.map((percent, index) => (
                                    <div key={index} className="flex items-center">
                                        <input
                                            type="number"
                                            value={percent}
                                            onChange={(e) => updatePercentDiscount(index, e.target.value)}
                                            placeholder={`Giảm giá ${index + 1} (%)`}
                                            className="input input-bordered w-full"
                                        />
                                        <span className="ml-2">%</span>
                                        <MinusIcon
                                            className="w-8 h-8 cursor-pointer text-error ml-2"
                                            onClick={() => removePercentDiscountField(index)}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end p-2">
                                <PlusIcon
                                    className="w-8 h-8 text-primary"
                                    onClick={addPercentDiscountField}
                                />
                            </div>
                        </div>


                        <div className="modal-action">
                            <button type="submit" className="btn btn-outline btn-sm btn-primary">Lưu</button>
                            <button type="button" className="btn btn-outline btn-sm btn-secondary" onClick={onClose}>Đóng</button>
                        </div>
                    </form>
                </div>
            </dialog>
        </>
    ) : null;
};

export default AddPromotionModal;
