import React, { useEffect, useState } from 'react';

const AddPromotionDetailModalBody = ({ isOpen, onClose, promotionDetail }) => {
    const [detailData, setDetailData] = useState({
        promotionID: '',
        percentDiscount: 0,
    });

    useEffect(() => {
        if (promotionDetail) {
            setDetailData(promotionDetail);
        } else {
            setDetailData({
                promotionID: '',
                percentDiscount: 0,
            });
        }
    }, [promotionDetail]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDetailData({ ...detailData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (promotionDetail) {
            console.log('Updating promotion detail:', detailData);
        } else {
            console.log('Adding new promotion detail:', detailData);
        }
        onClose();
    };

    return (
        <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
            <div className="modal-box">
                <h2 className="font-bold text-lg">
                    {promotionDetail ? 'Cập nhật Chi tiết Khuyến mãi' : 'Thêm Chi tiết Khuyến mãi'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-control">
                        <label className="label">Mã Khuyến mãi</label>
                        <input
                            type="text"
                            name="promotionID"
                            value={detailData.promotionID}
                            onChange={handleChange}
                            required
                            className="input input-bordered"
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">Phần trăm Giảm giá</label>
                        <input
                            type="number"
                            name="percentDiscount"
                            value={detailData.percentDiscount}
                            onChange={handleChange}
                            required
                            className="input input-bordered"
                            min="0"
                            max="100"
                        />
                    </div>
                    <div className="modal-action">
                        <button type="button" className="btn" onClick={onClose}>
                            Đóng
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {promotionDetail ? 'Cập nhật' : 'Thêm'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPromotionDetailModalBody;
