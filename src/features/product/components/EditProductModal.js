import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ProductService from '../../../services/ProductService';
import { showNotification } from '../../common/headerSlice';

const EditProductModal = ({ product, categories, brands, onClose, onProductUpdated }) => {
    const [productName, setProductName] = useState(product.name || '');
    const [category, setCategory] = useState(product.categoryID || ''); // Lưu ID danh mục
    const [brand, setBrand] = useState(product.brandID || ''); // Lưu ID thương hiệu
    const [description, setDescription] = useState(product.description || '');

    const dispatch = useDispatch();

    useEffect(() => {
        console.log("Product:", product);
        console.log("Category ID:", product.categoryID);
        console.log("Brand ID:", product.brandID);
        // Thiết lập lại giá trị khi modal mở
        setProductName(product.name || '');
        setCategory(product.categoryID?.categoryID || ''); // Đảm bảo lấy đúng ID của category
        setBrand(product.brandID?.brandID || ''); // Đảm bảo lấy đúng ID của brand
        setDescription(product.description || '');
    }, [product]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await ProductService.updateProduct(product.productID, {
                name: productName,
                categoryID: category,
                brandID: brand,
                description,
            });
            dispatch(showNotification({ message: "Cập nhật sản phẩm thành công!", status: 1 }));
            onProductUpdated();
            onClose();
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Cập nhật sản phẩm thất bại!"; // Lấy thông điệp từ lỗi
            if (error.response && error.response.status === 500) {
                // Nếu lỗi là 500, hiển thị thông báo cụ thể
                dispatch(showNotification({ message: errorMessage, status: 0 }));
            } else {
                dispatch(showNotification({ message: "Cập nhật sản phẩm thất bại!", status: 0 }));
            }
        }
    };



    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
            <dialog className="modal" role="dialog" open>
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Cập nhật sản phẩm</h3>
                    <form className="mt-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-4">
                            <label>Tên sản phẩm</label>
                            <input
                                type="text"
                                placeholder="Nhập tên sản phẩm..."
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                className="input input-bordered w-full"
                                required
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="select select-bordered w-full"
                                    required
                                >
                                    <option value="">Chọn danh mục</option>
                                    {categories.map((cat) => (
                                        <option key={cat.categoryID} value={cat.categoryID}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                    className="select select-bordered w-full"
                                    required
                                >
                                    <option value="">Chọn thương hiệu</option>
                                    {brands.map((b) => (
                                        <option key={b.brandID} value={b.brandID}>
                                            {b.brandName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <label>Mô tả</label>
                            <textarea
                                placeholder="Nhập mô tả sản phẩm"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="textarea textarea-bordered w-full"
                                rows="3"
                            ></textarea>
                        </div>

                        <div className="modal-action mt-4">
                            <button type="submit" className="btn btn-outline btn-sm btn-primary">
                                Cập nhật
                            </button>
                            <button type="button" className="btn btn-outline btn-sm btn-secondary" onClick={onClose}>
                                Đóng
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </>
    );
};

export default EditProductModal;
