import React, { useState } from "react";

function HelpCenter() {
  const [activeCategory, setActiveCategory] = useState("account");

  const questions = {
    account: [
      {
        question: "1. Làm sao để tạo tài khoản?",
        answer: "Để tạo tài khoản, bạn cần nhấn vào nút 'Đăng ký' trên trang chủ và điền đầy đủ thông tin cần thiết.",
      },
      {
        question: "2. Tôi quên mật khẩu, làm sao để khôi phục?",
        answer: "Bạn có thể nhấn vào 'Quên mật khẩu' trên trang đăng nhập và làm theo hướng dẫn để lấy lại mật khẩu.",
      },
      {
        question: "3. Làm sao để thay đổi thông tin tài khoản?",
        answer: "Bạn có thể thay đổi thông tin tài khoản bằng cách vào phần 'Cài đặt' trong trang tài khoản cá nhân.",
      },
    ],
    product: [
      {
        question: "1. Làm sao để đặt hàng?",
        answer: "Để đặt hàng, bạn chỉ cần chọn sản phẩm và nhấn vào nút 'Thêm vào giỏ hàng'. Sau đó làm theo các bước để hoàn tất đơn hàng.",
      },
      {
        question: "2. Tôi có thể thanh toán bằng phương thức nào?",
        answer: "Chúng tôi hỗ trợ nhiều phương thức thanh toán như thẻ tín dụng, chuyển khoản ngân hàng, và các ví điện tử phổ biến.",
      },
      {
        question: "3. Tôi có thể trả lại sản phẩm không?",
        answer: "Có, bạn có thể yêu cầu trả lại sản phẩm trong vòng 30 ngày nếu sản phẩm không bị hư hại và còn nguyên vẹn bao bì.",
      },
    ],
    shipping: [
      {
        question: "1. Thời gian giao hàng là bao lâu?",
        answer: "Thời gian giao hàng thường từ 3 đến 5 ngày làm việc tùy vào khu vực của bạn.",
      },
      {
        question: "2. Làm sao để theo dõi tình trạng đơn hàng?",
        answer: "Bạn có thể theo dõi tình trạng đơn hàng qua trang 'Lịch sử đơn hàng' trong tài khoản của mình.",
      },
      {
        question: "3. Giao hàng có thu phí không?",
        answer: "Phí giao hàng sẽ được tính dựa trên địa chỉ giao hàng và tổng giá trị đơn hàng. Phí sẽ được hiển thị khi bạn thanh toán.",
      },
    ],
  };

  return (
    <div className="bg-base-200 min-h-screen py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-4xl mx-auto p-8">
        {/* Phần Tiêu Đề */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">Trung Tâm Trợ Giúp</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">Chúng tôi luôn sẵn sàng giúp đỡ bạn với mọi vấn đề.</p>
        </div>

        {/* Phần Chọn Mục Câu Hỏi */}
        <div className="flex justify-center gap-6 mb-8">
          <button
            className={`text-xl ${activeCategory === "account" ? "text-blue-600 dark:text-blue-400 font-semibold" : "text-gray-600 dark:text-gray-300"}`}
            onClick={() => setActiveCategory("account")}
          >
            Về Tài Khoản
          </button>
          <button
            className={`text-xl ${activeCategory === "product" ? "text-blue-600 dark:text-blue-400 font-semibold" : "text-gray-600 dark:text-gray-300"}`}
            onClick={() => setActiveCategory("product")}
          >
            Về Sản Phẩm
          </button>
          <button
            className={`text-xl ${activeCategory === "shipping" ? "text-blue-600 dark:text-blue-400 font-semibold" : "text-gray-600 dark:text-gray-300"}`}
            onClick={() => setActiveCategory("shipping")}
          >
            Về Vận Chuyển
          </button>
        </div>

        {/* Phần Câu Hỏi Thường Gặp */}
        <div className="bg-base-100 py-8 px-6 rounded-lg shadow-md mb-12">
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Câu Hỏi Thường Gặp</h3>
          <div className="space-y-6">
            {questions[activeCategory].map((item, index) => (
              <div key={index} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                <p className="font-semibold text-gray-700 dark:text-gray-300">{item.question}</p>
                <p className="text-gray-600 dark:text-gray-400">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Phần Liên Hệ Hỗ Trợ */}
        <div className="bg-base-100 py-8 px-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Liên Hệ Hỗ Trợ</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Nếu bạn gặp bất kỳ vấn đề nào, vui lòng liên hệ với chúng tôi qua:
          </p>
          <div className="space-y-4">
            <p className="font-semibold text-gray-700 dark:text-gray-300">Email: <span className="text-blue-600 dark:text-blue-400">endlessshop.contact@gmail.com</span></p>
            <p className="font-semibold text-gray-700 dark:text-gray-300">Số điện thoại: <span className="text-blue-600 dark:text-blue-400">0787-833-283</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpCenter;
