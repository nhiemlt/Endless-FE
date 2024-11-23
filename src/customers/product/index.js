import { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import productVersionService from "../../services/productVersionService";
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
  const [keyword, setKeyword] = useState('');
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filterData, setFilterData] = useState({
    priceMin: '',
    priceMax: '',
    categories: [],
    brands: [],
  });


  // Gọi API lấy danh sách sản phẩm với phân trang và bộ lọc
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productVersionService.getAllProductVersions(page, size, sortBy, direction, keyword);
        setProducts(data.content);
        setTotalPages(data.totalPages); // Cập nhật totalPages từ phản hồi API
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [page, size, sortBy, direction, keyword]);

  // Hàm xử lý khi chuyển sang trang trước đó
  const handlePreviousPage = () => {
    if (page > 0) setPage(page - 1);
  };

  // Hàm xử lý khi chuyển sang trang kế tiếp
  const handleNextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  // Gọi API lấy danh sách danh mục
  const fetchCategories = async () => {
    try {
      const response = await CategoryService.getCategories({});
      setCategories(response.content);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Gọi API lấy danh sách thương hiệu
  const fetchBrands = async () => {
    try {
      const response = await BrandService.getBrands({});
      setBrands(response.content); // Giả sử API trả về { content: [...], totalPages: ... }
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);


  // Hàm gọi API lọc sản phẩm
  const fetchFilteredProducts = async (filterData) => {
    try {
      const filteredData = await productVersionService.filterProductVersions(filterData);
      // Lưu kết quả lọc vào state
      setProducts(filteredData);
    } catch (error) {
      console.error("Error fetching filtered products:", error);
    }
  };

  useEffect(() => {
    console.log("Current filter data:", filterData);  // Kiểm tra dữ liệu lọc
    fetchFilteredProducts(filterData);                // Gọi API lọc khi `filterData` thay đổi
  }, [filterData]);


  // Thêm console.log để kiểm tra khi cập nhật giá trị
  const handlePriceChange = (e, field) => {
    setFilterData((prev) => {
      const newData = { ...prev, [field]: e.target.value };
      console.log("Updated price filter data:", newData);
      return newData;
    });
  };

  const handleCategoryChange = (categoryID) => {
    setFilterData((prev) => {
      const newCategories = prev.categories.includes(categoryID)
        ? prev.categories.filter((id) => id !== categoryID)
        : [...prev.categories, categoryID];
      const newData = { ...prev, categories: newCategories };
      console.log("Updated category filter data:", newData);
      return newData;
    });
  };

  const handleBrandChange = (brandID) => {
    setFilterData((prev) => {
      const newBrands = prev.brands.includes(brandID)
        ? prev.brands.filter((id) => id !== brandID)
        : [...prev.brands, brandID];
      const newData = { ...prev, brands: newBrands };
      console.log("Updated brand filter data:", newData);
      return newData;
    });
  };


  //Hàm định dạng tiền 
  const formatCurrency = (amount) => {
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  //Hàm thêm sản phẩm vào giỏ hàng
  const handleAddToCart = async (product) => {
    const cartModel = { productVersionID: product.productVersionID, quantity: 1 };
    try {
      await CartService.addToCart(cartModel);
      dispatch(showNotification({ message: "Sản phẩm đã được thêm vào giỏ hàng.", status: 1 }));
    } catch (error) {
      dispatch(showNotification({ message: "Lỗi khi thêm vào giỏ hàng.", status: 0 }));
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
    }
  };

  //Hàm chuyển trang chi tiết sản phẩm
  const handleImageClick = (product) => {
    navigate(`/product-detail/${product.productVersionID}`, { state: { product } });
  };

  return (
    <div className="flex">
      <div className="w-1/4 p-4 dark:bg-base-100 bg-white rounded-lg shadow-md">

        {/* Phần tìm kiếm */}
        <div className="mt-3">
          <label
            htmlFor="searchKeyword"
            className="input input-primary flex items-center gap-2 text-xs font-medium"
          >
            <input
              id="searchKeyword"
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
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

        {/* Dropdown Sort By */}
        <div>
          <label htmlFor="SortBy" className="block text-xs font-medium dark:text-white text-gray-900 mt-5"><b>Sắp xếp</b></label>
          <select id="SortBy" value={`${sortBy}, ${direction}`} onChange={(e) => {
            const [field, dir] = e.target.value.split(', ');
            setSortBy(field);
            setDirection(dir);
          }} className="mt-1 rounded border-gray-300 text-sm select select-secondary w-full max-w-xs dark:text-white text-gray-900">
            <option value="versionName, ASC">Tên sản phẩm - Tăng dần</option>
            <option value="versionName, DESC">Tên sản phẩm - Giảm dần</option>
            <option value="price, ASC">Tiền - Tăng dần</option>
            <option value="price, DESC">Tiền - Giảm dần</option>
          </select>
        </div>

        {/* Phần lọc khoảng giá */}
        <div className="flex items-center gap-2 mt-5">
          <input
            type="number"
            min="0"
            placeholder="Giá thấp"
            className="input input-success w-full h-10 max-w-xs text-xs"
            value={filterData.priceMin}
            onChange={(e) => handlePriceChange(e, 'priceMin')}
          />
          <span className="text-xl">-</span>
          <input
            type="number"
            min="0"
            placeholder="Giá cao"
            className="input input-success w-full h-10 max-w-xs text-xs"
            value={filterData.priceMax}
            onChange={(e) => handlePriceChange(e, 'priceMax')}
          />
        </div>

        {/* Phần lọc theo thương hiệu và danh mục sản phẩm */}
        <div>
          <p className="block text-xs font-medium dark:text-white text-gray-900 mt-5"><b>Lọc theo danh mục</b></p>
          <div className="mt-2 space-y-2">
            <details className="overflow-hidden rounded border border-gray-300">
              <summary className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition">
                <span className="text-sm font-medium dark:text-white text-gray-900">Danh sách danh mục</span>
              </summary>
              <div className="border-t border-gray-200 dark:bg-base-100 bg-white">
                <ul className="space-y-1 border-t border-gray-200 p-4">
                  {categories.map((category) => (
                    <li key={category.categoryID}>
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filterData.categories.includes(category.categoryID)} // Kiểm tra xem category có được chọn không
                          onChange={() => handleCategoryChange(category.categoryID)} // Gọi hàm handleCategoryChange khi checkbox thay đổi
                        />
                        <span className="text-sm font-medium dark:text-white text-gray-900">{category.name}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          </div>

          {/* Lọc theo thương hiệu */}
          <p className="block text-xs font-medium dark:text-white text-gray-900 mt-5"><b>Lọc theo thương hiệu</b></p>
          <div className="mt-2 space-y-2">
            <details className="overflow-hidden rounded border border-gray-300">
              <summary className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition">
                <span className="text-sm font-medium dark:text-white text-gray-900">Danh sách thương hiệu</span>
              </summary>
              <div className="border-t border-gray-200 dark:bg-base-100 bg-white">
                <ul className="space-y-1 border-t border-gray-200 p-4">
                  {brands.map((brand) => (
                    <li key={brand.brandID}>
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          value={brand.brandID}
                          checked={filterData.brands.includes(brand.brandID)} // Kiểm tra xem checkbox có trong danh sách brands đã chọn không
                          onChange={() => handleBrandChange(brand.brandID)} // Khi chọn hoặc bỏ chọn, gọi hàm handleBrandChange
                        />
                        <span className="text-sm font-medium dark:text-white text-gray-900">{brand.brandName}</span>
                      </label>
                    </li>
                  ))}

                </ul>
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* Phần hiển thị sản phẩm */}
      <div className="flex-1 p-4">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((product, index) =>
              index < 8 ? (
                <div
                  key={product.productVersionID}
                  className="group relative block overflow-hidden"
                >
                  <img
                    src={product.image}
                    className="h-30 w-full object-cover transition duration-500 group-hover:scale-105"
                    onClick={() => handleImageClick(product)}
                    alt={product.product.name}
                  />
                  {/* Chỉ hiển thị giảm giá nếu product.discountPercentage > 0 */}
                  {product.discountPercentage > 0 && (
                    <p className="absolute top-2 left-2 bg-red-600 text-white font-semibold text-xs px-2 py-1 rounded-md shadow-md">
                      - {product.discountPercentage}%
                    </p>
                  )}
                  <div className="relative border border-gray-100 bg-white p-4">
                    <p className="mt-1 text-sm text-gray-900 h-8 overflow-hidden text-ellipsis whitespace-nowrap transform scale-95">
                      <b>{product.product.name} | {product.versionName}</b>
                    </p>
                    {/* Hiển thị đánh giá */}
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
                        <p className="text-sm font-bold text-gray-800 text-dark">
                          Chưa có đánh giá
                        </p>
                      )}
                    </div>

                    {/* Kiểm tra giá để hiển thị giá và hiệu ứng */}
                    {formatCurrency(product.price) === formatCurrency(product.discountPrice) ? (
                      <span
                        className="mt-1 text-sm text-red-600"
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
                          className="mt-1 text-sm text-red-600"
                          style={{
                            animation: "blink 1s linear infinite",
                          }}
                        >
                          <b>{formatCurrency(product.discountPrice)}</b>
                          <br />
                        </span>
                      </>
                    )}

                    <style>
                      {`
                          @keyframes blink {
                            0%, 100% { opacity: 1; }
                            50% { opacity: 0; }
                          }
                      `}
                    </style>

                    <br />
                    <span className="mt-1 text-xs text-gray-400">Đã bán: {product.quantitySold} | </span>
                    <span className="mt-1 text-xs text-gray-400">
                      Tồn kho:{" "}
                      <span className={product.quantityAvailable < 10 ? "text-red-600" : "text-gray-400"}>
                        {product.quantityAvailable}
                      </span>
                    </span>

                    <form
                      className="mt-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleAddToCart(product);
                      }}
                    >
                      <button type="submit" className="w-full rounded btn btn-warning p-2 text-xs">
                        Thêm vào giỏ hàng
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
          <div className="join grid grid-cols-2">
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
