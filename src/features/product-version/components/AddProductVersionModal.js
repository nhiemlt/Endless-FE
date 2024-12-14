import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../common/headerSlice';
import ProductVersionService from '../../../services/productVersionService';
import attributeService from '../../../services/attributeService';
import UploadFileService from '../../../services/UploadFileService';
import ProductService from '../../../services/ProductService'; // Service để gọi API lấy sản phẩm
import Select from 'react-select';  // Import react-select


const AddProductVersionModal = ({ onClose, onProductAdded }) => {


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

    const [attributesByGroup, setAttributesByGroup] = useState({});
    const [activeAttribute, setActiveAttribute] = useState('');
    const [selectedAttributeValues, setSelectedAttributeValues] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [categoryID, setCategoryID] = useState('');
    const [brandID, setBrandID] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(100);
    const dispatch = useDispatch();

    // Gọi API để lấy danh sách sản phẩm
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await ProductService.getProducts(searchKeyword,    // Từ khóa tìm kiếm
                    currentPage,      // Trang hiện tại
                    pageSize,         // Số lượng sản phẩm mỗi trang
                    'createDate',     // Thuộc tính sắp xếp
                    'asc',             // Hướng sắp xếp
                    categoryID || undefined, // Truyền undefined nếu không có categoryId
                    brandID || undefined    // Truyền undefined nếu không có brandId
                ); // Giả sử hàm này lấy danh sách sản phẩm
                setProducts(response.content); // Cập nhật state với danh sách sản phẩm
            } catch (error) {
                console.error('Lỗi khi lấy danh sách sản phẩm:', error);
            }
        };

        fetchProducts();
    }, []);
    // Biến đổi danh sách sản phẩm thành các option cho react-select
    const productOptions = products.map(product => ({
        value: product.productID,
        label: product.name
    }));

    const handleProductChange = (selectedOption) => {
        setSelectedProduct(selectedOption ? selectedOption.value : null);
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
        // Kiểm tra nếu mảng thuộc tính chọn vẫn rỗng
        if (selectedAttributeValues.length === 0) {
            dispatch(showNotification({
                message: 'Danh sách giá trị thuộc tính không hợp lệ. Vui lòng chọn ít nhất 1 giá trị.',
                status: 0,
            }));
            return; // Dừng nếu không có giá trị thuộc tính hợp lệ
        }

        // Thực hiện tải ảnh lên Firebase nếu có ảnh được chọn
        if (previewLogo) {
            try {
                const downloadURL = await UploadFileService.uploadProductImage(previewLogo); // Upload ảnh lên Firebase
                setImageUrl(downloadURL); // Lưu URL của ảnh vào state
            } catch (error) {
                dispatch(showNotification({ message: 'Lỗi khi tải ảnh lên.', status: 0 }));
                resetImage(); // Đặt lại ảnh nếu tải lên thất bại
                return; // Dừng quá trình gửi nếu có lỗi
            }
        }
        const defaultValue = 10;
        // Tạo dữ liệu productVersionData
        const productVersionData = {
            versionName,
            price: parseFloat(price),
            purchasePrice: parseFloat(purchasePrice),
            weight: parseFloat(weight),
            height: parseFloat(height || defaultValue), // Set mặc định là 10
            length: parseFloat(length || defaultValue), // Set mặc định là 10
            width: parseFloat(width || defaultValue),   // Set mặc định là 10
            attributeValueID: selectedAttributeValues, // Dùng selectedAttributeValues trực tiếp
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
            dispatch(showNotification({ message: error.response.data, status: 0 }));


        }
    };


    useEffect(() => {
        const fetchAttributes = async () => {
            try {
                const response = await attributeService.getAttributes(); // Gọi API
                const attributes = response?.data || []; // Đảm bảo có dữ liệu
                console.log(attributes);
                const groupedAttributes = attributes.reduce((acc, attr) => {
                    const groupName = attr?.attributeName ?? 'Khác';
                    if (!acc[groupName]) acc[groupName] = [];
                    acc[groupName] = [...acc[groupName], ...(attr.attributeValues || [])]; // Gộp tất cả attributeValues
                    return acc;
                }, {});


                setAttributesByGroup(groupedAttributes); // Cập nhật state
                setActiveAttribute(Object.keys(groupedAttributes)[0] || ''); // Đặt tab đầu tiên làm active
            } catch (error) {
                console.error('Lỗi khi lấy danh sách thuộc tính:', error);
                dispatch(
                    showNotification({ message: 'Lỗi khi lấy danh sách thuộc tính!', status: 0 })
                );
            }
        };

        fetchAttributes();
        setSelectedAttributeValues([]);
    }, []);


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

    const handleTabClick = (e, attributeName) => {
        e.preventDefault(); // Ngăn chặn reload trang
        setActiveAttribute(attributeName);
    };


    const renderAttributeValues = () => {
        if (!activeAttribute || !attributesByGroup[activeAttribute]) return null;

        return attributesByGroup[activeAttribute].map((valueObj, index) => (
            <label key={`${valueObj.attributeValueID}-${index}`} className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={selectedAttributeValues.includes(valueObj.attributeValueID)}
                    onChange={() => handleCheckboxChange(valueObj.attributeValueID)}
                />
                <span>{valueObj.attributeValue}</span>
            </label>
        ));
    };


    const handleCheckboxChange = (valueID) => {
        setSelectedAttributeValues((prev) => {
            const newSelectedValues = prev.includes(valueID)
                ? prev.filter((id) => id !== valueID)
                : [...prev, valueID];

            // Ghi log các giá trị đã chọn hoặc bỏ chọn
            console.log("Selected Attribute Values:", newSelectedValues);

            return newSelectedValues;
        });
    };


    const handleSelectAllAttributes = () => {
        if (!activeAttribute || !attributesByGroup[activeAttribute]) return;
        const attributeValueIDs = attributesByGroup[activeAttribute].map((value) => value.attributeValueID);
        const allSelected = attributeValueIDs.every((id) => selectedAttributeValues.includes(id));
        setSelectedAttributeValues((prev) =>
            allSelected ? prev.filter((id) => !attributeValueIDs.includes(id)) : [...new Set([...prev, ...attributeValueIDs])]
        );
    };

    // Hàm định dạng số thành dạng có dấu chấm (ví dụ: 10.000.000)
    const formatCurrency = (value) => {
        if (!value) return '';
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    // Hàm chuyển lại chuỗi định dạng thành số
    const parseCurrency = (formattedValue) => {
        return Number(formattedValue.replace(/[^0-9]/g, ''));
    };



    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
            <dialog className="modal modal-open" role="dialog">
                <div className="modal-box w-11/12 max-w-4xl">
                    <h3 className="font-bold text-lg">Thêm Phiên Bản Sản Phẩm</h3>
                    <form className="mt-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <div>
                                {/* Chọn Sản Phẩm */}
                                <div>
                                    <label>
                                        <span className="block text-sm font-medium mb-2">Sản Phẩm</span>
                                        <Select
                                            options={productOptions}  // Dùng option từ dữ liệu sản phẩm
                                            onChange={handleProductChange}
                                            value={productOptions.find(option => option.value === selectedProduct)}  // Cập nhật giá trị đã chọn
                                            isSearchable  // Cho phép tìm kiếm
                                            placeholder="Chọn Sản Phẩm"
                                        />
                                    </label>
                                </div>
                                <label>
                                    <span className="block text-sm font-medium mb-2 mt-4">Trọng Lượng</span>
                                    <div className="relative">
                                        {/* Input hiển thị giá trị trọng lượng */}
                                        <input
                                            type="text"
                                            placeholder="Nhập trọng lượng"
                                            className="input input-bordered w-full pr-16" // Thêm padding phải để tránh chồng lên <kbd>
                                            value={weight === 0 ? '' : weight} // Nếu giá trị là 0, hiển thị chuỗi trống
                                            onChange={(e) => {
                                                let value = e.target.value.trim(); // Xử lý chuỗi nhập vào
                                                if (/^\d*$/.test(value)) { // Chỉ chấp nhận số nguyên
                                                    // Xóa các số 0 thừa ở đầu
                                                    if (value.startsWith('0') && value.length > 1) {
                                                        value = value.replace(/^0+/, '');
                                                    }
                                                    const parsedValue = Number(value);
                                                    if (parsedValue >= 0 && parsedValue <= 1_000_000_000) {
                                                        setWeight(parsedValue); // Cập nhật giá trị gốc
                                                    } else {
                                                        dispatch(
                                                            showNotification({
                                                                message: "Trọng lượng phải lớn hơn hoặc bằng 0 và không vượt quá 1 tỷ gam",
                                                                status: 0,
                                                            })
                                                        );
                                                    }
                                                }
                                            }}
                                            required
                                        />
                                        {/* Kbd đơn vị cố định */}
                                        <kbd className="kbd kbd-sm absolute top-1/2 right-4 transform -translate-y-1/2">
                                            gam
                                        </kbd>
                                    </div>
                                </label>



                            </div>

                            <label>
                                <span className="block text-sm font-medium mb-2">Giá Nhập</span>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Giá nhập (đ)"
                                        className="input input-bordered w-full"
                                        value={formatCurrency(purchasePrice)}
                                        onChange={(e) => {
                                            const formattedValue = e.target.value;
                                            const parsedValue = parseCurrency(formattedValue);
                                            if (parsedValue >= 0 && parsedValue <= 1_000_000_000) {
                                                setPurchasePrice(parsedValue);
                                            } else {
                                                dispatch(
                                                    showNotification({
                                                        message: "Giá nhập phải lớn hơn hoặc bằng 0 và không vượt quá 1 tỷ",
                                                        status: 0,
                                                    })
                                                );
                                            }
                                        }}
                                        required
                                    />
                                    {/* Kbd đơn vị cố định */}
                                    <kbd className="kbd kbd-sm absolute top-1/2 right-4 transform -translate-y-1/2">
                                        đồng
                                    </kbd>
                                </div>
                            </label>
                            <label>
                                <span className="block text-sm font-medium mb-2">Giá Bán</span>
                                <div className="relative">

                                    <input
                                        type="text"
                                        placeholder="Giá bán (đ)"
                                        className="input input-bordered w-full"
                                        value={formatCurrency(price)}
                                        onChange={(e) => {
                                            const formattedValue = e.target.value;
                                            const parsedValue = parseCurrency(formattedValue);
                                            if (parsedValue >= 0 && parsedValue <= 1_000_000_000) {
                                                setPrice(parsedValue);
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
                                    {/* Kbd đơn vị cố định */}
                                    <kbd className="kbd kbd-sm absolute top-1/2 right-4 transform -translate-y-1/2">
                                        đồng
                                    </kbd>
                                </div>
                            </label>



                        </div>

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
                                <button
                                    type="button" // Thêm thuộc tính này
                                    className="btn btn-sm btn-outline btn-accent"
                                    onClick={handleSelectAllAttributes}
                                >
                                    {`Chọn tất cả (${activeAttribute})`}
                                </button>
                            </div>

                        </div>


                        {/* Nút hành động */}
                        <div className="modal-action mt-4">

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

        </>
    );
};

export default AddProductVersionModal;
