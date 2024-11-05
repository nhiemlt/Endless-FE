import { useState, useRef } from "react";
import { Link } from "react-router-dom";

function AboutUs() {
  return (
    <div className="bg-base-200 min-h-screen">
      <div className="bg-white dark:bg-gray-800 rounded-lg min-h-screen">
        {" "}
        {/* Bo góc và đổi màu nền tối */}
        {/* Phần Giới thiệu */}
        <div className="bg-base-200 py-12 px-8">
          <h2 className="text-4xl font-bold text-blue-600 text-center mb-8">
            Về Chúng Tôi
          </h2>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <img
                src="path_to_your_image"
                alt="Hình ảnh minh họa"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="flex-1">
              <p className="text-lg text-gray-800 dark:text-gray-200">
                Chúng tôi là cửa hàng chuyên cung cấp các thiết bị điện tử hiện
                đại như điện thoại di động, máy tính, và các phụ kiện như tai
                nghe, chuột, và nhiều sản phẩm khác.
              </p>
              <ul className="mt-4 space-y-4">
                <li className="flex items-center">
                  <span className="text-blue-600 mr-2">✔️</span>
                  <span className="text-gray-600">Sản phẩm chất lượng cao</span>
                </li>
                <li className="flex items-center">
                  <span className="text-blue-600 mr-2">✔️</span>
                  <span className="text-gray-600">
                    Dịch vụ khách hàng tận tâm
                  </span>
                </li>
                <li className="flex items-center">
                  <span className="text-blue-600 mr-2">✔️</span>
                  <span className="text-gray-600">
                    Nỗ lực đáp ứng nhu cầu khách hàng
                  </span>
                </li>
              </ul>
              <button className="btn btn-primary bg-blue-600 text-white hover:bg-blue-700 mt-4">
                Khám Phá Ngay
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Phần Đội Ngũ */}
      <div className="bg-base-100 py-12 px-8">
        <h2 className="text-4xl font-bold text-center mb-8">
          Đội Ngũ Của Chúng Tôi
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              name: "Lý Tính Nhiệm",
              role: "Nhóm trưởng",
              image: "path_to_image_1",
              description:
                "Lý Tính Nhiệm là người đứng đầu đội ngũ, với 30 năm kinh nghiệm trong ngành.",
            },
            {
              name: "Nguyễn Minh Nhu",
              role: "Thành viên",
              image: "path_to_image_2",
              description:
                "Nguyễn Minh Nhu chuyên về phát triển sản phẩm và luôn tìm kiếm các giải pháp sáng tạo.",
            },
            {
              name: "Võ Thị Thảo Nguyên",
              role: "Thành viên",
              image: "path_to_image_3",
              description:
                "Võ Thị Thảo Nguyên phụ trách tấu hài và đưa ra các câu đố vớ vẫn.",
            },
            {
              name: "Nguyễn Hoàng Phúc",
              role: "Thành viên",
              image: "path_to_image_4",
              description:
                "Nguyễn Hoàng Phúc... thằng này làm biếng quá nên không ghi.",
            },
          ].map((member, index) => (
            <div
              key={index}
              className="card bg-gray-100 shadow-xl p-4 rounded-lg transform transition-transform duration-300 hover:scale-105"
            >
              <img
                src={member.image}
                alt={member.name}
                className="rounded-full w-32 h-32 mx-auto mb-4"
              />
              <div className="text-center mt-4">
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
                <p className="text-gray-500">{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Phần Lịch Sử */}
      <div className="bg-base-100 py-12 px-8">
        <h2 className="text-3xl font-bold text-center mb-8">
          Hành Trình Của Chúng Tôi
        </h2>
        <div className="px-6 md:px-12">
          <div className="border-l-2 border-blue-600 dark:border-blue-400 space-y-8">
            <div className="ml-4">
              <div className="flex items-center mb-2">
                <div className="bg-blue-600 w-3 h-3 rounded-full"></div>
                <h3 className="text-xl font-semibold ml-4 text-gray-800 dark:text-gray-200">
                  Sinh ra năm 2004
                </h3>
              </div>
              <p className="text-gray-600 ml-8 dark:text-gray-300">
                Chúng tôi bắt đầu hành trình với sứ mệnh đổi mới và nâng cao
                chất lượng cuộc sống của khách hàng.
              </p>
            </div>
            <div className="ml-4">
              <div className="flex items-center mb-2">
                <div className="bg-blue-600 w-3 h-3 rounded-full"></div>
                <h3 className="text-xl font-semibold ml-4 text-gray-800 dark:text-gray-200">
                  Đạt được cột mốc đầu tiên 
                </h3>
              </div>
              <p className="text-gray-600 ml-8 dark:text-gray-300">
                Năm 2021 sau khi tốt nghiệp phổ thông, đánh dấu cột mốc quan
                trọng đầu tiên.
              </p>
            </div>
            <div className="ml-4">
              <div className="flex items-center mb-2">
                <div className="bg-blue-600 w-3 h-3 rounded-full"></div>
                <h3 className="text-xl font-semibold ml-4 text-gray-800 dark:text-gray-200">
                  Mở rộng toàn cầu
                </h3>
              </div>
              <p className="text-gray-600 ml-8 dark:text-gray-300">
                Đến năm 2024, chúng tôi đã có mặt trên toàn cầu, mang giải pháp
                đến với khách hàng trên khắp thế giới và đã bán được một tỷ gói
                mè.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
