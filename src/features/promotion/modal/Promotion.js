import React, { useEffect, useState } from 'react';

const AddPromotionModalBody = ({ isOpen, onClose, promotion }) => {
    const [promotionData, setPromotionData] = useState({
        name: '',
        poster: '',
        startDate: '',
        endDate: '',
    });

    // Gán dữ liệu khuyến mãi vào form khi mở modal cập nhật
    useEffect(() => {
        if (promotion) {
            setPromotionData(promotion);
        } else {
            setPromotionData({
                name: '',
                poster: '',
                startDate: '',
                endDate: '',
            });
        }
    }, [promotion]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPromotionData({
            ...promotionData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (promotion) {
            console.log('Updating promotion:', promotionData);
        } else {
            console.log('Adding promotion:', promotionData);
        }
        onClose(); // Đóng modal sau khi thêm/cập nhật
    };

    return (
        <div className={`modal ${isOpen ? 'modal-open' : ''}`}> {/* Hiển thị modal nếu isOpen=true */}
            <div className="modal-box">
                <h2 className="font-bold text-lg">
                    {promotion ? 'Cập nhật khuyến mãi' : 'Thêm khuyến mãi mới'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-control">
                        <label className="label">Tên Khuyến mãi</label>
                        <input
                            type="text"
                            name="name"
                            value={promotionData.name}
                            onChange={handleChange}
                            required
                            className="input input-bordered"
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">Poster</label>
                        <input
                            type="text"
                            name="poster"
                            value={promotionData.poster}
                            onChange={handleChange}
                            required
                            className="input input-bordered"
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">Ngày bắt đầu</label>
                        <input
                            type="date"
                            name="startDate"
                            value={promotionData.startDate}
                            onChange={handleChange}
                            required
                            className="input input-bordered"
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">Ngày kết thúc</label>
                        <input
                            type="date"
                            name="endDate"
                            value={promotionData.endDate}
                            onChange={handleChange}
                            required
                            className="input input-bordered"
                        />
                    </div>
                    <div className="modal-action">
                        <button type="button" className="btn" onClick={onClose}>
                            Đóng
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {promotion ? 'Cập nhật' : 'Thêm'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPromotionModalBody;
