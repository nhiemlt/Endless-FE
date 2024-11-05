import { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom'; // Nhập useNavigate
import productVersionService from "../../services/productVersionService";
import CartService from "../../services/CartService";
import { showNotification } from "../../features/common/headerSlice";

function Product() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Khởi tạo useNavigate
  const [products, setProducts] = useState([]); // Trạng thái lưu danh sách sản phẩm
  const [searchTerm, setSearchTerm] = useState(""); // Trạng thái lưu từ khóa tìm kiếm

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productVersionService.getAllProductVersions(); // Lấy danh sách sản phẩm
        setProducts(data.content); // Cập nhật danh sách sản phẩm vào trạng thái
      } catch (error) {
        console.error("Error fetching products:", error); // In lỗi nếu có
      }
    };

    fetchProducts(); // Gọi hàm lấy sản phẩm khi component được render
  }, []);

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
      window.location.reload(); // Tải lại trang
    } catch (error) {
      dispatch(showNotification({ message: "Lỗi khi thêm vào giỏ hàng.", status: 0 })); // Hiển thị thông báo lỗi
      console.error("Lỗi khi thêm vào giỏ hàng:", error); // In lỗi nếu có
    }
  };

  // Hàm xử lý khi hình ảnh sản phẩm được chọn
  const handleImageClick = (productId) => {
    navigate(`/product-detail/${productId}`); // Chuyển đến trang chi tiết sản phẩm theo ID
  };
  return (
    <div className="flex">
      {/* Phần lọc và tìm kiếm */}
      <div className="w-1/4 p-4 border-r border-gray-200 bg-gray-50 rounded-lg shadow-md">
        {/* Dropdown Sort By */}
        <div>
          <label htmlFor="SortBy" className="block text-xs font-medium text-gray-700">Sort By</label>
          <select id="SortBy" className="mt-1 rounded border-gray-300 text-sm">
            <option>Sort By</option>
            <option value="Title, DESC">Title, DESC</option>
            <option value="Title, ASC">Title, ASC</option>
            <option value="Price, DESC">Price, DESC</option>
            <option value="Price, ASC">Price, ASC</option>
          </select>
        </div>

        {/* Filters */}
        <div>
          <p className="block text-xs font-medium text-gray-700">Filters</p>
          <div className="mt-1 space-y-2">
            {/* Availability Filter */}
            <details className="overflow-hidden rounded border border-gray-300">
              <summary className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition">
                <span className="text-sm font-medium">Availability</span>
                <span className="transition group-open:-rotate-180">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </span>
              </summary>
              <div className="border-t border-gray-200 bg-white">
                <header className="flex items-center justify-between p-4">
                  <span className="text-sm text-gray-700">0 Selected</span>
                  <button type="button" className="text-sm text-gray-900 underline underline-offset-4">
                    Reset
                  </button>
                </header>
                <ul className="space-y-1 border-t border-gray-200 p-4">
                  <li>
                    <label htmlFor="FilterInStock" className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="FilterInStock"
                        className="size-5 rounded border-gray-300"
                      />
                      <span className="text-sm font-medium text-gray-700">In Stock (5+)</span>
                    </label>
                  </li>
                  <li>
                    <label htmlFor="FilterPreOrder" className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="FilterPreOrder"
                        className="size-5 rounded border-gray-300"
                      />
                      <span className="text-sm font-medium text-gray-700">Pre Order (3+)</span>
                    </label>
                  </li>
                  <li>
                    <label htmlFor="FilterOutOfStock" className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="FilterOutOfStock"
                        className="size-5 rounded border-gray-300"
                      />
                      <span className="text-sm font-medium text-gray-700">Out of Stock (10+)</span>
                    </label>
                  </li>
                </ul>
              </div>
            </details>
          </div>
        </div>

        {/* Price Filter */}
        <details className="overflow-hidden rounded border border-gray-300">
          <summary className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition">
            <span className="text-sm font-medium">Price</span>
            <span className="transition group-open:-rotate-180">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </span>
          </summary>
          {/* Nội dung cho Price Filter (có thể thêm các mục khác nếu cần) */}
        </details>

        {/* Colors Filter */}
        <details className="overflow-hidden rounded border border-gray-300">
          <summary className="flex cursor-pointer items-center justify-between gap-2 p-4 text-gray-900 transition">
            <span className="text-sm font-medium">Colors</span>
            <span className="transition group-open:-rotate-180">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </span>
          </summary>
          {/* Nội dung cho Colors Filter (có thể thêm các mục khác nếu cần) */}
        </details>
      </div>

      {/* Phần hiển thị sản phẩm */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.productVersionID} className="group relative block overflow-hidden">
              <img
                src={product.image}
                className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                onClick={() => handleImageClick(product.productVersionID)} // Thêm sự kiện onClick cho hình ảnh
                alt={product.product.name} // Thêm thuộc tính alt cho hình ảnh
              />
              <div className="relative border border-gray-100 bg-white p-4">
                <p className="mt-2 text-lg text-gray-900 h-20">
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
                        {product.averageRating.toFixed(2)}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm font-bold text-gray-800 text-dark">
                      Chưa có đánh giá
                    </p>
                  )}
                </div>
                <span className="mt-1 text-sm text-gray-500">
                  <s>{formatCurrency(product.price)}</s>
                </span>{" "}
                <span
                  className="mt-1 text-lg text-red-600"
                  style={{
                    animation: "blink 1s linear infinite",
                  }}
                >
                  <b>{formatCurrency(product.discountPrice)}</b>
                  <br />
                </span>

                <style>
                  {`@keyframes blink {
                   0%, 100% { opacity: 1; }
                    50% { opacity: 0; }}`}
                </style>

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
                  <button type="submit" className="w-full rounded btn btn-warning p-2 text-sm">
                    Thêm vào giỏ hàng
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
        {/* Phân trang */}
        <div className="mt-4 flex justify-center">
          <div className="join grid grid-cols-2">
            <button className="join-item btn btn-outline">Previous page</button>
            <button className="join-item btn btn-outline">Next</button>
          </div>
        </div>
      </div>
    </div >
  );
}

export default Product;
