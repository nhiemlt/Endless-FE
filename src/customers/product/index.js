import { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import productInfoService from "../../services/productInfoService";
import CartService from "../../services/CartService";
import CategoryService from "../../services/CategoryService";
import BrandService from "../../services/BrandService";
import { showNotification } from "../../features/common/headerSlice";

function Product() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(8);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState('versionName');
  const [direction, setDirection] = useState('ASC');
  const [keyword, setKeyword] = useState("");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filterData, setFilterData] = useState({
    keyword: '',
    minPrice: '',
    maxPrice: '',
    categoryIDs: [],
    brandIDs: [],
  });

  const fetchCategories = async () => {
    try {
      const response = await CategoryService.getCategories({});
      setCategories(response.content || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await BrandService.getBrands({});
      setBrands(response.content || []);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const filters = {
          page,
          size,
          sortBy,
          direction,
          keyword,
          categoryIDs: filterData.categoryIDs,
          brandIDs: filterData.brandIDs,
          minPrice: filterData.minPrice,
          maxPrice: filterData.maxPrice,
        };

        const response = await productInfoService.filterProductInfos(filters);
        console.log(response.content)
        setProducts(response.content || []);  // Fallback to empty array if no content
        setTotalPages(response.totalPages || 1); // Fallback to 1 if no totalPages
      } catch (error) {
        console.error('Error fetching filtered products:', error);
      }
    };

    fetchProducts();
  }, [keyword, page, size, sortBy, direction, filterData]);


  const handlePriceChange = (e, field) => {
    setFilterData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleCategoryChange = (categoryID) => {
    setFilterData((prev) => {
      const updatedCategories = prev.categoryIDs.includes(categoryID)
        ? prev.categoryIDs.filter((id) => id !== categoryID)
        : [...prev.categoryIDs, categoryID];
      return { ...prev, categoryIDs: updatedCategories };
    });
  };

  const handleBrandChange = (brandID) => {
    setFilterData((prev) => {
      const updatedBrands = prev.brandIDs.includes(brandID)
        ? prev.brandIDs.filter((id) => id !== brandID)
        : [...prev.brandIDs, brandID];
      return { ...prev, brandIDs: updatedBrands };
    });
  };

  // 4. Quản lý phân trang
  const handlePreviousPage = () => {
    if (page > 0) setPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage((prev) => prev + 1);
  };

  //Hàm định dạng tiền 
  const formatCurrency = (amount) => {
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  // //Hàm thêm sản phẩm vào giỏ hàng
  // const handleAddToCart = async (product) => {
  //   const cartModel = { productVersionID: product.productVersionID, quantity: 1 };
  //   try {
  //     await CartService.addToCart(cartModel);
  //     dispatch(showNotification({ message: "Sản phẩm đã được thêm vào giỏ hàng.", status: 1 }));
  //   } catch (error) {
  //     dispatch(showNotification({ message: "Lỗi khi thêm vào giỏ hàng.", status: 0 }));
  //     console.error("Lỗi khi thêm vào giỏ hàng:", error);
  //   }
  // };

  //Hàm chuyển trang chi tiết sản phẩm
  const handleViewDetails = (productID) => {
    navigate(`/product-detail/${productID}`);
  };


  return (
    <div className="flex flex-col lg:flex-row">
      {/* Sidebar */}
      <div className="w-full lg:w-1/4 p-4 dark:bg-base-100 bg-white rounded-lg shadow-md">
        {/* Phần tìm kiếm */}
        <div>
          <label htmlFor="SortBy" className="block text-xs font-medium dark:text-white text-gray-900 mt-3">
            <b>Tìm kiếm sản phẩm</b>
          </label>
          <div className="mt-3">
            <label
              htmlFor="searchKeyword"
              className="input input-primary flex items-center gap-2 text-xs font-medium"
            >
              <input
                id="searchKeyword"
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)} // Cập nhật state keyword
                className="grow h-10 text-xs dark:bg-base-100"
                placeholder="Tìm kiếm"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
          </div>
        </div>

        {/* Phần Sắp xếp */}
        <div>
          <label htmlFor="SortBy" className="block text-xs font-medium dark:text-white text-gray-900 mt-5">
            <b>Sắp xếp</b>
          </label>
          <select
            id="SortBy"
            value={`${sortBy}, ${direction}`}
            onChange={(e) => {
              const [field, dir] = e.target.value.split(", ");
              setSortBy(field);
              setDirection(dir);
            }}
            className="mt-3 rounded border-gray-300 text-sm select select-secondary w-full max-w-xs dark:text-white text-gray-900"
          >
            <option value="">-- Chọn sắp xếp  --</option>
            <option value="discountPrice, ASC">Giá khuyến mãi - Tăng dần</option>
            <option value="discountPrice, DESC">Giá khuyến mãi - Giảm dần</option>
            <option value="numberOfReviews, ASC">Lượt đánh giá - Tăng dần</option>
            <option value="numberOfReviews, DESC">Lượt đánh giá - Giảm dần</option>
            <option value="quantitySold, ASC">Lượt bán - Tăng dần</option>
            <option value="quantitySold, DESC">Lượt bán - Giảm dần</option>
          </select>
        </div>

        {/* Phần lọc giá */}
        <div>
          <label htmlFor="SortBy" className="block text-xs font-medium dark:text-white text-gray-900 mt-3">
            <b>Khoảng giá</b>
          </label>
          <div className="flex items-center gap-2 mt-3">
            <input
              type="number"
              min="0"
              placeholder="Giá thấp"
              className="input input-success w-full h-10 max-w-xs text-xs"
              value={filterData.minPrice}
              onChange={(e) => {
                handlePriceChange(e, 'minPrice');
              }}
            />
            <span className="text-xl">-</span>
            <input
              type="number"
              min="0"
              placeholder="Giá cao"
              className="input input-success w-full h-10 max-w-xs text-xs"
              value={filterData.maxPrice}
              onChange={(e) => {
                handlePriceChange(e, 'maxPrice');
              }}
            />
          </div>
        </div>

        {/* Phần lọc theo danh mục */}
        <div>
          <p className="block text-xs font-medium dark:text-white text-gray-900 mt-5">
            <b>Lọc theo danh mục</b>
          </p>
          <div className="mt-2 space-y-2">
            <details className="overflow-hidden rounded border border-gray-300">
              <summary className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition">
                <span className="text-sm font-medium dark:text-white text-gray-900">Danh sách danh mục</span>
              </summary>
              <div className="border-t border-gray-200 dark:bg-base-100 bg-white">
                <ul className="space-y-1 border-t border-gray-200 p-4">
                  {Array.isArray(categories) && categories.length > 0 ? (
                    categories.map((category) => (
                      <li key={category.categoryID}>
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={filterData.categoryIDs.includes(category.categoryID)} // Kiểm tra xem category có được chọn không
                            onChange={() => {
                              handleCategoryChange(category.categoryID);
                            }}
                          />
                          <span className="text-sm font-medium dark:text-white text-gray-900">
                            {category.name}
                          </span>
                        </label>
                      </li>
                    ))
                  ) : (
                    <li>No categories available</li> // Fallback khi không có danh mục
                  )}
                </ul>
              </div>
            </details>
          </div>
        </div>

        {/* Phần lọc theo thương hiệu */}
        <div>
          <p className="block text-xs font-medium dark:text-white text-gray-900 mt-5">
            <b>Lọc theo thương hiệu</b>
          </p>
          <div className="mt-2 space-y-2">
            <details className="overflow-hidden rounded border border-gray-300">
              <summary className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition">
                <span className="text-sm font-medium dark:text-white text-gray-900">
                  Danh sách thương hiệu
                </span>
              </summary>
              <div className="border-t border-gray-200 dark:bg-base-100 bg-white">
                <ul className="space-y-1 border-t border-gray-200 p-4">
                  {Array.isArray(brands) && brands.length > 0 ? (
                    brands.map((brand) => (
                      <li key={brand.brandID}>
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            value={brand.brandID}
                            checked={filterData.brandIDs.includes(brand.brandID)} // Kiểm tra xem thương hiệu có được chọn không
                            onChange={() => {
                              handleBrandChange(brand.brandID);
                            }}
                          />
                          <span className="text-sm font-medium dark:text-white text-gray-900">
                            {brand.brandName}
                          </span>
                        </label>
                      </li>
                    ))
                  ) : (
                    <li>No brands available</li> // Fallback khi không có thương hiệu
                  )}
                </ul>
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* Phần hiển thị sản phẩm */}
      <div className="flex-1 p-4">
        {Array.isArray(products) && products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full min-h-max dark:bg-base-200">
            {products.map((product, index) =>
              index < 8 ? (
                <div
                  key={product.productID} // Dùng productID thay vì productVersionID
                  className="group relative block overflow-hidden bg-white"
                >
                  {/* Hình ảnh sản phẩm */}
                  <div className="relative w-full h-48">
                    <img
                      src={product.productVersionDTOs[0]?.image ||`https://www.lg.com/lg5-common/images/common/product-default-list-350.jpg`} // Chỗ này thay bằng URL ảnh mặc định nếu không có
                      className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-105"
                      alt={product.name}
                      onClick={() => handleViewDetails(product.productID)}
                    />
                    {/* Giảm giá */}
                    {product.discountPercentage > 0 && (
                      <p className="absolute top-2 left-2 bg-red-600 text-white font-semibold text-xs px-2 py-1 rounded-md shadow-md">
                        - {product.discountPercentage}%
                      </p>
                    )}
                  </div>

                  {/* Thông tin sản phẩm */}
                  <div className="relative border border-gray-100 dark:border-gray-800 bg-white dark:bg-base-200 p-4">
                    <p className="text-sm text-gray-900 dark:text-white h-8 overflow-hidden text-ellipsis whitespace-nowrap transform scale-95">
                      <b>{product.name}</b>
                    </p>

                    {/* Đánh giá sản phẩm */}
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
                          <p className="ms-2 text-sm font-bold text-gray-900 text-dark dark:text-white">
                            {product.averageRating.toFixed(1)}/5
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-800 text-dark dark:text-white">Chưa có đánh giá</p>
                      )}
                    </div>

                    {/* Hiển thị giá */}
                    {formatCurrency(product.price) === formatCurrency(product.discountPrice) ? (
                      <span
                        className="mt-1 text-sm text-red-600 max-h-10"
                        style={{
                          animation: "blink 1s linear infinite",
                        }}
                      >
                        <b>{formatCurrency(product.price)}</b>
                      </span>
                    ) : (
                      <>
                        <span className="mt-1 text-xs text-gray-500">
                          <s>{formatCurrency(product.price)}</s>
                        </span>{" "}
                        <span
                          className="mt-1 text-sm text-red-600 max-h-10"
                          style={{
                            animation: "blink 1s linear infinite",
                          }}
                        >
                          <b>{formatCurrency(product.discountPrice)}</b>
                        </span>
                      </>
                    )}

                    <style>
                      {
                        `@keyframes blink {
                        0 %, 100 % { opacity: 1; }
                  50% {opacity: 0; }
                }`
                      }
                    </style>
                    <br/>
                    {/* Số lượng đã bán và còn lại */}
                    <span className="mt-1 text-xs text-gray-400">Đã bán: {product.quantitySold}</span><br/>
                    <span className="mt-1 text-xs text-gray-400">
                      Còn:{" "}
                      {product.quantityAvailable === 0 ? (
                        <span className="text-red-600">Đã bán hết</span>
                      ) : (
                        <span
                          className={product.quantityAvailable < 10 ? "text-red-600" : "text-gray-400"}
                        >
                          {product.quantityAvailable} sản phẩm
                        </span>
                      )}
                    </span>

                    {/* Nút xem chi tiết */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleViewDetails(product.productID); // Chuyển trang đến chi tiết sản phẩm
                      }}
                    >
                      <button
                        type="submit"
                        className="w-full rounded btn btn-info p-2 text-xs text-white"
                      >
                        Xem chi tiết
                      </button>
                    </form>
                  </div>
                </div>
              ) : null
            )}
          </div>
        ) : (
          <p className="text-center text-gray-600">Không có sản phẩm tương ứng</p>
        )}
        {/* Phân trang */}
        <div className="mt-4 flex justify-center">
          <div className="join grid grid-cols-2 gap-4">
            <button
              className="join-item btn btn-outline"
              onClick={handlePreviousPage}
              disabled={page === 0}
            >
              Trang trước
            </button>
            <button
              className="join-item btn btn-outline"
              onClick={handleNextPage}
              disabled={page === totalPages - 1}
            >
              Trang tiếp theo
            </button>
          </div>
        </div>
      </div>

    </div >

  );
}

export default Product;
