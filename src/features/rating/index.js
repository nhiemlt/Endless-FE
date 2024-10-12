import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import TitleCard from "../../components/Cards/TitleCard"

function Rating() {
  const handleFilter = () => {
    // Logic xử lý khi bấm nút Filter
    console.log('Filter button clicked');
  };

  const handleSearch = () => {
    // Logic xử lý khi bấm nút Search
    console.log('Search button clicked');
  };

  return (
    <div className="overflow-x-auto">
      {/* Sử dụng TitleCard để bao bảng */}
      <TitleCard
        title="Ratings Table"
        TopSideButtons={
          <>
            {/* Nút Search */}
            <button
              className="btn btn-sm btn-primary mx-1"
              onClick={handleSearch}
            >
              Search
            </button>

            {/* Nút Filter */}
            <button
              className="btn btn-sm btn-secondary mx-1"
              onClick={handleFilter}
            >
              Filter
            </button>
          </>
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
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td>Littel, Schaden and Vandervort</td>
              <td>Canada</td>
              <td>
                <div className="rating rating-xs">
                  <input type="radio" name="rating-5" className="mask mask-star-2 bg-orange-400" />
                  <input
                    type="radio"
                    name="rating-5"
                    className="mask mask-star-2 bg-orange-400"
                    defaultChecked />
                  <input type="radio" name="rating-5" className="mask mask-star-2 bg-orange-400" />
                  <input type="radio" name="rating-5" className="mask mask-star-2 bg-orange-400" />
                  <input type="radio" name="rating-5" className="mask mask-star-2 bg-orange-400" />
                </div>
              </td>
              <td>12/16/2020</td>
              <td>Blue</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <div className="join">
                <button className="join-item btn">1</button>
                <button className="join-item btn">2</button>
                <button className="join-item btn btn-disabled">...</button>
                <button className="join-item btn">99</button>
                <button className="join-item btn">100</button>
              </div>
            </tr>
          </tfoot>
        </table>
      </TitleCard>
    </div>
  );
}

export default Rating;

