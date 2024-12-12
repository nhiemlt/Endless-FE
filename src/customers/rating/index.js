import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RatingService from "../../services/ratingService";
import { PlusIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { showNotification } from "../../features/common/headerSlice";
import { useDispatch } from "react-redux";
import UploadFileService from "../../services/UploadFileService";

function Rating() {
  const location = useLocation();
  const { orderDetailID } = location.state || {};
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [feedback, setFeedback] = useState("");
  const [pictures, setPictures] = useState([]);
  const [rating, setRating] = useState(5);

  useEffect(() => {
    if (!orderDetailID) {
      dispatch(
        showNotification({
          message: "Không tìm thấy thông tin đơn hàng để đánh giá.",
          status: 0,
        })
      );
      navigate("/order");
    }
  }, [orderDetailID, dispatch, navigate]);

  const handleSubmitRating = async () => {
    if (rating === 0) {
      dispatch(
        showNotification({
          message: "Vui lòng chọn số sao để đánh giá.",
          status: 0,
        })
      );
      return;
    }

    try {
      // Mảng lưu trữ URL ảnh đã tải lên Firebase
      const uploadedPictures = [];

      // Tải ảnh lên Firebase
      for (let file of pictures) {
        try {
          // Tải ảnh lên Firebase và lấy URL của ảnh
          const uploadedImageUrl = await UploadFileService.uploadRating(file);
          uploadedPictures.push(uploadedImageUrl); // Lưu URL của ảnh đã tải lên Firebase
        } catch (error) {
          dispatch(
            showNotification({
              message: "Đã xảy ra lỗi khi tải ảnh lên.",
              status: 0,
            })
          );
          return;
        }
      }

      // Gửi đánh giá cùng với ảnh đã tải lên
      await RatingService.addRating(
        orderDetailID,
        rating,
        feedback,
        uploadedPictures
      );
      dispatch(
        showNotification({
          message: "Cảm ơn bạn đã đánh giá sản phẩm!",
          status: 1,
        })
      );
      navigate("/order");
    } catch (error) {
      dispatch(
        showNotification({
          message: "Đã xảy ra lỗi khi gửi đánh giá. Vui lòng thử lại sau.",
          status: 0,
        })
      );
    }
  };

  const handlePictureChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    // Kiểm tra và chỉ thêm ảnh hợp lệ vào danh sách ảnh xem trước
    const validPictures = selectedFiles.filter((file) =>
      file.type.startsWith("image/")
    );
    setPictures((prevPictures) => [...prevPictures, ...validPictures]);
  };

  const handleRemovePicture = (index) => {
    setPictures((prevPictures) => prevPictures.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        Đánh giá sản phẩm
      </h1>

      <div className="mb-4">
        <div className="flex justify-center mt-2">
          <div className="rating rating-lg">
            {[1, 2, 3, 4, 5].map((star) => (
              <input
                key={star}
                type="radio"
                name="rating"
                className={`mask mask-star-2 bg-orange-400 ${
                  star <= rating ? "checked" : ""
                }`}
                onChange={() => setRating(star)}
              />
            ))}
          </div>
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
          className="mt-2 w-full p-4 border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập đánh giá của bạn..."
        />
      </div>

      {/* Chọn ảnh */}
      <div className="mb-6">
        <label htmlFor="pictures" className="block text-gray-600 font-medium">
          Chọn ảnh (tùy chọn):
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            id="pictures"
            multiple
            onChange={handlePictureChange}
            className="hidden"
          />
          <button
            className="btn btn-square bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={() => document.getElementById("pictures").click()}
          >
            <PlusIcon className="w-6 h-6" />
          </button>
          <span className="text-sm text-gray-500">
            Chọn ảnh để tải lên (JPG, PNG, tối đa 5MB)
          </span>
        </div>
      </div>

      {/* Hiển thị ảnh đã chọn */}
      <div className="flex flex-wrap space-x-4 mt-4">
        {pictures.map((picture, index) => (
          <div key={index} className="relative mb-4">
            <img
              src={URL.createObjectURL(picture)}
              alt={`preview-${index}`}
              className="w-32 h-32 object-cover rounded-md border-2 border-gray-200"
            />
            <button
              onClick={() => handleRemovePicture(index)}
              className="absolute top-0 right-0 bg-white text-red-500 rounded-full p-1"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        ))}
      </div>

      {/* Gửi đánh giá */}
      <button
        onClick={handleSubmitRating}
        className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-6"
      >
        Gửi đánh giá
      </button>
    </div>
  );
}

export default Rating;
