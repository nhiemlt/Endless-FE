import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ProductService from '../../../services/ProductService';
import ProductVersionService from '../../../services/productVersionService';
import AttributeSelectionModal from './AttributeSelectionModal'; // Nhập modal thuộc tính ở đây
import UploadFileService from '../../../services/UploadFileService';
import { showNotification } from '../../common/headerSlice';

const EditProductVersionModal = ({ productVersion, onClose, onProductUpdated }) => {
    const [isAttributeModalOpen, setAttributeModalOpen] = useState(false);

    const [versionName, setVersionName] = useState('');
    const [price, setPrice] = useState(0);
    const [purchasePrice, setPurchasePrice] = useState(0);
    const [weight, setWeight] = useState(0);
    const [height, setHeight] = useState(0);
    const [length, setLength] = useState(0);
    const [width, setWidth] = useState(0);
    const [imageUrl, setImageUrl] = useState('');
    const [previewLogo, setPreviewLogo] = useState(null);
    const [attributes, setAttributes] = useState([]);
    const [error, setError] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        if (productVersion) {
            setVersionName(productVersion.versionName);
            setPrice(productVersion.price);
            setPurchasePrice(productVersion.purchasePrice);
            setWeight(productVersion.weight);
            setHeight(productVersion.height);
            setLength(productVersion.length);
            setWidth(productVersion.width);
            setImageUrl(productVersion.image);
            setAttributes(productVersion.attributes || []);
        }
    }, [productVersion]);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

        if (file) {
            if (validImageTypes.includes(file.type)) {
                try {
                    const uploadTask = UploadFileService.uploadProductImage(file);
                    const downloadURL = await uploadTask;
                    setImageUrl(downloadURL);
                    setPreviewLogo(URL.createObjectURL(file));
                } catch (error) {
                    dispatch(showNotification({ message: 'Lỗi khi tải ảnh lên.', status: 0 }));
                    resetImage();
                }
            } else {
                dispatch(showNotification({ message: 'Định dạng tệp không hợp lệ!', status: 0 }));
                resetImage();
            }
        }
    };

    const handleAddAttribute = (newAttribute) => {
        const existingAttribute = attributes.find(
            (attr) => attr.attributeName === newAttribute.attributeName
        );
        if (existingAttribute) {
            setError(`Thuộc tính ${newAttribute.attributeName} đã được thêm.`);
        } else {
            // Thêm thuộc tính mới với attributeValueID
            setAttributes((prevAttributes) => [
                ...prevAttributes,
                {
                    ...newAttribute,
                    isChecked: false,
                    attributeValueID: newAttribute.attributeValueID // Lưu lại attributeValueID
                }]);
            setAttributeModalOpen(false);
            setError('');
        }
    };

    const resetImage = () => {
        setPreviewLogo(null);
        setImageUrl('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra tên phiên bản có trùng không
        const existingVersion = await ProductVersionService.checkVersionName(versionName);
        if (existingVersion) {
            setError('Tên phiên bản đã tồn tại.');
            return;
        }

        const selectedAttributes = attributes.filter((attr) => attr.isChecked);
        const selectedAttributeValueID = selectedAttributes.map(attr => attr.attributeValueID);

        if (selectedAttributes.length === 0) {
            setError('Vui lòng chọn ít nhất một thuộc tính');
            return;
        }

        // Upload ảnh nếu có thay đổi
        if (previewLogo) {
            try {
                const downloadURL = await UploadFileService.uploadProductImage(previewLogo);
                setImageUrl(downloadURL);
                dispatch(showNotification({ message: 'Tải ảnh lên thành công!', status: 1 }));
            } catch (error) {
                dispatch(showNotification({ message: 'Lỗi khi tải ảnh lên.', status: 0 }));
                resetImage();
                return;
            }
        }

        const updatedProductVersionData = {
            versionName,
            price: parseFloat(price),
            purchasePrice: parseFloat(purchasePrice),
            weight: parseFloat(weight),
            height: parseFloat(height),
            length: parseFloat(length),
            width: parseFloat(width),
            attributeValueID: selectedAttributeValueID,
            image: imageUrl,
        };

        try {
            const result = await ProductVersionService.updateProductVersion(productVersion.productVersionID, updatedProductVersionData);
            dispatch(showNotification({ message: 'Cập nhật phiên bản sản phẩm thành công!', status: 1 }));
            if (onProductUpdated) onProductUpdated();
            onClose();
        } catch (error) {
            dispatch(showNotification({ message: 'Cập nhật phiên bản sản phẩm thất bại!', status: 0 }));
            setError('Có lỗi xảy ra khi cập nhật phiên bản sản phẩm.');
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
            <dialog className="modal modal-open" role="dialog">
                <div className="modal-box w-11/12 max-w-4xl">
                    <h3 className="font-bold text-lg">Thêm Phiên Bản Sản Phẩm</h3>
                    <form className="mt-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            <select
                                className="select select-bordered"
                                required
                                placeholder="Chọn Sản Phẩm"
                            // value={selectedProduct}  // selectedProduct sẽ là ID của sản phẩm
                            // onChange={(e) => setSelectedProduct(e.target.value)}  // setSelectedProduct cập nhật giá trị ID của sản phẩm
                            >
                                <option value="">Chọn Sản Phẩm</option>

                            </select>




                            <input
                                type="text"
                                placeholder="Tên Phiên Bản"
                                className={`input input-bordered ${error && versionName && error.includes("Tên phiên bản") ? 'border-red-500' : ''}`}
                                value={versionName}
                                onChange={(e) => setVersionName(e.target.value)}
                                required
                            />

                            <input
                                type="number"
                                placeholder="Giá Gốc"
                                className="input input-bordered focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={price}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    if (value >= 0 && value <= 1_000_000_000) {  // Kiểm tra số âm và không vượt quá 1 tỷ
                                        setPrice(value);
                                    } else {
                                        dispatch(showNotification({ message: 'Giá gốc phải lớn hơn hoặc bằng 0 và không vượt quá 1 tỷ', status: 0 }));

                                    }
                                }}
                                required
                            />

                            <input
                                type="number"
                                placeholder="Giá Bán"
                                className="input input-bordered focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={purchasePrice}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    if (value >= 0 && value <= 1_000_000_000) {
                                        setPurchasePrice(value);
                                    } else {
                                        dispatch(showNotification({ message: 'Giá bán phải lớn hơn hoặc bằng 0 và không vượt quá 1 tỷ', status: 0 }));
                                    }
                                }}
                                required
                            />

                            <input
                                type="number"
                                placeholder="Trọng Lượng"
                                className="input input-bordered focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={weight}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    if (value >= 0 && value <= 1_000_000_000) {
                                        setWeight(value);
                                    } else {
                                        dispatch(showNotification({ message: 'Trọng lượng phải lớn hơn hoặc bằng 0 và không vượt quá 1 tỷ', status: 0 }));
                                    }
                                }}
                                required
                            />

                            <input
                                type="number"
                                placeholder="Chiều Cao"
                                className="input input-bordered focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={height}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    if (value >= 0 && value <= 1_000_000_000) {
                                        setHeight(value);
                                    } else {
                                        dispatch(showNotification({ message: 'Chiều cao phải lớn hơn hoặc bằng 0 và không vượt quá 1 tỷ', status: 0 }));
                                    }
                                }}
                                required
                            />

                            <input
                                type="number"
                                placeholder="Chiều Dài"
                                className="input input-bordered focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={length}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    if (value >= 0 && value <= 1_000_000_000) {
                                        setLength(value);
                                    } else {
                                        dispatch(showNotification({ message: 'Chiều dài phải lớn hơn hoặc bằng 0 và không vượt quá 1 tỷ', status: 0 }));
                                    }
                                }}
                                required
                            />

                            <input
                                type="number"
                                placeholder="Chiều Rộng"
                                className="input input-bordered focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={width}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    if (value >= 0 && value <= 1_000_000_000) {
                                        setWidth(value);
                                    } else {
                                        dispatch(showNotification({ message: 'Chiều rộng phải lớn hơn hoặc bằng 0 và không vượt quá 1 tỷ', status: 0 }));
                                    }
                                }}
                                required
                            />


                            <div className="mb-4">
                                <input id="logoInput" type="file" onChange={handleImageChange} className="hidden" />
                                <div className="h-40 flex justify-center items-center rounded-lg bg-cover cursor-pointer" onClick={() => document.getElementById('logoInput').click()}>
                                    {previewLogo ? (
                                        <img src={previewLogo} alt="Preview" className="h-full object-cover rounded-lg" />
                                    ) : (
                                        <span className="text-gray-400 opacity-75">Chọn ảnh</span>
                                    )}
                                </div>
                            </div>

                            <div className="mb-4">
                                <h4 className="font-bold">Chọn Thuộc Tính:</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {attributes.map((attr, index) => (
                                        <div key={index} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={attr.isChecked}
                                                // onChange={() => handleCheckboxChange(index)}
                                                className="mr-2"
                                            />
                                            <span>{`${attr.attributeName}: ${attr.attributeValue}`}</span>
                                        </div>
                                    ))}
                                </div>
                                {error && <p className="text-red-500">{error}</p>}
                            </div>
                        </div>

                        <div className="modal-action mt-4">
                            <button type="button" className="btn btn-outline btn-sm btn-primary" onClick={() => setAttributeModalOpen(true)}>
                                Thêm thuộc tính
                            </button>
                            <button type="submit" className="btn btn-outline btn-sm btn-primary">Thêm</button>
                            <button type="button" className="btn btn-outline btn-sm btn-secondary" onClick={onClose}>Đóng</button>
                        </div>
                    </form>
                </div>
            </dialog>

            {/* Modal thuộc tính */}
            {isAttributeModalOpen && (
                <AttributeSelectionModal
                    attributes={attributes} onAddAttribute={handleAddAttribute} onClose={() => setAttributeModalOpen(false)} />
            )}
        </>
    );
};

export default EditProductVersionModal;
