import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { showNotification } from "../../features/common/headerSlice";
import CheckIcon from '@heroicons/react/24/outline/CheckIcon';
import ForwardIcon from '@heroicons/react/24/outline/ForwardIcon';
import GiftIcon from '@heroicons/react/24/outline/GiftIcon';
import BanknotesIcon from '@heroicons/react/24/outline/BanknotesIcon';
import HandThumbUpIcon from '@heroicons/react/24/outline/HandThumbUpIcon';
import PhoneArrowUpRightIcon from '@heroicons/react/24/outline/PhoneArrowUpRightIcon';
import productVersionService from "../../services/productVersionService";
import CartService from "../../services/CartService";
import TopSellerByCategory from "./components/TopSellByCategory"
import TopSellingProducts from './components/getTopSellingProductVersions';
import FptChatbotButton from './components/FptChatbotButton'; // Import component chatbot button


const Home = ({ categoryID }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [products, setProducts] = useState([]); // Danh sách sản phẩm
  const [productByCategories, setProductByCategories] = useState([]); // Danh sách sản phẩm
  const productsSectionRef = useRef(null);
  const productsSection = useRef(null);
  const [productCount, setProductCount] = useState(null);
  const [brandCount, setBrandCount] = useState(null);

  const imgElement = document.querySelector('img[alt="logobutton"]');


  useEffect(() => {
    // Lấy top sản phẩm bán chạy
    const fetchTopSellingProducts = async () => {
      try {
        const data = await productVersionService.getTopSellingProductVersionsAllTime();
        setProducts(data.content);  // Giả sử response là một mảng
      } catch (error) {
        console.error("Error fetching top-selling products:", error);
      }
    };

    fetchTopSellingProducts();
  }, []);

  useEffect(() => {
    // Lấy số lượng sản phẩm từ service
    const fetchProductCount = async () => {
      try {
        const data = await productVersionService.getProductCount();
        setProductCount(parseInt(data.replace(/\D/g, ''), 10)); // Lưu số lượng sản phẩm vào state
      } catch (error) {
        console.error("Error fetching product count:", error);
      }
    };

    // Lấy số lượng thương hiệu từ service
    const fetchBrandCount = async () => {
      try {
        const data = await productVersionService.getBrandCount(); // Giả sử có service brandService
        setBrandCount(parseInt(data.replace(/\D/g, ''), 10)); // Lưu số lượng thương hiệu vào state
      } catch (error) {
        console.error("Error fetching brand count:", error);
      }
    };

    // Gọi các hàm khi component được render
    fetchProductCount();
    fetchBrandCount();
  }, []); // Chạy khi component mount lần đầu tiên

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

  const scrollToProducts = () => {
    // Cuộn tới phần tử có ref 'productsSectionRef'
    productsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div>
      <main className="flex flex-col">

        {/* Khám Phá Endless Section */}
        {/* Section 2: Explore Endless */}
        <section className="container px-6 py-16 mb-2 ">
          <div className="bg-white dark:bg-base-100 flex items-center overflow-hidden p-10 xs:p-2 sm:p-3 md:p-5">
            <div className="flex flex-col lg:flex-row mx-auto md:space-x-6 lg:space-x-6 xl:space-x-6">
              {/* Left Section: Text Content */}
              <div className="lg:w-1/2 flex flex-col text-center lg:text-left">
                <h4 className="font-bebas-neue text-5xl sm:text-6xl font-black text-gray-900 dark:text-white leading-none">
                  Khám Phá
                  <span className="text-5xl sm:text-8xl"> ENDLESS</span>
                </h4>
                <p className="text-sm sm:text-base text-gray-900 dark:text-white mt-4">
                  Chào mừng bạn đến với ENDLESS – điểm đến lý tưởng cho những tín đồ yêu thích công nghệ!
                  Tại ENDLESS, chúng tôi cung cấp một loạt các sản phẩm điện tử chất lượng cao với mức giá hấp dẫn,
                  giúp bạn dễ dàng chọn lựa và sở hữu những thiết bị công nghệ tiên tiến. Hãy khám phá các ưu đãi đặc biệt
                  và trải nghiệm dịch vụ giao hàng nhanh chóng, an toàn. Cảm ơn bạn đã lựa chọn ENDLESS – nơi mua sắm không giới hạn!
                </p>
                <div className="flex justify-center lg:justify-start mt-8">
                  <a
                    href="#products"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToProducts(); // Gọi hàm cuộn xuống
                    }}
                    className="uppercase py-2 px-4 rounded-lg bg-pink-500 text-white font-bold text-md hover:bg-pink-400 transition"
                  >
                    Bắt đầu ngay
                  </a>
                </div>
              </div>

              {/* Right Section: TopSellingProducts Component */}
              <div className="lg:w-1/2 lg:justify-end mt-8 xs:mt-1 sm:mt-2 md:mt-3 lg:mt-0">
                <TopSellingProducts />
              </div>
            </div>
          </div>
        </section>

        {/* Phần top sản phẩm theo danh mục */}
        <session>
          <TopSellerByCategory></TopSellerByCategory>
        </session>

        {/* Phần lọc giá */}
        <section className="p-5 mb-5 dark:bg-base-100  bg-white">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3">
              {/* Free Shipping */}
              <div className="flex items-center space-x-3 dark:text-white text-gray-900">
                <div className="text-center text-5xl font-bold">
                  <i className="fa-solid fa-truck-fast"></i>
                </div>
                <div>
                  <b>Free Shipping</b>
                  <br />
                  <small>From all orders over $100</small>
                </div>
              </div>

              {/* Daily Surprise Offers */}
              <div className="flex items-center space-x-3 dark:text-white text-gray-900">
                <div className="text-center text-5xl font-bold">
                  <i className="fa-solid fa-gift"></i>
                </div>
                <div>
                  <b>Daily Surprise Offers</b>
                  <br />
                  <small>Save up to 25% off</small>
                </div>
              </div>

              {/* Support 24/7 */}
              <div className="flex items-center space-x-3 dark:text-white text-gray-900">
                <div className="text-center text-5xl font-bold">
                  <i className="fa-solid fa-headset"></i>
                </div>
                <div>
                  <b>Support 24/7</b>
                  <br />
                  <small>Shop with an expert</small>
                </div>
              </div>

              {/* Affordable Prices */}
              <div className="flex items-center space-x-3 dark:text-white text-gray-900">
                <div className="text-center text-5xl font-bold">
                  <i className="fa-solid fa-hand-holding-dollar"></i>
                </div>
                <div>
                  <b>Affordable Prices</b>
                  <br />
                  <small>Get Factory direct price</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="p-3 mt-3 mb-5">
          <div className="container dark:bg-blue-50 bg-white rounded-xl shadow-lg">
            <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 text-center gap-3 p-3">
              <div className="flex justify-center items-center">
                <img src="./images/apple.png" className="w-1/2" alt="Apple" />
              </div>
              <div className="flex justify-center items-center p-3">
                <img src="./images/oppo.png" className="w-1/2" alt="Oppo" />
              </div>
              <div className="flex justify-center items-center p-3">
                <img src="./images/techno.png" className="w-1/2" alt="Techno" />
              </div>
              <div className="flex justify-center items-center p-3">
                <img src="./images/xiaomi.png" className="w-1/2" alt="Xiaomi" />
              </div>
              <div className="flex justify-center items-center p-3">
                <img src="./images/sony.png" className="w-1/2" alt="Sony" />
              </div>
              <div className="flex justify-center items-center p-3">
                <img src="./images/huawei.png" className="w-1/2" alt="Huawei" />
              </div>
              <div className="flex justify-center items-center p-3">
                <img src="./images/vivo.png" className="w-1/2" alt="Vivo" />
              </div>
              <div className="flex justify-center items-center p-3">
                <img src="./images/realme.png" className="w-1/2" alt="Realme" />
              </div>
              <div className="flex justify-center items-center p-3">
                <img src="./images/samsung.png" className="w-1/2" alt="Samsung" />
              </div>
              <div className="flex justify-center items-center p-3">
                <img src="./images/lg.png" className="w-1/2" alt="LG" />
              </div>
              <div className="flex justify-center items-center p-3">
                <img src="./images/oneplus.png" className="w-1/2" alt="OnePlus" />
              </div>
              <div className="flex justify-center items-center p-3">
                <img src="./images/google.png" className="w-1/2" alt="Google" />
              </div>
            </div>
          </div>
        </section>

        <section className="mb-5 p-5 dark:bg-base-100 bg-white">
          <section className=" text-black dark:text-white">
            <div className="max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
              <div className="max-w-xl">
                <h2 className="text-3xl font-bold sm:text-4xl text-black dark:text-white">Điều gì làm chúng tôi đặc biệt</h2>
                <p className="mt-4  text-black dark:text-white">
                  Chúng tôi cung cấp sản phẩm chất lượng cao với mức giá hợp lý, cam kết mang đến cho khách hàng trải nghiệm mua sắm tuyệt vời nhất.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-8 md:mt-16 md:grid-cols-2 md:gap-12 lg:grid-cols-3">
                {/* Chất lượng sản phẩm đảm bảo */}
                <div className="flex items-start gap-4">
                  <CheckIcon className="w-20 h-20 text-black dark:text-white"></CheckIcon>
                  <div>
                    <h2 className="text-lg font-bold text-black dark:text-white">Chất lượng sản phẩm đảm bảo</h2>
                    <p className="mt-1 text-sm text-black dark:text-white">
                      Mỗi sản phẩm của chúng tôi đều được chọn lọc kỹ lưỡng, đảm bảo chất lượng cao, đáp ứng nhu cầu của mọi khách hàng.
                    </p>
                  </div>
                </div>

                {/* Giá cả hợp lý */}
                <div className="flex items-start gap-4">
                  <BanknotesIcon className="w-20 h-20 text-black dark:text-white"></BanknotesIcon>
                  <div>
                    <h2 className="text-lg font-bold text-black dark:text-white">Giá cả hợp lý</h2>
                    <p className="mt-1 text-sm text-black dark:text-white">
                      Chúng tôi luôn đảm bảo cung cấp sản phẩm với mức giá cạnh tranh, giúp bạn mua sắm tiết kiệm mà vẫn nhận được giá trị xứng đáng.
                    </p>
                  </div>
                </div>

                {/* Dịch vụ chăm sóc khách hàng */}
                <div className="flex items-start gap-4">
                  <PhoneArrowUpRightIcon className="w-20 h-20 text-black dark:text-white"></PhoneArrowUpRightIcon>
                  <div>
                    <h2 className="text-lg font-bold text-black dark:text-white">Dịch vụ chăm sóc khách hàng</h2>
                    <p className="mt-1 text-sm text-black dark:text-white">
                      Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7, giải đáp mọi thắc mắc và giúp bạn có trải nghiệm mua sắm tốt nhất.
                    </p>
                  </div>
                </div>

                {/* Giao hàng nhanh chóng */}
                <div className="flex items-start gap-4">
                  <ForwardIcon className="w-20 h-20 text-black dark:text-white"></ForwardIcon>
                  <div>
                    <h2 className="text-lg font-bold text-black dark:text-white">Giao hàng nhanh chóng</h2>
                    <p className="mt-1 text-sm text-black dark:text-white">
                      Chúng tôi cam kết giao hàng nhanh chóng, đúng thời gian, đảm bảo sản phẩm đến tay bạn trong thời gian ngắn nhất.
                    </p>
                  </div>
                </div>
                {/* Ưu đãi thường xuyên */}
                <div className="flex items-start gap-4">
                  <GiftIcon className="w-20 h-20 text-black dark:text-white"></GiftIcon>
                  <div>
                    <h2 className="text-lg font-bold text-black dark:text-white">Ưu đãi</h2>
                    <p className="mt-1 text-sm text-black dark:text-white">
                      Chúng tôi cung cấp các chương trình giảm giá hấp dẫn dành cho tất cả khách hàng. Tất cả đều có thể tham gia vào các chương trình khuyến mãi với mức giảm giá đặc biệt!
                    </p>
                  </div>
                </div>

                {/* Đánh giá của khách hàng */}
                <div className="flex items-start gap-4">
                  <HandThumbUpIcon className="w-20 h-20 text-black dark:text-white"></HandThumbUpIcon>
                  <div>
                    <h2 className="text-lg font-bold text-black dark:text-white">Đánh giá tích cực từ khách hàng</h2>

                    <p className="mt-1 text-sm text-black dark:text-white">
                      Những đánh giá tích cực từ khách hàng khi trải nghiệm sản phẩm của chúng tôi, giúp những khách hàng có sự tin cậy vào sản phẩm mà chúng tôi mang đến.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </section>

        <section
          ref={productsSectionRef} // Gán ref cho phần tử này
          className="p-3 mb-5 dark:bg-base-100 bg-white"
          id="products"
        >
          <div className="container">
            <div className="flex justify-between items-center">
              <h1 className="text-lg font-bold">Sản phẩm bán chạy</h1>
              <a href="/products" className="text-primary">Tất cả sản phẩm</a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-3">
              {Array.isArray(products) && products.length > 0 ? (
                products.map((product) => (
                  <div key={product.productVersionID} className="group relative block overflow-hidden">
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
                    <div className="relative bg-blue-50 dark:bg-base-200 p-4">
                      <p className="mt-1 text-sm text-gray-900 h-8 dark:text-white overflow-hidden text-ellipsis whitespace-nowrap transform scale-95">
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
                            <p className="ms-2 text-sm font-bold text-gray-900 text-dark dark:text-white">
                              {product.averageRating.toFixed(1)}/5
                            </p>
                          </>
                        ) : (
                          <p className="text-sm text-gray-800 text-dark dark:text-white">
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
                        {`@keyframes blink {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0; }}`}
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

                      {/* Nút Thêm vào giỏ hàng */}
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
                ))
              ) : (
                <p>Không có sản phẩm bán chạy nào.</p>
              )}
            </div>
          </div>
        </section>

      </main>



      {/* Add FPT chatbot button to the layout */}
      <FptChatbotButton /> {/* This is where we add the chatbot button */}
    </div>
  )


}

export default Home