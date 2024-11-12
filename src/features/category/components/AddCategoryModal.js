import React, { useState } from 'react';
import CategoryService from '../../../services/CategoryService'; // Đường dẫn dịch vụ danh mục
import { showNotification } from '../../common/headerSlice'; // Đường dẫn đúng
import { useDispatch } from 'react-redux';

const AddCategoryModal = ({ onClose, onCategoryAdded }) => {
    const [categoryName, setCategoryName] = useState(''); // Chỉ giữ lại trường tên danh mục
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!categoryName) {
            dispatch(showNotification({ message: 'Tên danh mục không được để trống!', status: 0 }));
            return;
        }
        try {
            const newCategory = { name: categoryName };
            const createdCategory = await CategoryService.createCategory(newCategory);
            onCategoryAdded(createdCategory);
            dispatch(showNotification({ message: 'Thêm danh mục thành công!', status: 1 }));
            resetForm();
            onClose();
        } catch (error) {
            console.error("Lỗi khi thêm danh mục:", error);

            // Xử lý thông báo cụ thể
            if (error.message.includes("Tên danh mục đã tồn tại")) {
                dispatch(showNotification({ message: 'Tên danh mục đã tồn tại!', status: 0 }));
            } else {
                dispatch(showNotification({ message: 'Thêm danh mục không thành công!', status: 0 }));
            }
        }
    };

    const resetForm = () => {
        setCategoryName(''); // Đặt lại tên danh mục
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
            <dialog id="add_category_modal" className="modal" role="dialog" open>
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Thêm Danh Mục</h3>
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
                            <button type="submit" className="btn btn-outline btn-sm btn-primary">Lưu</button>
                            <button type="button" className="btn btn-outline btn-sm btn-secondary" onClick={onClose}>Đóng</button>
                        </div>
                    </form>
                </div>
            </dialog>
        </>
    );
};

export default AddCategoryModal;
