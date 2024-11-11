import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../common/headerSlice';
import PromotionService from '../../../services/PromotionService';
import UploadFileService from '../../../services/UploadFileService';
import MinusIcon from '@heroicons/react/24/outline/MinusIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';

const EditPromotionModal = ({ isOpen, onClose, editPromotion, onPromotionUpdate }) => {
    const [promotionName, setPromotionName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [poster, setPoster] = useState('');
    const [previewPoster, setPreviewPoster] = useState('');
    const [promotionDetails, setPromotionDetails] = useState([]); // State để chứa danh sách promotionDetails
    const dispatch = useDispatch();

    useEffect(() => {
        if (isOpen && editPromotion) {
            setPromotionName(editPromotion.name);
            const formatDateForInput = (dateString) => {
                const [day, month, year] = dateString.split('-');
                return `${year}-${month}-${day}`;
            };
            setStartDate(editPromotion.startDate ? formatDateForInput(editPromotion.startDate) : '');
            setEndDate(editPromotion.endDate ? formatDateForInput(editPromotion.endDate) : '');
            setPoster(editPromotion.poster);
            setPreviewPoster(editPromotion.poster);
            setPromotionDetails(editPromotion.promotionDetails || []); // Đặt danh sách promotionDetails
        }
    }, [isOpen, editPromotion]);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (file && validImageTypes.includes(file.type)) {
            const uploadUrl = await UploadFileService.uploadPromotionImage(file, poster);
            setPoster(uploadUrl);
            setPreviewPoster(URL.createObjectURL(file));
        } else {
            dispatch(showNotification({ message: 'Định dạng tệp không hợp lệ!', status: 0 }));
            setPoster(editPromotion.poster);
            setPreviewPoster(editPromotion.poster);
        }
    };

    const handleUpdatePromotion = async () => {
        if (!editPromotion.promotionID) {
            dispatch(showNotification({ message: 'ID khuyến mãi không hợp lệ!', status: 0 }));
            return;
        }

        const updatedPromotion = {
            ...editPromotion,
            name: promotionName,
            startDate: startDate,
            endDate: endDate,
            poster: poster,
            promotionDetails: promotionDetails, // Cập nhật danh sách promotionDetails
        };

        try {
            const response = await PromotionService.updatePromotion(editPromotion.promotionID, updatedPromotion);
            dispatch(showNotification({ message: 'Cập nhật khuyến mãi thành công!', status: 1 }));
            onPromotionUpdate(response);
            onClose();
        } catch (error) {
            dispatch(showNotification({ message: 'Cập nhật khuyến mãi thất bại!', status: 0 }));
        }
    };

    const handleAddDiscount = () => {
        // Thêm một đối tượng promotionDetail mới vào danh sách
        setPromotionDetails([...promotionDetails, { percentDiscount: '' }]);
    };

    const handleRemoveDiscount = (index) => {
        // Kiểm tra xem index có hợp lệ không
        if (index >= 0 && index < promotionDetails.length) {
            const updatedDetails = [...promotionDetails];
            updatedDetails.splice(index, 1); // Loại bỏ phần tử tại vị trí index
            setPromotionDetails(updatedDetails); // Cập nhật lại state
        } else {
            console.error('Invalid index:', index); // Kiểm tra nếu index không hợp lệ
        }
    };


    const handleDiscountChange = (index, value) => {
        // Cập nhật giá trị percentDiscount của promotionDetail tại vị trí index
        const updatedDetails = [...promotionDetails];
        updatedDetails[index].percentDiscount = value;
        setPromotionDetails(updatedDetails);
    };

    return (
        <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
            <div className="modal-box">
                <h2 className="text-xl mb-4">Cập nhật Khuyến Mãi</h2>
                <div className="form-control mb-4">
                    <label className="label">Tên Khuyến Mãi</label>
                    <input
                        type="text"
                        value={promotionName}
                        onChange={(e) => setPromotionName(e.target.value)}
                        className="input input-bordered"
                        placeholder="Nhập tên khuyến mãi"
                    />
                </div>

                <div className="flex space-x-4 mb-4">
                    <div className="form-control w-full">
                        <label className="label">Ngày Bắt Đầu</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="input input-bordered"
                        />
                    </div>

                    <div className="form-control w-full">
                        <label className="label">Ngày Kết Thúc</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="input input-bordered"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <input id="posterInput" type="file" onChange={handleImageChange} className="hidden" />
                    <div className="h-40 flex justify-center items-center rounded-lg bg-cover cursor-pointer" onClick={() => document.getElementById('posterInput').click()}>
                        {previewPoster ? (
                            <img src={previewPoster} alt="Preview" className="h-full object-cover rounded-lg" />
                        ) : (
                            <span className="text-gray-400 opacity-75">Chọn poster</span>
                        )}
                    </div>
                </div>

                <div className="mb-4">
                    <h4 className="font-bold">Giảm giá (%)</h4>
                    <div className="grid grid-cols-2 gap-4">
                        {promotionDetails.map((detail, index) => (
                            <div key={index} className="flex items-center">
                                <input
                                    type="number"
                                    value={detail.percentDiscount}
                                    onChange={(e) => handleDiscountChange(index, e.target.value)}
                                    placeholder={`Giảm giá ${index + 1} (%)`}
                                    className="input input-bordered w-full"
                                />
                                <span className="ml-2">%</span>
                                <MinusIcon
                                    className="w-8 h-8 cursor-pointer text-error ml-2"
                                    onClick={() => handleRemoveDiscount(index)}
                                />
                            </div>
                        ))}

                    </div>
                    <div className="flex justify-end p-2">
                        <PlusIcon
                            className="w-8 h-8 text-primary"
                            onClick={handleAddDiscount}
                        />
                    </div>
                </div>

                <div className="modal-action">
                    <button onClick={onClose} className="btn btn-outline">Hủy</button>
                    <button onClick={handleUpdatePromotion} className="btn btn-primary">Cập Nhật</button>
                </div>
            </div>
        </div>
    );
};

export default EditPromotionModal;
