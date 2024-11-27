import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ProductService from '../../../services/ProductService';
import { showNotification } from '../../common/headerSlice';

const AddProductModal = ({ onClose, onProductAdded }) => {
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [categories, setCategories] = useState([]); // State cho danh sách danh mục
    const [brands, setBrands] = useState([]); // State cho danh sách thương hiệu

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoryData = await ProductService.getCategories();
                const brandData = await ProductService.getBrands();

                setCategories(Array.isArray(categoryData) ? categoryData : []);
                setBrands(Array.isArray(brandData) ? brandData : []);
            } catch (error) {
                console.error('Error fetching categories and brands:', error);
                dispatch(showNotification({ message: 'Không thể tải danh mục hoặc thương hiệu!', type: 'error' }));
            }
        };

        fetchData();
    }, [dispatch]);



    const handleSubmit = async (e) => {
        e.preventDefault();

        // Tìm danh mục và thương hiệu dựa trên ID
        const selectedCategory = categories.find(cat => cat.categoryID === category);
        const selectedBrand = brands.find(b => b.brandID === brand);

        const newProduct = {
            name: productName,
            description,
            categoryID: selectedCategory ? selectedCategory.categoryID : null,
            brandID: selectedBrand ? selectedBrand.brandID : null,
        };

        // Kiểm tra giá trị của categoryID và brandID
        if (!newProduct.categoryID || !newProduct.brandID) {
            alert('Vui lòng chọn danh mục và thương hiệu hợp lệ!');
            return; // Không tiếp tục nếu không có danh mục hoặc thương hiệu
        }

        console.log("Submitting new product:", newProduct); // Kiểm tra giá trị trước khi gửi
        try {
            await ProductService.addProduct(newProduct);
            dispatch(showNotification({ message: 'Thêm sản phẩm thành công!', status: 1 })); // Thông báo thành công
            resetForm();
            onProductAdded(); // Gọi lại để cập nhật danh sách sản phẩm
            onClose(); // Đóng modal
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                // Hiển thị thông báo lỗi từ server
                dispatch(showNotification({ message: error.response.data.message, status: 0 }));
            } else {
                dispatch(showNotification({ message: 'Thêm sản phẩm thất bại!', status: 0 }));
            }
        }
    };







    const resetForm = () => {
        setProductName('');
        setDescription('');
        setCategory('');
        setBrand('');
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
            <dialog className="modal" role="dialog" open>
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Thêm Sản Phẩm</h3>
                    <form className='mt-4' onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-4">
                            {/* Input tên sản phẩm trên một hàng */}
                            <label>Tên sản phẩm</label>

                            <input
                                type="text"
                                placeholder="Nhập tên sản phẩm..."
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                className="input input-bordered w-full"
                                required
                            />
                            {/* Hai combobox đứng cùng một hàng */}
                            <div className="grid grid-cols-2 gap-4">
                                <select
                                    value={category}
                                    onChange={(e) => {
                                        setCategory(e.target.value);
                                    }}
                                    className="select select-bordered w-full"
                                    required
                                >
                                    <option value="">Chọn danh mục</option>
                                    {categories.map((cat, index) => (
                                        <option key={`${cat.categoryID}-${index}`} value={cat.categoryID}>{cat.name}</option>
                                    ))}
                                </select>

                                <select
                                    value={brand}
                                    onChange={(e) => {
                                        setBrand(e.target.value);
                                    }}
                                    className="select select-bordered w-full"
                                    required
                                >
                                    <option value="">Chọn thương hiệu</option>
                                    {brands.map((b, index) => (
                                        <option key={`${b.brandID}-${index}`} value={b.brandID}>{b.brandName}</option>
                                    ))}
                                </select>



                            </div>
                            {/* Mô tả sản phẩm trên một hàng */}
                            <label>Mô tả:</label>
                            <textarea
                                placeholder="Nhập mô tả..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="textarea textarea-bordered w-full"
                                rows="3"
                            ></textarea>
                        </div>

                        <div className="modal-action mt-4">
                            <button type="submit" className="btn btn-outline btn-sm btn-primary">Thêm</button>
                            <button type="button" className="btn btn-outline btn-sm btn-secondary" onClick={onClose}>Đóng</button>
                        </div>
                    </form>
                </div>
            </dialog>
        </>
    );
};

export default AddProductModal;
