import React, { useState } from "react";

function HelpCenter() {
  return (
    <div className="bg-base-200 min-h-screen py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-4xl mx-auto p-8">
        {/* Phần Tiêu Đề */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-600 mb-4">Trung Tâm Trợ Giúp</h2>
          <p className="text-xl text-gray-600">Chúng tôi luôn sẵn sàng giúp đỡ bạn với mọi vấn đề.</p>
        </div>

        {/* Phần Câu Hỏi Thường Gặp */}
        <div className="bg-base-100 py-8 px-6 rounded-lg shadow-md mb-12">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Câu Hỏi Thường Gặp</h3>
          <div className="space-y-6">
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="font-semibold text-gray-700">1. Làm sao để đặt hàng?</p>
              <p className="text-gray-600">
                Để đặt hàng, bạn chỉ cần chọn sản phẩm và nhấn vào nút "Thêm vào giỏ hàng". Sau đó làm theo các bước để hoàn tất đơn hàng.
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="font-semibold text-gray-700">2. Tôi có thể thanh toán bằng phương thức nào?</p>
              <p className="text-gray-600">
                Chúng tôi hỗ trợ nhiều phương thức thanh toán như thẻ tín dụng, chuyển khoản ngân hàng, và các ví điện tử phổ biến.
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="font-semibold text-gray-700">3. Tôi có thể trả lại sản phẩm không?</p>
              <p className="text-gray-600">
                Có, bạn có thể yêu cầu trả lại sản phẩm trong vòng 30 ngày nếu sản phẩm không bị hư hại và còn nguyên vẹn bao bì.
              </p>
            </div>
            {/* Thêm câu hỏi khác nếu cần */}
          </div>
        </div>

        {/* Phần Liên Hệ Hỗ Trợ */}
        <div className="bg-base-100 py-8 px-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Liên Hệ Hỗ Trợ</h3>
          <p className="text-gray-600 mb-4">
            Nếu bạn gặp bất kỳ vấn đề nào, vui lòng liên hệ với chúng tôi qua:
          </p>
          <div className="space-y-4">
            <p className="font-semibold text-gray-700">Email: <span className="text-blue-600">support@example.com</span></p>
            <p className="font-semibold text-gray-700">Số điện thoại: <span className="text-blue-600">123-456-789</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpCenter;
