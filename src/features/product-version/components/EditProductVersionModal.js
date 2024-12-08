import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ProductVersionService from '../../../services/productVersionService';
import UploadFileService from '../../../services/UploadFileService';
import { showNotification } from '../../common/headerSlice';
import ProductService from '../../../services/ProductService';
import attributeService from '../../../services/attributeService';

const EditProductVersionModal = ({ productVersion, onClose, onProductUpdated }) => {

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
    const [attributesByGroup, setAttributesByGroup] = useState({});
    const [activeAttribute, setActiveAttribute] = useState('');
    const [selectedAttributeValues, setSelectedAttributeValues] = useState([]);

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

            setProductID(productVersion.product?.productID || '');
            setVersionName(productVersion.versionName || '');
            setPrice(productVersion.price || 0);
            setPurchasePrice(productVersion.purchasePrice || 0);
            setWeight(productVersion.weight || 0);
            setHeight(productVersion.height || 0);
            setLength(productVersion.length || 0);
            setWidth(productVersion.width || 0);
            setImage(productVersion.image || '');


            const selectedValues = productVersion.versionAttributes?.map(attr => attr.attributeValueID) || [];
            console.log("Selected Values from productVersion:", selectedValues); // Kiểm tra giá trị từ productVersion
            setSelectedAttributeValues(selectedValues);



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

        const selectedAttributeValueID = selectedAttributeValues;  // Không cần phải lọc lại attributes

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
            setError('Có lỗi xảy ra khi cập nhật phiên bản sản phẩm.');

        }

    };
    useEffect(() => {
        const fetchAttributes = async () => {
            try {
                const response = await attributeService.getAttributes();
                const attributes = response?.data || [];

                const groupedAttributes = attributes.reduce((acc, attr) => {
                    const groupName = attr?.attributeName ?? 'Khác';
                    if (!acc[groupName]) acc[groupName] = [];
                    acc[groupName] = [...acc[groupName], ...(attr.attributeValues || [])];
                    return acc;
                }, {});

                setAttributesByGroup(groupedAttributes); // Cập nhật state attributesByGroup
                setActiveAttribute(Object.keys(groupedAttributes)[0] || ''); // Đặt active tab
            } catch (error) {
                console.error('Lỗi khi lấy danh sách thuộc tính:', error);
                dispatch(showNotification({ message: 'Lỗi khi lấy danh sách thuộc tính!', status: 0 }));
            }
        };

        fetchAttributes();
    }, []); // Chạy khi component mount lần đầu


    const renderAttributeTabs = () => {
        return Object.keys(attributesByGroup).map((attributeName, index) => (
            <button
                key={index}
                className={`tab ${activeAttribute === attributeName ? 'tab-active' : ''}`}
                onClick={(e) => handleTabClick(e, attributeName)}
            >
                {attributeName}
            </button>
        ));
    };

    const renderAttributeValues = () => {
        if (!activeAttribute || !attributesByGroup[activeAttribute]) return null;

        return attributesByGroup[activeAttribute].map((valueObj, index) => (
            <label key={`${valueObj.attributeValueID}-${index}`} className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={selectedAttributeValues.includes(valueObj.attributeValueID)}  // Kiểm tra lại điều kiện này
                    onChange={() => handleCheckboxChange(valueObj.attributeValueID)}
                />
                <span>{valueObj.attributeValue}</span>
            </label>
        ));
    };

    const handleTabClick = (e, attributeName) => {
        e.preventDefault(); // Ngăn chặn reload trang
        setActiveAttribute(attributeName);
    };

    const handleCheckboxChange = (valueID) => {
        setSelectedAttributeValues((prev) => {
            // Lấy thuộc tính đang được chọn
            const currentAttributeValues = attributesByGroup[activeAttribute] || [];

            // Kiểm tra nếu chỉ có một giá trị được chọn
            const isAlreadySelected = prev.includes(valueID);

            if (!isAlreadySelected) {
                // Bỏ chọn tất cả các giá trị của thuộc tính hiện tại
                const newSelectedValues = prev.filter((id) => !currentAttributeValues.some(attr => attr.attributeValueID === id));
                return [...newSelectedValues, valueID];
            } else {
                // Nếu giá trị đã được chọn, thì bỏ chọn nó
                return prev.filter((id) => id !== valueID);
            }
        });
    };




    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
            <dialog className="modal modal-open" role="dialog">
                <div className="modal-box w-11/12 max-w-4xl">
                    <h3 className="font-bold text-lg">Chỉnh Sửa Phiên Bản Sản Phẩm</h3>
                    <form className="mt-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <div>
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
                            </div>
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
                            <div className="grid grid-cols-4 gap-6 col-span-2">

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


                        </div>

                        {/* Chọn thuộc tính */}
                        <div className="border border-gray-300 shadow-lg rounded-lg p-5 mt-5 bg-base-100">
                            {/* Tabs */}
                            <div role="tablist" className="tabs tabs-boxed mb-5 overflow-x-auto whitespace-nowrap">
                                {renderAttributeTabs()}
                            </div>

                            {/* Hiển thị giá trị của thuộc tính */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {renderAttributeValues()}
                            </div>

                            {/* Nút chọn tất cả */}
                            <div className="flex justify-between items-center mt-4">
                                <span className="text-sm text-gray-500">
                                    {/* Hiển thị các giá trị thuộc tính đã chọn */}
                                    {`Những giá trị thuộc tính đã chọn: ${selectedAttributeValues.length > 0
                                        ? selectedAttributeValues
                                            .map(valueID => {
                                                // Lấy giá trị thuộc tính từ selectedAttributeValues (lấy từ ID)
                                                const attribute = Object.values(attributesByGroup)
                                                    .flat() // Flatten tất cả các thuộc tính
                                                    .find(attr => attr.attributeValueID === valueID);
                                                return attribute ? attribute.attributeValue : ''; // Trả về giá trị thuộc tính
                                            })
                                            .join(', ') // Nối các giá trị lại với nhau
                                        : 'Chưa có giá trị nào được chọn'}`}
                                </span>
                            </div>
                        </div>

                        <div className="modal-action mt-4">
                            <button type="submit" className="btn btn-outline btn-sm btn-primary">Cập nhật</button>
                            <button type="button" className="btn btn-outline btn-sm btn-secondary" onClick={onClose}>Đóng</button>
                        </div>
                    </form>
                </div>
            </dialog>


        </>
    );
};

export default EditProductVersionModal;
