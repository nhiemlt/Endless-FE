import React, { useState, useEffect } from 'react';
import UploadFileService from '../../../services/UploadFileService'; // Thay đổi đường dẫn
import BrandService from '../../../services/BrandService'; // Thay đổi đường dẫn
import { showNotification } from '../../common/headerSlice'; // Đường dẫn đúng
import { useDispatch } from 'react-redux';

const EditBrandModal = ({ onClose, onBrandUpdated, brand }) => {
    const [brandName, setBrandName] = useState('');
    const [brandLogo, setBrandLogo] = useState(null);
    const [previewLogo, setPreviewLogo] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (brand) {
            setBrandName(brand.brandName);
            setPreviewLogo(brand.logo);
            setBrandLogo(null);
        }
    }, [brand]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        // Kiểm tra định dạng tệp
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (file && validImageTypes.includes(file.type)) {
            setBrandLogo(file);
            setPreviewLogo(URL.createObjectURL(file));
        } else {
            // Thông báo lỗi định dạng
            dispatch(showNotification({ message: 'Định dạng tệp không hợp lệ! Vui lòng chọn hình ảnh (JPEG, PNG, GIF).', status: 0 }));
            resetImage(); // Reset hình ảnh nếu không hợp lệ
        }
    };

    const resetImage = () => {
        setBrandLogo(null);
        setPreviewLogo(brand.logo); // Giữ lại logo cũ nếu không có logo mới
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let logoUrl = brand.logo; // Giữ nguyên giá trị logo cũ

            if (brandLogo) {
                // Nếu có logo mới, tải lên và lấy URL mới
                logoUrl = await UploadFileService.uploadBrandImage(brandLogo, brand.logo);
            }

            // Cập nhật thương hiệu với logo mới hoặc cũ
            const updatedBrand = await BrandService.updateBrand(brand.brandID, { name: brandName, logo: logoUrl });
            onBrandUpdated(updatedBrand);
            dispatch(showNotification({ message: 'Cập nhật thương hiệu thành công!', status: 1 }));
            resetForm();
            onClose();
        } catch (error) {
            console.error("Error updating brand:", error);
            dispatch(showNotification({ message: 'Cập nhật thương hiệu thất bại!', status: 0 }));
        }
    };

    const resetForm = () => {
        setBrandName('');
        resetImage();
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
            <dialog id="edit_brand_modal" className="modal" role="dialog" open>
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Cập nhật Thương Hiệu</h3>
                    <form className='mt-4' onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <input
                                type="text"
                                value={brandName}
                                onChange={(e) => setBrandName(e.target.value)}
                                placeholder="Tên thương hiệu"
                                className="input input-bordered w-full"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <input id="logoInput" type="file" onChange={handleImageChange} className="hidden" />
                            <div className="h-40 flex justify-center items-center rounded-lg bg-cover cursor-pointer" onClick={() => document.getElementById('logoInput').click()}>
                                {previewLogo ? (
                                    <img src={previewLogo} alt="Tải ảnh thất bại" className="h-full object-cover rounded-lg" />
                                ) : (
                                    <span className="text-gray-400 opacity-75">  <img
                                        className="w-24"
                                        src="https://icons.veryicon.com/png/o/miscellaneous/user-interface-flat-multicolor/5725-select-image.png"
                                        alt="Tải lên hình ảnh"
                                    /></span>
                                )}
                            </div>
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

export default EditBrandModal;
