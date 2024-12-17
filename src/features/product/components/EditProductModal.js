import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ProductService from '../../../services/ProductService';
import { showNotification } from '../../common/headerSlice';
import Select from 'react-select';  // Import react-select
import CategoryService from '../../../services/CategoryService';
import BrandService from '../../../services/BrandService';

const EditProductModal = ({ product, onClose, onProductUpdated }) => {
    const [productName, setProductName] = useState(product.name || '');
    const [category, setCategory] = useState(product.categoryID || ''); // Lưu ID danh mục
    const [brand, setBrand] = useState(product.brandID || ''); // Lưu ID thương hiệu
    const [description, setDescription] = useState(product.description || '');
    const [categories, setCategories] = useState([]); // Lưu danh sách categories
    const [brands, setBrands] = useState([]); // Lưu danh sách brands
    const dispatch = useDispatch();

    // Lấy danh mục và thương hiệu
    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesData = await CategoryService.getCategories({ size: 50 }); // Lấy categories
                const brandsData = await BrandService.getBrands({ size: 50 }); // Lấy brands
                setCategories(categoriesData.content);
                setBrands(brandsData.content);
            } catch (error) {
                dispatch(showNotification({ message: "Lấy dữ liệu thất bại!", status: 0 }));
            }
        };
        fetchData();
    }, [dispatch]);

    useEffect(() => {
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
            const errorMessage = error.response?.data?.message || "Cập nhật sản phẩm thất bại!";
            dispatch(showNotification({ message: errorMessage, status: 0 }));
        }
    };

    // Chuyển categories và brands thành options cho react-select
    const categoryOptions = categories.map((cat) => ({
        value: cat.categoryID,
        label: cat.name,
    }));

    const brandOptions = brands.map((b) => ({
        value: b.brandID,
        label: b.brandName,
    }));

    // Custom styles cho react-select
    const customStyles = {
        control: (styles) => ({
            ...styles,
            borderColor: '#D1D5DB',
            boxShadow: 'none',
            '&:hover': {
                borderColor: '#3B82F6',
            },
            padding: '0.5rem',
            minHeight: '38px',
        }),
        option: (styles, { isFocused, isSelected }) => ({
            ...styles,
            backgroundColor: isFocused ? '#E3F2FD' : isSelected ? '#3B82F6' : '#fff',
            color: isSelected ? '#fff' : '#333',
            cursor: 'pointer',
            padding: '10px',
        }),
        menu: (styles) => ({
            ...styles,
            maxHeight: '150px',
            overflowY: 'auto',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }),
    };

    return (
        <div>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
            <dialog className="modal" role="dialog" open>
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Cập nhật sản phẩm</h3>
                    <form className="mt-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-4">
                            <label className='font-semibold'>Tên sản phẩm</label>
                            <input
                                type="text"
                                placeholder="Nhập tên sản phẩm..."
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                className="input input-bordered w-full"
                                required
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className='font-semibold'>Danh mục:</label>
                                    <Select
                                        value={categoryOptions.find(option => option.value === category)}
                                        onChange={(selectedOption) => setCategory(selectedOption?.value || '')}
                                        options={categoryOptions}
                                        styles={customStyles}
                                        placeholder="Chọn danh mục"
                                    />
                                </div>
                                <div>
                                    <label className='font-semibold'>Thương hiệu</label>
                                    <Select
                                        value={brandOptions.find(option => option.value === brand)}
                                        onChange={(selectedOption) => setBrand(selectedOption?.value || '')}
                                        options={brandOptions}
                                        styles={customStyles}
                                        placeholder="Chọn thương hiệu"
                                    />
                                </div>
                            </div>
                            <label className='font-semibold'>Mô tả</label>
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
        </div>
    );
};

export default EditProductModal;
