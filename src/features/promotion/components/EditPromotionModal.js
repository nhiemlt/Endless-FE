import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../common/headerSlice';
import productVersionService from '../../../services/productVersionService';
import PromotionService from '../../../services/PromotionService';
import UploadFileService from '../../../services/UploadFileService';
import moment from 'moment';

const EditPromotionModal = ({ isOpen, onClose, onPromotionUpdated, promotion }) => {
    const [productsByBrand, setProductsByBrand] = useState({});
    const [activeBrand, setActiveBrand] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [previewPoster, setPreviewPoster] = useState(null);
    const [promotionPoster, setPromotionPoster] = useState(null);
    const [promotionName, setPromotionName] = useState('');
    const [percentDiscount, setPercentDiscount] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const dispatch = useDispatch();
    const dialogRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);


    // Reset form khi đóng modal
    const resetForm = () => {
        setProductsByBrand({});
        setActiveBrand('');
        setSelectedProducts([]);
        setPreviewPoster(null);
        setPromotionPoster(null);
        setPromotionName('');
        setPercentDiscount('');
        setStartDate('');
        setEndDate('');
    };

    // Lấy danh sách sản phẩm từ API
    const fetchProducts = async () => {
        try {
            const response = await productVersionService.getAllProductVersions();
            const productVersions = Array.isArray(response.content) ? response.content : [];
            const groupedProducts = productVersions.reduce((acc, product) => {
                const brandName = product?.product.brandName || 'Khác';
                if (!acc[brandName]) acc[brandName] = [];
                acc[brandName].push(product);
                return acc;
            }, {});
            setProductsByBrand(groupedProducts);
            setActiveBrand(Object.keys(groupedProducts)[0] || '');
        } catch (error) {
            console.error("Lỗi khi lấy danh sách sản phẩm:", error);
            dispatch(showNotification({ message: 'Lỗi khi lấy danh sách sản phẩm!', status: 0 }));
        }
    };

    // Lấy dữ liệu khuyến mãi hiện tại khi modal mở
    useEffect(() => {
        if (!isOpen || !promotion) return;
        fetchProducts();

        // Cập nhật form với dữ liệu khuyến mãi
        setPromotionName(promotion.name);
        setPercentDiscount(promotion.percentDiscount);
        setStartDate(moment(promotion.startDate).local().format("YYYY-MM-DDTHH:mm"));
        setEndDate(moment(promotion.endDate).local().format("YYYY-MM-DDTHH:mm"));

        // Cập nhật selectedProducts từ promotionproducts
        if (promotion?.promotionproducts) {
            const selectedIds = promotion.promotionproducts.map(item => item.productVersionID?.productVersionID);
            setSelectedProducts(selectedIds); // Đồng bộ danh sách sản phẩm
            console.log("Selected products", selectedIds);
        }


        setPreviewPoster(promotion.poster || null);
        console.log("Poster:", promotion.poster);


        console.log("Promotion", promotion)
    }, [isOpen, promotion]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);  // Chuyển đổi thành 'yyyy-MM-ddThh:mm'
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

        if (file && validImageTypes.includes(file.type)) {
            const img = new Image();
            img.onload = () => {
                if (img.width >= img.height * 2) {
                    setPromotionPoster(file);
                    setPreviewPoster(URL.createObjectURL(file));
                } else {
                    dispatch(showNotification({
                        message: 'Hình ảnh phải có chiều rộng lớn gấp đôi hoặc hơn chiều cao!',
                        status: 0
                    }));
                    resetImage();
                }
            };
            img.src = URL.createObjectURL(file);
        } else {
            dispatch(showNotification({
                message: 'Định dạng tệp không hợp lệ! Vui lòng chọn hình ảnh (JPEG, PNG, GIF).',
                status: 0
            }));
            resetImage();
        }
    };

    const resetImage = () => {
        setPromotionPoster(null);
        setPreviewPoster(null);
    };


    const handleUpdatePromotion = async (e) => {
        e.preventDefault();

        if (!promotionName || !percentDiscount || !startDate || !endDate || selectedProducts.length === 0) {
            dispatch(showNotification({ message: 'Vui lòng điền đầy đủ thông tin!', status: 0 }));
            return;
        }

        setIsLoading(true); // Bắt đầu trạng thái cập nhật
        try {
            let uploadedImageUrl = null;

            if (promotionPoster) {
                uploadedImageUrl = await UploadFileService.uploadPromotionImage(promotionPoster);
            } else if (promotion.poster) {
                uploadedImageUrl = promotion.poster;
            }

            const startInstant = new Date(startDate).toISOString();
            const endInstant = new Date(endDate).toISOString();

            const promotionData = {
                name: promotionName,
                percentDiscount: parseFloat(percentDiscount),
                startDate: startInstant,
                endDate: endInstant,
                productVersionIds: selectedProducts,
                poster: uploadedImageUrl || null,
            };

            const response = await PromotionService.updatePromotion(promotion.promotionID, promotionData);

            dispatch(showNotification({ message: 'Khuyến mãi được cập nhật thành công!', status: 1 }));

            onPromotionUpdated(response);
            resetForm();
            onClose();
        } catch (error) {
            const errorMessage = error.response?.data || 'Lỗi khi cập nhật khuyến mãi!';
            dispatch(showNotification({ message: `Lỗi: ${errorMessage}`, status: 0 }));
            console.error('Lỗi khi cập nhật khuyến mãi:', error);
        } finally {
            setIsLoading(false); // Kết thúc trạng thái cập nhật
        }
    };


    const handleTabClick = (e, brandName) => {
        e.preventDefault();
        setActiveBrand(brandName);
    };

    const handleCheckboxChange = (productVersionID) => {
        if (selectedProducts.includes(productVersionID)) {
            setSelectedProducts(selectedProducts.filter(id => id !== productVersionID));
        } else {
            setSelectedProducts([...selectedProducts, productVersionID]);
        }
    };



    const handleSelectAll = () => {
        if (!activeBrand || !productsByBrand[activeBrand]) return;
        const brandProductIds = productsByBrand[activeBrand].map((product) => product.productVersionID);
        const allSelected = brandProductIds.every((id) => selectedProducts.includes(id));
        setSelectedProducts((prev) =>
            allSelected ? prev.filter((id) => !brandProductIds.includes(id)) : [...new Set([...prev, ...brandProductIds])]
        );
    };

    const renderProductsCheckboxes = () => {
        if (!activeBrand || !productsByBrand[activeBrand]) return null;
        console.log("Selected products:", selectedProducts);  // Log giá trị selectedProducts
        return productsByBrand[activeBrand].map((product, index) => (
            <label key={`${product.productVersionID}-${index}`} className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.productVersionID)} // Kiểm tra xem sản phẩm đã được chọn chưa
                    onChange={() => handleCheckboxChange(product.productVersionID)} // Khi thay đổi trạng thái checkbox
                />
                <span>{product.product?.name + " " + product?.versionName}</span>
            </label>
        ));

    };


    const renderTabs = () => {
        return Object.keys(productsByBrand).map((brandName, index) => (
            <button
                key={index}
                className={`tab ${activeBrand === brandName ? 'tab-active' : ''}`}
                onClick={(e) => handleTabClick(e, brandName)}
            >
                {brandName}
            </button>
        ));
    };

    return isOpen ? (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
            <dialog ref={dialogRef} className="modal" open>
                <div className="modal-box max-w-3xl">
                    <h3 className="font-bold text-lg">Chỉnh Sửa Khuyến Mãi</h3>
                    <form onSubmit={handleUpdatePromotion} className="mt-4">
                        <div className="flex space-x-4 mb-4">
                            <div className="form-control w-full">
                                <label className="label">Tên Khuyến Mãi</label>
                                <input
                                    type="text"
                                    className="input input-bordered w-full"
                                    value={promotionName}
                                    onChange={(e) => setPromotionName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-control w-full">
                                <label className="label">Phần trăm khuyến mãi</label>
                                <input
                                    type="number"
                                    className="input input-bordered w-full"
                                    value={percentDiscount}
                                    onChange={(e) => setPercentDiscount(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex space-x-4 mb-4">
                            <div className="form-control w-full">
                                <label className="label">Ngày bắt đầu</label>
                                <input
                                    type="datetime-local"
                                    className="input input-bordered w-full"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div className="form-control w-full">
                                <label className="label">Ngày kết thúc</label>
                                <input
                                    type="datetime-local"
                                    className="input input-bordered w-full"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <input
                                id="posterInput"
                                type="file"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                            <div
                                className="h-40 flex justify-center items-center rounded-lg bg-cover cursor-pointer"
                                onClick={() => document.getElementById('posterInput').click()}
                            >
                                {previewPoster ? (
                                    <img src={previewPoster} alt="Xem trước" className="h-full object-cover rounded-lg" />
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
                        <div className="border border-gray-300 shadow-lg rounded-lg p-5 mt-5 bg-base-100">


                            <div className="tabs tabs-boxed">
                                {renderTabs()}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {renderProductsCheckboxes()}
                            </div>
                            {/* Nút chọn tất cả */}
                            <div className="flex justify-between items-center mt-4">
                                <span className="text-sm text-gray-500">{`Thương hiệu: ${activeBrand}`}</span>
                                <button
                                    type="button" // Thêm thuộc tính này
                                    className="btn btn-sm btn-outline btn-accent"
                                    onClick={handleSelectAll}
                                >
                                    {`Chọn tất cả (${activeBrand})`}
                                </button>
                            </div>

                        </div>

                        <div className="modal-action">
                            <button type="button" className="btn" onClick={onClose}>Hủy</button>
                            <button
                                type="submit"
                                className={`btn btn-primary ${isLoading ? 'btn-disabled loading' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
                            </button>
                        </div>

                    </form>
                </div>
            </dialog>
        </>
    ) : null;
};

export default EditPromotionModal;
