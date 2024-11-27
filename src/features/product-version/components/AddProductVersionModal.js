import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../common/headerSlice';
import AttributeSelectionModal from './AttributeSelectionModal'; // Nhập modal thuộc tính ở đây
import ProductVersionService from '../../../services/productVersionService';
import UploadFileService from '../../../services/UploadFileService';
import ProductService from '../../../services/ProductService'; // Service để gọi API lấy sản phẩm



const AddProductVersionModal = ({ onClose, onProductAdded }) => {

    const [isAttributeModalOpen, setAttributeModalOpen] = useState(false);
    const [selectedValueID, setSelectedValueID] = useState(null); // Thay đổi từ 'selectedValue' sang 'selectedValueID'
    const [attributes, setAttributes] = useState([]);
    const [error, setError] = useState('');
    const [versionName, setVersionName] = useState('');
    const [price, setPrice] = useState(0);
    const [purchasePrice, setPurchasePrice] = useState(0);
    const [weight, setWeight] = useState(0);
    const [height, setHeight] = useState(0);
    const [length, setLength] = useState(0);
    const [width, setWidth] = useState(0);
    const [imageUrl, setImageUrl] = useState('');
    const [previewLogo, setPreviewLogo] = useState(null); // Biến để xem trước ảnh
    const [products, setProducts] = useState([]); // State để lưu danh sách sản phẩm
    const [selectedProduct, setSelectedProduct] = useState(''); // State để lưu sản phẩm đã chọn
    const dispatch = useDispatch();

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


    const handleCheckboxChange = (index) => {
        // Toggle trạng thái checkbox xác nhận thuộc tính
        setAttributes((prevAttributes) =>
            prevAttributes.map((attr, i) =>
                i === index ? { ...attr, isChecked: !attr.isChecked } : attr
            )
        );
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

        if (file) {
            if (validImageTypes.includes(file.type)) {
                try {
                    // Tải ảnh lên Firebase Storage (hoặc dịch vụ tương tự)
                    const uploadTask = UploadFileService.uploadProductImage(file);
                    const downloadURL = await uploadTask; // Nhận URL của ảnh sau khi tải lên
                    setImageUrl(downloadURL); // Lưu URL vào state
                    setPreviewLogo(URL.createObjectURL(file)); // Cập nhật ảnh preview
                } catch (error) {
                    dispatch(showNotification({ message: 'Lỗi khi tải ảnh lên.', status: 0 }));
                    resetImage(); // Đặt lại ảnh nếu tải lên thất bại
                }
            } else {
                dispatch(showNotification({ message: 'Định dạng tệp không hợp lệ!', status: 0 }));
                resetImage(); // Đặt lại ảnh nếu định dạng không hợp lệ
            }
        }
    };

    const resetImage = () => {
        setPreviewLogo(null);
        setImageUrl(''); // Đảm bảo không có URL nếu ảnh không hợp lệ hoặc chưa tải lên
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
        console.log("AttributeValue:", selectedAttributes);

        const selectedAttributeValueID = selectedAttributes.map(attr => attr.attributeValueID);


        // Thực hiện tải ảnh lên Firebase nếu có ảnh được chọn
        if (previewLogo) {
            try {
                const downloadURL = await UploadFileService.uploadProductImage(previewLogo); // Upload ảnh lên Firebase
                setImageUrl(downloadURL); // Lưu URL của ảnh vào state
                // dispatch(showNotification({ message: 'Tải ảnh lên thành công!', status: 1 }));
            } catch (error) {
                dispatch(showNotification({ message: 'Lỗi khi tải ảnh lên.', status: 0 }));
                resetImage(); // Đặt lại ảnh nếu tải lên thất bại
                return; // Dừng quá trình gửi nếu có lỗi
            }
        }


        const productVersionData = {
            versionName,
            price: parseFloat(price),
            purchasePrice: parseFloat(purchasePrice),
            weight: parseFloat(weight),
            height: parseFloat(height),
            length: parseFloat(length),
            width: parseFloat(width),
            attributeValueID: selectedAttributeValueID,
            productID: selectedProduct,
            image: imageUrl // Thêm hình ảnh vào dữ liệu gửi đi
        };

        console.log("Data gửi lên API:", productVersionData);


        try {
            const result = await ProductVersionService.createProductVersion(productVersionData);
            console.log('API Response:', result);

            dispatch(showNotification({ message: 'Thêm phiên bản sản phẩm thành công!', status: 1 }));
            if (onProductAdded) onProductAdded();  // Gọi callback để tải lại bảng sản phẩm
            onClose();
        } catch (error) {
            console.error("Error creating product version:", error.message);
            if (error.response && error.response.data && error.response.data.message === 'Phiên bản sản phẩm với tên này đã tồn tại') {
                dispatch(showNotification({ message: 'Tên phiên bản sản phẩm đã tồn tại, vui lòng chọn tên khác.', status: 0 }));
            } else {
                dispatch(showNotification({ message: 'Thêm phiên bản sản phẩm thất bại!', status: 0 }));
            }
            setError('Có lỗi xảy ra khi thêm phiên bản sản phẩm.');
        }
    };



    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
            <dialog className="modal modal-open" role="dialog">
                <div className="modal-box w-11/12 max-w-4xl">
                    <h3 className="font-bold text-lg">Thêm Phiên Bản Sản Phẩm</h3>
                    <form className="mt-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-6">
                            {/* Chọn Sản Phẩm */}
                            <label >
                                <span className="block text-sm font-medium mb-2">Sản Phẩm</span>
                                <select
                                    className="select select-bordered w-full"
                                    required
                                    value={selectedProduct}
                                    onChange={(e) => setSelectedProduct(e.target.value)}
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
                                    placeholder="Nhập tên Phiên Bản"
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
                                    placeholder="Giá Bán"
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
                                    placeholder="Giá Gốc"
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
                        </div>

                        {/* Phần tải lên hình ảnh */}
                        <div className="mb-4">
                            <input id="logoInput" type="file" onChange={handleImageChange} className="hidden" />
                            <div
                                className="h-40 flex justify-center items-center rounded-lg bg-cover cursor-pointer"
                                onClick={() => document.getElementById("logoInput").click()}
                            >
                                {previewLogo ? (
                                    <img src={previewLogo} alt="Tải ảnh thất bại" className="h-full object-cover rounded-lg" />
                                ) : (
                                    <span className="text-gray-400 opacity-75">
                                        <img
                                            className="w-24"
                                            src="https://icons.veryicon.com/png/o/miscellaneous/user-interface-flat-multicolor/5725-select-image.png"
                                            alt="Tải lên hình ảnh"
                                        />
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Phần chọn thuộc tính */}
                        <div className="mb-4">
                            <h4 className="font-bold">Chọn Thuộc Tính:</h4>
                            <div className="grid grid-cols-2 gap-4">
                                {attributes.map((attr, index) => (
                                    <div key={index} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={attr.isChecked}
                                            onChange={() => handleCheckboxChange(index)}
                                            className="mr-2"
                                        />
                                        <span>{`${attr.attributeName}: ${attr.attributeValue}`}</span>
                                    </div>
                                ))}
                            </div>
                            {error && <p className="text-red-500">{error}</p>}
                        </div>

                        {/* Nút hành động */}
                        <div className="modal-action mt-4">
                            <button type="button" className="btn btn-outline btn-sm btn-primary" onClick={() => setAttributeModalOpen(true)}>
                                Thêm thuộc tính
                            </button>
                            <button type="submit" className="btn btn-outline btn-sm btn-primary">
                                Thêm
                            </button>
                            <button type="button" className="btn btn-outline btn-sm btn-secondary" onClick={onClose}>
                                Đóng
                            </button>
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

export default AddProductVersionModal;
