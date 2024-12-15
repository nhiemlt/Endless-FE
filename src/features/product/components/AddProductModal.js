import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ProductService from '../../../services/ProductService';
import { showNotification } from '../../common/headerSlice';
import CategoryService from '../../../services/CategoryService';
import BrandService from '../../../services/BrandService';
import Select from 'react-select';  // Import react-select

const AddProductModal = ({ onClose, onProductAdded }) => {
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [categories, setCategories] = useState([]); // State cho danh sách danh mục
    const [brands, setBrands] = useState([]);        // State cho danh sách thương hiệu

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoryData = await CategoryService.getCategories({ size: 50 });
                const brandData = await BrandService.getBrands({ size: 50 });
                console.log("Danh mục trong product: ", categoryData.content);
                console.log("Thương hiệu trong product: ", brandData.content);

                if (Array.isArray(categoryData.content)) {
                    setCategories(categoryData.content);
                } else {
                    setCategories([]);
                    dispatch(showNotification({ message: 'Không tìm thấy danh mục!', type: 'error' }));
                }

                if (Array.isArray(brandData.content)) {
                    setBrands(brandData.content);
                } else {
                    setBrands([]);
                    dispatch(showNotification({ message: 'Không tìm thấy thương hiệu!', type: 'error' }));
                }

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
        const selectedCategory = categories.find(cat => cat.categoryID === category?.value);
        const selectedBrand = brands.find(b => b.brandID === brand?.value);

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

        console.log("Submitting new product:", newProduct);
        try {
            await ProductService.addProduct(newProduct);
            dispatch(showNotification({ message: 'Thêm sản phẩm thành công!', status: 1 }));
            resetForm();
            onProductAdded();
            onClose();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
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

    // Map danh mục và thương hiệu cho react-select
    const categoryOptions = categories.map(cat => ({ value: cat.categoryID, label: cat.name }));
    const brandOptions = brands.map(b => ({ value: b.brandID, label: b.brandName }));

    // Custom styles cho react-select
    const customStyles = {
        control: (styles) => ({
            ...styles,
            borderColor: '#D1D5DB', // Màu border khi chưa chọn
            boxShadow: 'none',
            '&:hover': {
                borderColor: '#3B82F6', // Màu xanh nước khi hover
            },
            padding: '0.5rem',
            minHeight: '38px', // Đảm bảo input không bị thu nhỏ
        }),
        option: (styles, { isFocused, isSelected }) => ({
            ...styles,
            backgroundColor: isFocused ? '#E3F2FD' : isSelected ? '#3B82F6' : '#fff', // Màu xanh nước khi hover hoặc khi chọn
            color: isSelected ? '#fff' : '#333',
            cursor: 'pointer',
            padding: '10px',
            ':active': {
                backgroundColor: '#0288D1', // Khi được chọn
            },
        }),
        menu: (styles) => ({
            ...styles,
            maxHeight: '150px', // Giới hạn chiều cao menu
            overflowY: 'auto',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }),
        multiValue: (styles) => ({
            ...styles,
            backgroundColor: '#3B82F6', // Màu xanh nước cho multi value
            color: '#fff',
            borderRadius: '16px',
            padding: '2px 8px',
        }),
        placeholder: (styles) => ({
            ...styles,
            color: '#9CA3AF', // Màu của placeholder
        }),
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
            <dialog className="modal" role="dialog" open>
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Thêm Sản Phẩm</h3>
                    <form className='mt-4' onSubmit={handleSubmit}>
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

                            {/* Sử dụng react-select cho Danh mục và Thương hiệu */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className='font-semibold'>Danh mục:</label>
                                    <Select
                                        value={category}
                                        onChange={setCategory}
                                        options={categoryOptions}
                                        placeholder="Chọn danh mục"
                                        styles={customStyles}
                                    />
                                </div>
                                <div>
                                    <label className='font-semibold'>Thương hiệu:</label>
                                    <Select
                                        value={brand}
                                        onChange={setBrand}
                                        options={brandOptions}
                                        placeholder="Chọn thương hiệu"
                                        styles={customStyles}
                                    />
                                </div>
                            </div>

                            <label className='font-semibold'>Mô tả:</label>
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
