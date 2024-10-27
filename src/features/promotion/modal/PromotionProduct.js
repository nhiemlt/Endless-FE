import React, { useEffect, useState } from 'react';

const AddPromotionProductModalBody = ({ isOpen, onClose, promotionProduct }) => {
    const [productData, setProductData] = useState({
        promotionDetailID: '',
        productVersionID: '',
    });

    useEffect(() => {
        if (promotionProduct) {
            setProductData(promotionProduct);
        } else {
            setProductData({
                promotionDetailID: '',
                productVersionID: '',
            });
        }
    }, [promotionProduct]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData({ ...productData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (promotionProduct) {
            console.log('Updating promotion product:', productData);
        } else {
            console.log('Adding new promotion product:', productData);
        }
        onClose();
    };

    return (
        <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
            <div className="modal-box">
                <h2 className="font-bold text-lg">
                    {promotionProduct ? 'Cập nhật Sản phẩm Khuyến mãi' : 'Thêm Sản phẩm Khuyến mãi'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-control">
                        <label className="label">Mã Chi tiết Khuyến mãi</label>
                        <input
                            type="text"
                            name="promotionDetailID"
                            value={productData.promotionDetailID}
                            onChange={handleChange}
                            required
                            className="input input-bordered"
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">Mã Phiên bản Sản phẩm</label>
                        <input
                            type="text"
                            name="productVersionID"
                            value={productData.productVersionID}
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
                            {promotionProduct ? 'Cập nhật' : 'Thêm'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPromotionProductModalBody;
