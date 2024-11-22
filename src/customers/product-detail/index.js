import { Link } from 'react-router-dom';
import TitleCard from '../../components/Cards/TitleCard';
import React, { useEffect, useState } from 'react';
import ratingService from "../../services/ratingService";
import { useLocation } from 'react-router-dom';
import { showNotification } from "../../features/common/headerSlice";
import { useDispatch } from "react-redux";
import CartService from "../../services/CartService";
import { useNavigate } from 'react-router-dom';

function ProductDetail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { product } = location.state || {};
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [ratings, setRatings] = useState([]);  // State to store all the ratings
  const [selectedTab, setSelectedTab] = useState(5); // Default to 5 stars tab

  useEffect(() => {
    if (product && product?.productVersionID) {
      // Gọi API để lấy đánh giá theo productVersionID
      ratingService.getRatingsByProductVersionId(product?.productVersionID)
        .then(data => {
          // Sắp xếp đánh giá theo ratingDate giảm dần
          const sortedRatings = data.sort((a, b) => new Date(b.ratingDate) - new Date(a.ratingDate));
          setRatings(sortedRatings);
        })
        .catch(error => {
          console.error("Error fetching ratings:", error);
        });
    }
  }, [product]);

  // Phân loại các đánh giá theo sao
  const ratingCategories = [5, 4, 3, 2, 1]; // Thứ tự giảm dần
  const ratingsByStar = ratingCategories.reduce((acc, stars) => {
    acc[stars] = ratings.filter(rating => rating.ratingValue === stars);
    return acc;
  }, {});

  // Hàm xử lý khi người dùng chọn tab
  const handleTabClick = (tabNumber) => {
    setSelectedTab(tabNumber);
  };

  // Hàm tính số lượng đánh giá cho từng tab sao
  const getRatingCount = (stars) => {
    return ratingsByStar[stars] ? ratingsByStar[stars].length : 0;
  };

  // Hàm để lấy tất cả các đánh giá
  const getAllRatings = () => {
    return ratings;
  };

  //Hàm thêm sản phẩm vào giỏ hàng
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

  return (
    <TitleCard>
      <div className="font-sans bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200">
        <div className="p-4 lg:max-w-7xl max-w-4xl mx-auto">

          {/* Phần sản phẩm */}
          <div className="grid items-start grid-cols-1 lg:grid-cols-5 gap-12 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] p-6 rounded-lg dark:bg-base-100">
            <div className="lg:col-span-2 w-full lg:sticky top-0 text-center">
              <div className="p-1 rounded-lg shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] relative dark:shadow-[0_2px_10px_-3px_rgba(237,237,237,0.3)]">
                <div className="relative">
                  <img
                    src={product?.image || "default-image-url"}
                    alt={product?.product?.name || "product"}
                    className="rounded object-cover w-full"
                  />
                  {/* Chỉ hiển thị giảm giá nếu product.discountPercentage > 0 */}
                  {product.discountPercentage > 0 && (
                    <p className="absolute top-2 left-2 bg-red-600 text-white font-semibold text-xs px-2 py-1 rounded-md shadow-md">
                      - {product.discountPercentage}%
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                {product?.product?.name} | {product?.versionName}
              </h2>
              <div className="flex space-x-2 mt-4">
                {product?.averageRating ? (
                  <>
                    <svg
                      className="w-6 h-6 text-yellow-300"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 22 20"
                    >
                      <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                    </svg>
                    <p className="ms-2 text-xl font-bold text-gray-900 dark:text-gray-100">
                      {product?.averageRating?.toFixed(1)}/5
                    </p>
                  </>
                ) : (
                  <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    Chưa có đánh giá
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-4 mt-8">
                {/* Kiểm tra nếu giá gốc và giá giảm bằng nhau */}
                {product?.price === product?.discountPrice ? (
                  // Nếu bằng nhau, chỉ hiển thị giá giảm
                  <p className="text-red-600 dark:text-red-500 text-2xl font-bold">
                    {product?.discountPrice?.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }) || "Giá giảm"}
                  </p>
                ) : (
                  // Nếu khác nhau, hiển thị cả giá gốc và giá giảm
                  <>
                    <p className="text-red-600 dark:text-red-500 text-2xl font-bold">
                      {product?.discountPrice?.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }) || "Giá giảm"}
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-base">
                      <strike>
                        {product?.price?.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }) || "Giá gốc"}
                      </strike>
                    </p>
                  </>
                )}
              </div>
              <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
                {product?.product?.description}
              </p>
              <div className="mt-8">
                <button
                  type="button"
                  className="flex-1 px-4 py-2.5 border border-yellow-600 dark:bg-yellow-400 bg-transparent dark:hover:bg-yellow-500 text-gray-950 text-sm font-semibold rounded"
                  onClick={() => handleAddToCart(product)} // Thêm sự kiện onClick để gọi hàm handleAddToCart
                >
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          </div>

          {/* Phần thuộc tính */}
          <div className="mt-16 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] p-6 dark:bg-base-100 dark:text-gray-200">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Thông tin chi tiết</h3>
            <ul className="mt-4 space-y-6 text-gray-800 dark:text-gray-100">
              {product.versionAttributes.map((attribute, index) => (
                <li key={index} className="text-sm">
                  {attribute.attributeName}
                  <span className="ml-4 float-right">{attribute.attributeValue}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Phần đánh giá */}
          <div className="mt-16 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] p-6 dark:bg-base-100 dark:text-gray-200">
            <div className="grid md:grid-cols-1 gap-12 mt-4 dark:text-gray-100 text-gray-800">

              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 d-block">
                Đánh giá ({ratings.length})
              </h3>

              {/* Các tab 5 sao, 4 sao, 3 sao, 2 sao, 1 sao và "Tất cả" */}
              <div role="tablist" className="tabs tabs-bordered mt-4 w-full">
                <a
                  role="tab"
                  className={`tab ${selectedTab === 'all' ? 'tab-active text-red-600' : ''} w-full md:w-auto`}
                  onClick={() => handleTabClick('all')}
                >
                  Tất cả ({ratings.length})
                </a>
                {ratingCategories.map(stars => (
                  <a
                    key={stars}
                    role="tab"
                    className={`tab ${selectedTab === stars ? 'tab-active text-red-600' : ''} w-full md:w-auto`}
                    onClick={() => handleTabClick(stars)}
                  >
                    {stars} sao ({getRatingCount(stars)})
                  </a>
                ))}
              </div>

              {/* Hiển thị đánh giá theo tab đã chọn */}
              <div className="mt-4">
                {(selectedTab === 'all' ? getAllRatings() : ratingsByStar[selectedTab])?.map((rating, index) => (
                  <div key={index} className="flex items-start text-gray-800 dark:text-gray-100">
                    <img src={rating?.avatar} className="w-12 h-12 rounded-full border-2 border-white" />
                    <div className="ml-3">
                      <h4 className="text-sm font-bold">{rating?.fullname}</h4>
                      <div className="flex space-x-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 ${i < rating?.ratingValue ? 'fill-yellow-500' : 'fill-[#CED5D8]'}`}
                            viewBox="0 0 14 13"
                            fill="none"
                          >
                            <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                          </svg>
                        ))}
                        <p className="text-xs !ml-2 font-semibold text-gray-800 dark:text-gray-100">
                          {new Date(rating?.ratingDate).toLocaleDateString('en-GB')}
                        </p>
                      </div>
                      {/* Hiển thị ảnh đánh giá người dùng */}
                      <div className="flex space-x-2 mt-4">
                        {rating?.pictures && rating?.pictures.length > 0 ? (
                          rating.pictures.map((pic, index) => (
                            <img
                              key={index}
                              src={`https://firebasestorage.googleapis.com/v0/b/endlesstechstoreecommerce.appspot.com/o/${encodeURIComponent(pic?.picture)}?alt=media`}
                              alt={`Rating Image ${index + 1}`}
                              className="w-24 h-24 object-cover rounded"
                            />
                          ))
                        ) : (
                          <p className="text-sm text-gray-800 dark:text-gray-100">No images available</p>
                        )}
                      </div>
                      <p className="text-sm mt-4 text-gray-800 dark:text-gray-100">{rating?.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </TitleCard>
  );
}

export default ProductDetail;
