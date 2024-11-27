import React, { useEffect } from 'react';

function ProductDetailsModal({ promotion, onClose }) {

    // In thông tin promotion khi component được render
    useEffect(() => {
        if (promotion && promotion.promotionproducts && promotion.promotionproducts.length > 0) {
            console.log("Promotion products data:", promotion.promotionproducts);
        } else {
            console.log("No promotion products available.");
        }
    }, [promotion]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Chi tiết sản phẩm</h2>

                <h4 className="font-bold mb-2">Sản phẩm và Phiên bản:</h4>
                <table className="table table-sm w-full mt-2">
                    <thead>
                        <tr>
                            <th>Tên sản phẩm</th>
                            <th>Phiên bản</th>
                        </tr>
                    </thead>
                    <tbody>
                        {promotion.promotionproducts && promotion.promotionproducts.length > 0 ? (
                            promotion.promotionproducts.map((product, index) => (
                                <tr key={index}>
                                    <td>{product.productVersionID?.productName}</td>
                                    <td>{product.productVersionID?.versionName}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2" className="text-center">Không có sản phẩm nào</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="flex justify-end mt-6">
                    <button className="btn btn-outline btn-primary px-6 py-2" onClick={onClose}>Đóng</button>
                </div>
            </div>
        </div>
    );
}

export default ProductDetailsModal;
