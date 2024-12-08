import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import RatingService from "../../services/ratingService";
import { StarIcon, PhotoIcon } from "@heroicons/react/24/solid";

function Rating() {
  const [rating, setRating] = useState(0);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderID = queryParams.get("orderID");
  const [feedback, setFeedback] = useState("");
  const [product, setProduct] = useState(null);
  const [pictures, setPictures] = useState([]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await RatingService.getRatingById(orderID);
        setProduct(response.product);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin sản phẩm:", error);
      }
    };

    fetchProductData();
  }, [orderID]);

  const handleSubmitRating = async () => {
    try {
      const response = await RatingService.addRating(
        orderID,
        rating,
        feedback,
        pictures
      );
      alert("Đánh giá thành công!");
    } catch (error) {
      console.error("Có lỗi khi gửi đánh giá:", error);
      alert("Có lỗi xảy ra khi gửi đánh giá");
    }
  };

  const handlePictureChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setPictures((prevPictures) => [...prevPictures, ...selectedFiles]);
  };

  const handleRemovePicture = (index) => {
    setPictures((prevPictures) => prevPictures.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        Đánh giá sản phẩm
      </h1>

      {product && (
        <div className="text-center mb-8">
          <img
            src={product.imageURL}
            alt={product.name}
            className="w-48 h-48 object-cover rounded-lg mx-auto mb-4"
          />
          <h3 className="text-xl font-medium text-gray-700">{product.name}</h3>
        </div>
      )}

      <div className="mb-4">
        <div className="flex justify-center mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              className={`w-8 h-8 cursor-pointer mx-2 ${
                star <= rating ? "text-yellow-500" : "text-gray-400"
              }`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="feedback" className="block text-gray-600 font-medium">
          Mô tả thêm (tùy chọn):
        </label>
        <textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows="4"
          className="mt-2 w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập đánh giá của bạn..."
        />
      </div>

      <div className="mb-6 items-center">
        <label
          htmlFor="pictures"
          className="block text-gray-600 font-medium mr-4"
        >
          Chọn ảnh (tùy chọn):
        </label>
        <div className="flex items-center">
          <input
            type="file"
            id="pictures"
            multiple
            onChange={handlePictureChange}
            className="hidden"
          />
          <button
            onClick={() => document.getElementById("pictures").click()}
            className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            <PhotoIcon className="w-5 h-5 mr-2" />
            Chọn ảnh
          </button>
        </div>
      </div>
      
      <div className="flex flex-wrap space-x-4 mt-4">
        {Array.from(pictures).map((picture, index) => (
          <div key={index} className="relative">
            <img
              src={URL.createObjectURL(picture)}
              alt={`preview-${index}`}
              className="w-32 h-32 object-cover rounded-md"
            />
            <button
              onClick={() => handleRemovePicture(index)}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
            >
              X
            </button>
          </div>
        ))}
      </div>

      {pictures.length > 0 && (
        <div className="mb-6">
          <div className="flex space-x-4 mt-4">
            {Array.from(pictures).map((picture, index) => (
              <img
                key={index}
                src={URL.createObjectURL(picture)}
                alt={`preview-${index}`}
                className="w-32 h-32 object-cover rounded-md"
              />
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleSubmitRating}
        className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Gửi đánh giá
      </button>
    </div>
  );
}

export default Rating;
