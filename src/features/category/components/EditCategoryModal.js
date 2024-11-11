import React, { useState, useEffect } from 'react';
import CategoryService from '../../../services/CategoryService'; // Đường dẫn dịch vụ danh mục
import { showNotification } from '../../common/headerSlice'; // Đường dẫn đúng
import { useDispatch } from 'react-redux';

const EditCategoryModal = ({ onClose, onCategoryUpdated, category }) => {
    const [categoryName, setCategoryName] = useState(''); // Sử dụng categoryName thay vì brandName
    const dispatch = useDispatch();

    useEffect(() => {
        if (category) {
            setCategoryName(category.name); // Lấy tên danh mục từ đối tượng category
        }
    }, [category]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedCategory = await CategoryService.updateCategory(category.categoryID, { name: categoryName });

            onCategoryUpdated(updatedCategory); // Gọi hàm callback khi danh mục được cập nhật
            dispatch(showNotification({ message: 'Cập nhật danh mục thành công!', status: 1 })); // Thông báo thành công
            resetForm(); // Đặt lại form
            onClose(); // Đóng modal sau khi cập nhật
        } catch (error) {
            console.error("Lỗi khi cập nhật danh mục:", error);
            dispatch(showNotification({ message: 'Cập nhật danh mục không thành công!', status: 0 })); // Thông báo lỗi
        }
    };

    const resetForm = () => {
        setCategoryName(''); // Đặt lại tên danh mục
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
            <dialog id="edit_category_modal" className="modal" role="dialog" open>
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Cập nhật Danh Mục</h3>
                    <form className='mt-4' onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <input
                                type="text"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                placeholder="Tên danh mục"
                                className="input input-bordered w-full"
                                required
                            />
                        </div>

                        <div className="modal-action">
                            <button type="submit" className="btn btn-outline btn-sm btn-primary">Cập nhật</button>
                            <button type="button" className="btn btn-outline btn-sm btn-secondary" onClick={onClose}>Đóng</button>
                        </div>
                    </form>
                </div>
            </dialog>
        </>
    );
};

export default EditCategoryModal;
