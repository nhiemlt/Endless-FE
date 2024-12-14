import { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { showNotification } from "../../../features/common/headerSlice";
import constants from '../../../utils/globalConstantUtil'; // Adjust the path to your file structure
import CategoryService from "../../../services/CategoryService";
import productVersionService from "../../../services/productVersionService";
import CartService from "../../../services/CartService";


const BASE_URL = constants.API_BASE_URL + '/api/product-versions';

function TopSellByCategory() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false); // Trạng thái loading
    const [categories, setCategories] = useState([]);
    const [productsByCategory, setProductsByCategory] = useState({});
    const [loadingCategories, setLoadingCategories] = useState(true);

    // Fetch danh mục
    const fetchCategories = async () => {
        try {
            const response = await CategoryService.getCategories({});
            setCategories(response.content || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoadingCategories(false);
        }
    };

    // Fetch sản phẩm theo danh mục
    const fetchTopSellingProductsByCategory = async (categoryID) => {
        try {
            const response = await productVersionService.getTopSellingProductsByCategory(categoryID);
            return response; // Trả về dữ liệu để lưu theo danh mục
        } catch (error) {
            console.error(`Error fetching products for category ${categoryID}:`, error);
            return [];
        }
    };

    // Hàm fetch tất cả danh mục và sản phẩm
    const fetchAllProductsByCategories = async () => {
        const allProducts = {};
        for (const category of categories) {
            const products = await fetchTopSellingProductsByCategory(category.categoryID);
            allProducts[category.categoryID] = products;
        }
        setProductsByCategory(allProducts);
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchCategories();
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (categories.length > 0) {
            fetchAllProductsByCategories();
        }
    }, [categories]);



    const formatCurrency = (amount) => {
        return amount.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND", // Định dạng tiền tệ theo VND
        });
    };

    const handleAddToCart = async (product) => {
        const cartModel = {
            productVersionID: product.productVersionID, // ID phiên bản sản phẩm
            quantity: 1, // Số lượng mặc định là 1
        };

        try {
            const result = await CartService.addToCart(cartModel); // Gọi API thêm sản phẩm vào giỏ hàng
            dispatch(showNotification({ message: "Sản phẩm đã được thêm vào giỏ hàng.", status: 1 })); // Hiển thị thông báo thành công
        } catch (error) {
            dispatch(showNotification({ message: "Lỗi khi thêm vào giỏ hàng.", status: 0 })); // Hiển thị thông báo lỗi
            console.error("Lỗi khi thêm vào giỏ hàng:", error); // In lỗi nếu có
        }
    };

    // Hàm xử lý khi hình ảnh sản phẩm được chọn
    const handleImageClick = (product) => {
        navigate(`/product-detail/${product.product.productID}`);
    };

    return (

        <div>

            {loadingCategories ? (
                <p>Đang tải danh mục...</p>
            ) : (
                categories
                    .filter((category) => productsByCategory[category.categoryID]?.length > 0) // Lọc các danh mục có sản phẩm
                    .map((category) => (
                        <section key={category.categoryID} className="p-3 dark:bg-base-100 bg-white">
                            <div className="container">
                                <div className="flex justify-between items-center">
                                    <h1 className="text-lg font-bold rainbow-text">
                                        Top sản phẩm bán chạy theo danh mục <span className="text-xl">{category.name}</span>
                                    </h1>
                                    <a href="/products" className="text-primary">Tất cả sản phẩm</a>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-3">
                                    {productsByCategory[category.categoryID].map((product) => (
                                        <div key={product.productVersionID} className="group relative block overflow-hidden">
                                            <img
                                                src={product.image}
                                                alt={product.product.name}
                                                className="h-30 w-full object-cover transition duration-500 group-hover:scale-105"
                                                onClick={() => handleImageClick(product)}
                                            />
                                            {product.discountPercentage > 0 && (
                                                <p className="absolute top-2 left-2 bg-red-600 text-white font-semibold text-xs px-2 py-1 rounded-md shadow-md">
                                                    - {product.discountPercentage}%
                                                </p>
                                            )}
                                            <div className="relative bg-blue-50 p-4">
                                                <p className="mt-1 text-sm text-gray-900 h-8 overflow-hidden text-ellipsis whitespace-nowrap transform scale-95">
                                                    <b>{product.product.name} | {product.versionName}</b>
                                                </p>
                                                <div className="flex items-center mt-2">
                                                    {product.averageRating ? (
                                                        <>
                                                            <svg
                                                                className="w-4 h-4 text-yellow-300"
                                                                aria-hidden="true"
                                                                fill="currentColor"
                                                                viewBox="0 0 22 20"
                                                            >
                                                                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                                                            </svg>
                                                            <p className="ms-2 text-sm font-bold text-gray-900 text-dark">
                                                                {product.averageRating.toFixed(1)}/5
                                                            </p>
                                                        </>
                                                    ) : (
                                                        <p className="text-sm text-gray-800 text-dark">Chưa có đánh giá</p>
                                                    )}
                                                </div>

                                                {formatCurrency(product.price) === formatCurrency(product.discountPrice) ? (
                                                    <span className="mt-1 text-sm text-red-600" style={{ animation: 'blink 1s linear infinite' }}>
                                                        <b>{formatCurrency(product.price)}</b>
                                                    </span>
                                                ) : (
                                                    <>
                                                        <span className="mt-1 text-xs text-gray-500">
                                                            <s>{formatCurrency(product.price)}</s>
                                                        </span>{' '}
                                                        <span className="mt-1 text-sm text-red-600" style={{ animation: 'blink 1s linear infinite' }}>
                                                            <b>{formatCurrency(product.discountPrice)}</b>
                                                            <br />
                                                        </span>
                                                    </>
                                                )}

                                                <style>
                                                    {`@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}
                                                </style>
                                                <br />
                                                <span className="mt-1 text-xs text-gray-400">Đã bán: {product.quantitySold} | </span>
                                                <span className="mt-1 text-xs text-gray-400">
                                                    Còn:{" "}
                                                    {product.quantityAvailable === 0 ? (
                                                        <span className="text-red-600">Đã bán hết</span>
                                                    ) : (
                                                        <span className={product.quantityAvailable < 10 ? "text-red-600" : "text-gray-400"}>
                                                            {product.quantityAvailable}
                                                        </span>
                                                    )}
                                                </span>

                                                <form
                                                    className="mt-4"
                                                    onSubmit={(e) => {
                                                        e.preventDefault();
                                                        handleAddToCart(product);
                                                    }}
                                                >
                                                    <button
                                                        type="submit"
                                                        className="w-full rounded btn btn-warning p-2 text-xs"
                                                        disabled={product.quantityAvailable === 0}  // Disable button nếu hết hàng
                                                    >
                                                        Thêm vào giỏ hàng
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    ))
            )}
        </div>
    );


}

export default TopSellByCategory;