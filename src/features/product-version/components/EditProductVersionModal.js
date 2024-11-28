import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ProductVersionService from '../../../services/productVersionService';
import AttributeSelectionModal from './AttributeSelectionModal'; // Nhập modal thuộc tính ở đây
import UploadFileService from '../../../services/UploadFileService';
import { showNotification } from '../../common/headerSlice';
import ProductService from '../../../services/ProductService';

const EditProductVersionModal = ({ productVersion, onClose, onProductUpdated }) => {
    const [isAttributeModalOpen, setAttributeModalOpen] = useState(false);

    const [productID, setProductID] = useState('');
    const [versionName, setVersionName] = useState('');
    const [price, setPrice] = useState(0);
    const [purchasePrice, setPurchasePrice] = useState(0);
    const [weight, setWeight] = useState(0);
    const [height, setHeight] = useState(0);
    const [length, setLength] = useState(0);
    const [width, setWidth] = useState(0);
    const [image, setImage] = useState('');
    const [previewLogo, setPreviewLogo] = useState(null);
    const [attributes, setAttributes] = useState([]);
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const [products, setProducts] = useState([]); // State để lưu danh sách sản phẩm



    // Gọi API để lấy danh sách sản phẩm
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await ProductService.getProducts(); // Giả sử hàm này lấy danh sách sản phẩm

                setProducts(response.content); // Cập nhật state với danh sách sản phẩm
            } catch (error) {
                console.error('Lỗi khi lấy danh sách sản phẩm:', error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        if (productVersion) {

            console.log("Product Version data:", productVersion); // Kiểm tra dữ liệu đầu vào
            setProductID(productVersion.product?.productID || '');
            setVersionName(productVersion.versionName || '');
            setPrice(productVersion.price || 0);
            setPurchasePrice(productVersion.purchasePrice || 0);
            setWeight(productVersion.weight || 0);
            setHeight(productVersion.height || 0);
            setLength(productVersion.length || 0);
            setWidth(productVersion.width || 0);
            setImage(productVersion.image || '');
            // setAttributes(productVersion.attributes || []);

            setAttributes(
                productVersion.versionAttributes?.map(attr => ({
                    attributeName: attr.attributeName,
                    attributeValue: attr.attributeValue,
                    attributeValueID: attr.attributeValueID,
                    isChecked: true // hoặc false nếu mặc định là chưa chọn
                })) || []
            );
            // Cập nhật ảnh xem trước nếu có ảnh từ productVersion
            setPreviewLogo(productVersion.image || '');
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
                    setImage(downloadURL);
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
    const openAttributeModal = () => {
        setAttributeModalOpen(true);
    };

    const handleAddAttribute = (newAttribute) => {
        // console.log("Adding new attribute:", newAttribute); // Kiểm tra dữ liệu thuộc tính thêm mới
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
        setImage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Kiểm tra giá bán không được nhỏ hơn giá gốc
        if (price < purchasePrice) {
            dispatch(showNotification({
                message: 'Giá bán không được nhỏ hơn giá gốc.',
                status: 0,
            }));
            return; // Dừng thực hiện nếu có lỗi
        }

        const selectedAttributes = attributes.filter((attr) => attr.isChecked);
        const selectedAttributeValueID = selectedAttributes.map(attr => attr.attributeValueID);

        // if (selectedAttributes.length === 0) {
        //     setError('Vui lòng chọn ít nhất một thuộc tính');
        //     return;
        // }

        // Upload ảnh nếu có thay đổi
        if (previewLogo) {
            try {
                const downloadURL = await UploadFileService.uploadProductImage(previewLogo);
                setImage(downloadURL);
                // dispatch(showNotification({ message: 'Tải ảnh lên thành công!', status: 1 }));
            } catch (error) {
                dispatch(showNotification({ message: 'Lỗi khi tải ảnh lên.', status: 0 }));
                resetImage();
                return;
            }
        }

        const updatedProductVersionData = {
            productID, // Thêm productID vào đây
            versionName,
            price: parseFloat(price),
            purchasePrice: parseFloat(purchasePrice),
            weight: parseFloat(weight),
            height: parseFloat(height),
            length: parseFloat(length),
            width: parseFloat(width),
            attributeValueID: selectedAttributeValueID,
            image: image,
        };
        console.log("Updated data to submit:", updatedProductVersionData); // Xác nhận dữ liệu

        try {
            const result = await ProductVersionService.updateProductVersion(productVersion.productVersionID, updatedProductVersionData);
            dispatch(showNotification({ message: 'Cập nhật phiên bản sản phẩm thành công!', status: 1 }));
            // Truyền kết quả cập nhật về component cha
            if (onProductUpdated) onProductUpdated(result); // truyền `result` thay vì không có tham số
            onClose();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message === 'Phiên bản sản phẩm với tên này đã tồn tại') {
                dispatch(showNotification({ message: 'Tên phiên bản sản phẩm đã tồn tại, vui lòng chọn tên khác.', status: 0 }));
            } else {
                dispatch(showNotification({ message: 'Cập nhật phiên bản sản phẩm thất bại!', status: 0 }));
            }
            // dispatch(showNotification({ message: 'Cập nhật phiên bản sản phẩm thất bại!', status: 0 }));
            // setError('Có lỗi xảy ra khi cập nhật phiên bản sản phẩm.');
            // console.error("Error updating product version:", error.response?.data || error.message);
            setError('Có lỗi xảy ra khi cập nhật phiên bản sản phẩm.');

        }
        console.log(productVersion.productVersionID);

    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
            <dialog className="modal modal-open" role="dialog">
                <div className="modal-box w-11/12 max-w-4xl">
                    <h3 className="font-bold text-lg">Chỉnh Sửa Phiên Bản Sản Phẩm</h3>
                    <form className="mt-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-6">

                            <label >
                                <span className="block text-sm font-medium mb-2">Chọn Sản Phẩm</span>
                                <select
                                    className="select select-bordered w-full"
                                    required
                                    value={productID}
                                    onChange={(e) => setProductID(e.target.value)}
                                >
                                    <option value="">Chọn Sản Phẩm</option>
                                    {products.map((product, index) => (
                                        <option key={product.productID || index} value={product.productID}>
                                            {product.name}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            {/* Tên Phiên Bản */}
                            <label>
                                <span className="block text-sm font-medium mb-2">Tên Phiên Bản</span>
                                <input
                                    type="text"
                                    placeholder="Tên Phiên Bản"
                                    className={`input input-bordered w-full ${error && versionName && error.includes("Tên phiên bản") ? "border-red-500" : ""
                                        }`}
                                    value={versionName}
                                    onChange={(e) => setVersionName(e.target.value)}
                                    required
                                />
                            </label>

                            {/* Giá Bán */}
                            <label>
                                <span className="block text-sm font-medium mb-2">Giá Gốc</span>
                                <input
                                    type="number"
                                    placeholder="Giá Gốc"
                                    className="input input-bordered w-full"
                                    value={purchasePrice}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        if (value >= 0 && value <= 1_000_000_000) {
                                            setPurchasePrice(value);
                                        } else {
                                            dispatch(
                                                showNotification({
                                                    message: "Giá bán phải lớn hơn hoặc bằng 0 và không vượt quá 1 tỷ",
                                                    status: 0,
                                                })
                                            );
                                        }
                                    }}
                                    required
                                />
                            </label>

                            {/* Giá Gốc */}
                            <label>
                                <span className="block text-sm font-medium mb-2">Giá Bán</span>
                                <input
                                    type="number"
                                    placeholder="Giá Bán"
                                    className="input input-bordered w-full"
                                    value={price}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        if (value >= 0 && value <= 1_000_000_000) {
                                            setPrice(value);
                                        } else {
                                            dispatch(
                                                showNotification({
                                                    message: "Giá gốc phải lớn hơn hoặc bằng 0 và không vượt quá 1 tỷ",
                                                    status: 0,
                                                })
                                            );
                                        }
                                    }}
                                    required
                                />
                            </label>

                            {/* Trọng Lượng */}
                            <label>
                                <span className="block text-sm font-medium mb-2">Trọng Lượng</span>
                                <input
                                    type="number"
                                    placeholder="Trọng Lượng"
                                    className="input input-bordered w-full"
                                    value={weight}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        if (value >= 0 && value <= 1_000_000_000) {
                                            setWeight(value);
                                        } else {
                                            dispatch(
                                                showNotification({
                                                    message: "Trọng lượng phải lớn hơn hoặc bằng 0 và không vượt quá 1 tỷ",
                                                    status: 0,
                                                })
                                            );
                                        }
                                    }}
                                    required
                                />
                            </label>

                            {/* Chiều Cao */}
                            <label>
                                <span className="block text-sm font-medium mb-2">Chiều Cao</span>
                                <input
                                    type="number"
                                    placeholder="Chiều Cao"
                                    className="input input-bordered w-full"
                                    value={height}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        if (value >= 0 && value <= 1_000_000_000) {
                                            setHeight(value);
                                        } else {
                                            dispatch(
                                                showNotification({
                                                    message: "Chiều cao phải lớn hơn hoặc bằng 0 và không vượt quá 1 tỷ",
                                                    status: 0,
                                                })
                                            );
                                        }
                                    }}
                                    required
                                />
                            </label>

                            {/* Chiều Dài */}
                            <label>
                                <span className="block text-sm font-medium mb-2">Chiều Dài</span>
                                <input
                                    type="number"
                                    placeholder="Chiều Dài"
                                    className="input input-bordered w-full"
                                    value={length}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        if (value >= 0 && value <= 1_000_000_000) {
                                            setLength(value);
                                        } else {
                                            dispatch(
                                                showNotification({
                                                    message: "Chiều dài phải lớn hơn hoặc bằng 0 và không vượt quá 1 tỷ",
                                                    status: 0,
                                                })
                                            );
                                        }
                                    }}
                                    required
                                />
                            </label>

                            {/* Chiều Rộng */}
                            <label>
                                <span className="block text-sm font-medium mb-2">Chiều Rộng</span>
                                <input
                                    type="number"
                                    placeholder="Chiều Rộng"
                                    className="input input-bordered w-full"
                                    value={width}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        if (value >= 0 && value <= 1_000_000_000) {
                                            setWidth(value);
                                        } else {
                                            dispatch(
                                                showNotification({
                                                    message: "Chiều rộng phải lớn hơn hoặc bằng 0 và không vượt quá 1 tỷ",
                                                    status: 0,
                                                })
                                            );
                                        }
                                    }}
                                    required
                                />
                            </label>
                            {/* Hình ảnh */}
                            <div className="mb-4">
                                <input id="logoInput" type="file" onChange={handleImageChange} className="hidden" />
                                <div className="h-40 flex justify-center items-center rounded-lg bg-cover cursor-pointer"
                                    onClick={() => document.getElementById('logoInput').click()}>
                                    {previewLogo ? (
                                        <img src={previewLogo} alt="Tải ảnh thất bại" className="h-full object-cover rounded-lg" />
                                    ) : (
                                        <span className="text-gray-400 opacity-75"> <img
                                            className="w-24"
                                            src="https://icons.veryicon.com/png/o/miscellaneous/user-interface-flat-multicolor/5725-select-image.png"
                                            alt="Tải lên hình ảnh"
                                        /></span>
                                    )}
                                </div>
                            </div>

                            {/* Chọn thuộc tính */}
                            <div className="mb-4">
                                <h4 className="font-bold">Chọn Thuộc Tính:</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {attributes.map((attr, index) => (
                                        <div key={index} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={attr.isChecked}
                                                onChange={() => {
                                                    const updatedAttributes = [...attributes];
                                                    updatedAttributes[index] = {
                                                        ...updatedAttributes[index],
                                                        isChecked: !updatedAttributes[index].isChecked,
                                                    };
                                                    setAttributes(updatedAttributes);
                                                }}
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
                            <button type="submit" className="btn btn-outline btn-sm btn-primary">Cập nhật</button>
                            <button type="button" className="btn btn-outline btn-sm btn-secondary" onClick={onClose}>Đóng</button>
                        </div>
                    </form>
                </div>
            </dialog>

            {isAttributeModalOpen && (
                <AttributeSelectionModal
                    isOpen={isAttributeModalOpen}
                    onClose={() => setAttributeModalOpen(false)}
                    onAddAttribute={handleAddAttribute}
                />
            )}
        </>
    );
};

export default EditProductVersionModal;
