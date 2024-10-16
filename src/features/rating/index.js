import { useState } from 'react';
import { Link } from 'react-router-dom';
import TitleCard from "../../components/Cards/TitleCard";
import EyeIcon from '@heroicons/react/24/outline/EyeIcon';
import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon';
import FunnelIcon from '@heroicons/react/24/outline/FunnelIcon';

function Rating() {
  const handleFilter = () => {
    console.log('Filter button clicked');
  };

  const handleSearch = () => {
    console.log('Search button clicked');
  };

  const ratingDetails = {

    customerProvidedImages: [ // Mảng chứa các hình ảnh mà khách hàng cung cấp
      'https://cdn.tmobile.com/content/dam/t-mobile/en-p/cell-phones/apple/Apple-iPhone-16-Pro/Desert-Titanium/Apple-iPhone-16-Pro-Desert-Titanium-thumbnail.png',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdE29Ddw7Rc9SIv4MffPMknnYwCDIEKXRruQ&s',
      'https://www.att.com/scmsassets/global/devices/phones/apple/apple-iphone-15-pro-max/gallery/natural-titanium-1.jpg'// Thay bằng link hình ảnh thực tế
      // Có thể thêm nhiều hình ảnh nữa ở đây
    ],
    rating: 5,
  };

  return (
    <TitleCard title="Danh sách đánh giá"
      TopSideButtons={
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="input input-bordered me-2 p-2 h-8 w-30"
          />
          <button className="btn btn-sm btn-outline btn-primary mx-1"
            onClick={handleSearch}
          >
            <MagnifyingGlassIcon className="w-4 h-4" />
          </button>
          <button className="btn btn-sm btn-outline btn-secondary mx-1"
            onClick={handleFilter}
          >
            <FunnelIcon className="w-4 h-4" />
          </button>
        </div>
      }
    >
      <table className="table table-xs">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên khách hàng</th>
            <th>Sản phẩm</th>
            <th>Hình ảnh</th>
            <th>Ngày</th>
            <th>Đánh giá</th>
            <th>Nội dung</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>aaaa</td>
            <td>Quality Control Specialist</td>
            <td>Littel, Schaden and Vandervort</td>
            <td>12/10/2024</td>
            <td>
              <div className="rating rating-xs mb-4">
                {[...Array(5)].map((_, index) => (
                  <input
                    key={index}
                    type="radio"
                    name="rating-1"
                    className="mask mask-star-2 bg-orange-400"
                    defaultChecked={index < ratingDetails.rating} // Chỉ đánh dấu sao cho đến số đánh giá
                    disabled // Khóa không cho phép click
                  />
                ))}
              </div>
            </td>
            <td></td>
            <td>
              <a href="#my_modal_8" className="btn btn-sm btn-outline btn-success mx-1 border-0"
                onClick={handleSearch}
              >
                <EyeIcon className="w-4 h-4 ml-1 mr-1" />
              </a>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="8">
              <div className="flex justify-center mt-4">
                {[1, 2, '...', 3, 4].map((option, index) => (
                  <input
                    key={index}
                    className="join-item btn btn-xs btn-outline btn-circle me-1 checked:bg-accent"
                    type="radio"
                    name="options"
                    aria-label={option}
                    defaultChecked={option === 1}
                  />
                ))}
              </div>
            </td>
          </tr>
        </tfoot>
      </table>

      {/* Modal */}
      <div className="modal" role="dialog" id="my_modal_8">
        <div className="modal-box flex flex-col items-center">
          <h3 className="text-lg font-bold mb-4">Chi tiết đánh giá</h3>
          {/* Hiển thị ảnh khách hàng và thông tin */}
          <div className="flex items-center mb-4">
            <div className="avatar">
              <div className="ring-primary ring-offset-base-100 w-16 h-16 rounded-full mr-4 ring ring-offset-2">
                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
              </div>
            </div>
            <div className="text-center">
              <p className="font-bold">Mery</p>
              <p className="text-sm">12/10/2024</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-start">
            {ratingDetails.customerProvidedImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Hình ảnh khách hàng cung cấp ${index + 1}`}
                className="w-20 h-20 object-cover mb-4 mr-4"
              />
            ))}
          </div>
          {/* Hiển thị đánh giá */}
          <div className="rating rating-sm mb-4">
            {[...Array(5)].map((_, index) => (
              <input
                key={index}
                type="radio"
                className="mask mask-star-2 bg-orange-400"
                defaultChecked={index < ratingDetails.rating} // Chỉ đánh dấu sao cho đến số đánh giá
                disabled // Khóa không cho phép click
              />
            ))}
          </div>
          {/* Hiển thị nội dung đánh giá */}
          <p className="py-4 text-center">Good</p>

          {/* Nút đóng modal */}
          <div className="modal-action flex justify-end w-full">
            <a href="#" className="btn">Đóng</a>
          </div>
        </div>
      </div>
    </TitleCard >
  );
}

export default Rating;
