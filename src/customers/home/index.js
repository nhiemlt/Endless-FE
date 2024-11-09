import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import CheckIcon from '@heroicons/react/24/outline/CheckIcon';
import ForwardIcon from '@heroicons/react/24/outline/ForwardIcon';
import GiftIcon from '@heroicons/react/24/outline/GiftIcon';
import BanknotesIcon from '@heroicons/react/24/outline/BanknotesIcon';
import HandThumbUpIcon from '@heroicons/react/24/outline/HandThumbUpIcon';
import PhoneArrowUpRightIcon from '@heroicons/react/24/outline/PhoneArrowUpRightIcon';
import productVersionService from "../../services/productVersionService";


function Home() {

  const [products, setProducts] = useState([]);

  return (
    <div>
      <main className="flex flex-col gap-y-20 w-full">

        <section className="container p-5 mb-2">
          <div className="bg-white dark:bg-base-100 flex relative items-center overflow-hidden">
            <div className="container mx-auto px-6 flex relative py-16">
              <div className="sm:w-2/3 lg:w-2/5 flex flex-col relative">
                <h4 className="font-bebas-neue uppercase text-5xl sm:text-5xl font-black flex flex-col leading-none dark:text-white text-gray-800">
                  Khám Phá
                  <span className="text-7xl sm:text-7xl">ENDLESS</span>
                </h4>
                <p className="text-sm sm:text-base text-gray-700 dark:text-white">
                  Chào mừng bạn đến với ENDLESS – điểm đến lý tưởng cho những tín đồ yêu thích công nghệ!
                  Tại ENDLESS, chúng tôi cung cấp một loạt các sản phẩm điện tử chất lượng cao với mức giá hấp dẫn, giúp bạn dễ dàng chọn lựa và sở hữu những thiết bị công nghệ tiên tiến. Hãy khám phá các ưu đãi đặc biệt và trải nghiệm dịch vụ giao hàng nhanh chóng, an toàn.
                  Cảm ơn bạn đã lựa chọn ENDLESS – nơi mua sắm không giới hạn!
                </p>
                <div className="flex mt-8">
                  <a
                    href="#"
                    className="uppercase py-2 px-4 rounded-lg bg-pink-500 border-2 border-transparent text-white text-md mr-4 hover:bg-pink-400"
                  >
                    Băt đầu ngay
                  </a>
                  <a
                    href="#"
                    className="uppercase py-2 px-4 rounded-lg bg-transparent border-2 border-pink-500 text-pink-500 dark:text-white hover:bg-pink-500 hover:text-white text-md"
                  >
                    Xem thêm
                  </a>
                </div>
              </div>
              <div className="hidden sm:block sm:w-1/3 lg:w-3/5 relative">
                <img
                  src="https://www.tailwind-kit.com/images/object/10.png"
                  className="max-w-xs md:max-w-sm m-auto"
                  alt="Watch"
                />
              </div>
            </div>
          </div>
        </section>


        <section className="p-5 mb-5 bg-white">
          <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-2xl">Được tin cậy bởi các doanh nghiệp thương mại điện tử</h2>

              <p className="mt-4 text-gray-500 sm:text-sm">
                ENDLESS tự hào cung cấp cho các doanh nghiệp thương mại điện tử những sản phẩm chất lượng, dịch vụ chăm sóc khách hàng tận tâm và các giải pháp công nghệ tiên tiến. Chúng tôi cam kết mang đến cho khách hàng một trải nghiệm mua sắm tuyệt vời, giúp họ phát triển mạnh mẽ trong thế giới số.
              </p>
            </div>

            <dl className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col rounded-lg bg-blue-50 px-4 py-8 text-center">
                <dt className="order-last text-lg font-medium text-gray-500">Tổng doanh thu</dt>

                <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">$4.8m</dd>
              </div>

              <div className="flex flex-col rounded-lg bg-blue-50 px-4 py-8 text-center">
                <dt className="order-last text-lg font-medium text-gray-500">Sản phẩm chính thức</dt>

                <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">24</dd>
              </div>

              <div className="flex flex-col rounded-lg bg-blue-50 px-4 py-8 text-center">
                <dt className="order-last text-lg font-medium text-gray-500">Tổng số sản phẩm</dt>

                <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">86</dd>
              </div>

              <div className="flex flex-col rounded-lg bg-blue-50 px-4 py-8 text-center">
                <dt className="order-last text-lg font-medium text-gray-500">Số lượt tải về</dt>

                <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">86k</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="p-5 mb-5 bg-white">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3">
              {/* Free Shipping */}
              <div className="flex items-center space-x-3">
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
              <div className="flex items-center space-x-3">
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
              <div className="flex items-center space-x-3">
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
              <div className="flex items-center space-x-3">
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
          <div className="container bg-white rounded-xl shadow-lg">
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

        <section className="mb-5 p-5">
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

        <section className="p-3 mb-5">
          <div className="container">
            <div className="flex justify-between items-center">
              <h1 className="text-lg font-bold">Sản phẩm bán chạy</h1>
              <a href="/product" className="text-primary">View all</a>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 mt-5">
              {/* Product Card */}
              <div className="flex flex-col">
                <div className="relative w-full">
                  <span className="absolute top-2 left-2 bg-yellow-400 text-white px-2 py-1 text-xs font-bold rounded">-10%</span>
                  <a href="product/detail?id=1">
                    <img src="./images/iphone15promax.png" className="w-full rounded-lg" alt="Iphone 15" />
                  </a>
                </div>
                <div className="w-full pl-4 mt-2">
                  <h6 className="text-red-500">Apple</h6>
                  <h4 className="font-bold text-lg">Iphone 15</h4>
                  <h6 className="mt-1 flex items-center">
                    <i className="fa-solid fa-star text-yellow-400 mr-1"></i> 4.9/5
                  </h6>
                  <div className="flex items-center space-x-2">
                    <b className="text-red-500">$300.00</b>
                    <s className="text-gray-500">$350</s>
                  </div>
                  <a href="cart?prod=1" className="mt-2 inline-block bg-blue-500 text-white px-3 py-1 rounded">Add to cart</a>
                </div>
              </div>

              {/* Product Card 2 */}
              <div className="flex flex-col">
                <div className="relative w-full">
                  <span className="absolute top-2 left-2 bg-yellow-400 text-white px-2 py-1 text-xs font-bold rounded">-10%</span>
                  <a href="product/detail?id=1">
                    <img src="./images/iphone15promax.png" className="w-full rounded-lg" alt="Iphone 15 Pro" />
                  </a>
                </div>
                <div className="w-full pl-4 mt-2">
                  <h6 className="text-red-500">Apple</h6>
                  <h4 className="font-bold text-lg">Iphone 15 Pro</h4>
                  <h6 className="mt-1 flex items-center">
                    <i className="fa-solid fa-star text-yellow-400 mr-1"></i> 4.9/5
                  </h6>
                  <div className="flex items-center space-x-2">
                    <b className="text-red-500">$350.00</b>
                    <s className="text-gray-500">$400</s>
                  </div>
                  <a href="cart?prod=1" className="mt-2 inline-block bg-blue-500 text-white px-3 py-1 rounded">Add to cart</a>
                </div>
              </div>

              {/* Product Card 3 */}
              <div className="flex flex-col">
                <div className="relative w-full">
                  <span className="absolute top-2 left-2 bg-yellow-400 text-white px-2 py-1 text-xs font-bold rounded">-10%</span>
                  <a href="product/detail?id=1">
                    <img src="./images/iphone15promax.png" className="w-full rounded-lg" alt="Iphone 15 Pro Max" />
                  </a>
                </div>
                <div className="w-full pl-4 mt-2">
                  <h6 className="text-red-500">Apple</h6>
                  <h4 className="font-bold text-lg">Iphone 15 Pro Max</h4>
                  <h6 className="mt-1 flex items-center">
                    <i className="fa-solid fa-star text-yellow-400 mr-1"></i> 4.9/5
                  </h6>
                  <div className="flex items-center space-x-2">
                    <b className="text-red-500">$400.00</b>
                    <s className="text-gray-500">$450</s>
                  </div>
                  <a href="cart?prod=1" className="mt-2 inline-block bg-blue-500 text-white px-3 py-1 rounded">Add to cart</a>
                </div>
              </div>

              {/* Product Card 4 */}
              <div className="flex flex-col">
                <div className="relative w-full">
                  <span className="absolute top-2 left-2 bg-yellow-400 text-white px-2 py-1 text-xs font-bold rounded">-10%</span>
                  <a href="product/detail?id=1">
                    <img src="./images/iphone15promax.png" className="w-full rounded-lg" alt="Iphone 14" />
                  </a>
                </div>
                <div className="w-full pl-4 mt-2">
                  <h6 className="text-red-500">Apple</h6>
                  <h4 className="font-bold text-lg">Iphone 14</h4>
                  <h6 className="mt-1 flex items-center">
                    <i className="fa-solid fa-star text-yellow-400 mr-1"></i> 4.7/5
                  </h6>
                  <div className="flex items-center space-x-2">
                    <b className="text-red-500">$250.00</b>
                    <s className="text-gray-500">$300</s>
                  </div>
                  <a href="cart?prod=1" className="mt-2 inline-block bg-blue-500 text-white px-3 py-1 rounded">Add to cart</a>
                </div>
              </div>

              {/* Product Card 5 */}
              <div className="flex flex-col">
                <div className="relative w-full">
                  <span className="absolute top-2 left-2 bg-yellow-400 text-white px-2 py-1 text-xs font-bold rounded">-10%</span>
                  <a href="product/detail?id=1">
                    <img src="./images/iphone15promax.png" className="w-full rounded-lg" alt="Iphone SE" />
                  </a>
                </div>
                <div className="w-full pl-4 mt-2">
                  <h6 className="text-red-500">Apple</h6>
                  <h4 className="font-bold text-lg">Iphone SE</h4>
                  <h6 className="mt-1 flex items-center">
                    <i className="fa-solid fa-star text-yellow-400 mr-1"></i> 4.6/5
                  </h6>
                  <div className="flex items-center space-x-2">
                    <b className="text-red-500">$200.00</b>
                    <s className="text-gray-500">$250</s>
                  </div>
                  <a href="cart?prod=1" className="mt-2 inline-block bg-blue-500 text-white px-3 py-1 rounded">Add to cart</a>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}

export default Home