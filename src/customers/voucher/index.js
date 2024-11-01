import { useState, useEffect } from 'react';
import UserVoucherService from '../../services/userVoucherService';
import TitleCard from '../../components/Cards/TitleCard';
import ShoppingBagIcon from '@heroicons/react/24/outline/ShoppingBagIcon';

function Voucher() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm lấy danh sách voucher từ UserVoucherService
  useEffect(() => {
    const fetchVouchers = async () => {
      setLoading(true);
      const response = await UserVoucherService.getUserVouchers();
      setVouchers(response?.length ? response : []);
      setLoading(false);
    };
    fetchVouchers();
  }, []);

  // Hàm định dạng thời gian đếm ngược cho đến khi hết hạn
  const formatCountdown = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;

    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds };
  };

  // Cập nhật countdown mỗi giây
  useEffect(() => {
    const intervalId = setInterval(() => {
      setVouchers((prevVouchers) =>
        prevVouchers.map((voucher) => ({
          ...voucher,
          countdown: formatCountdown(voucher.endDate),
        }))
      );
    }, 1000);

    return () => clearInterval(intervalId);
  }, [vouchers]);

  return (
    <TitleCard title={"Danh sách voucher"}>
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {vouchers.map((voucher, index) => (
            <div
              key={index}
              className="relative bg-gradient-to-r from-blue-500 to-blue-700 text-white p-3 rounded-lg shadow-md text-sm"
            >
              {/* Các div tròn bên trái và bên phải */}
              <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full absolute top-1/2 transform -translate-y-1/2 left-0 -ml-6"></div>
              <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full absolute top-1/2 transform -translate-y-1/2 right-0 -mr-6"></div>

              <div className="flex items-center">
                <div className="text-xl font-bold me-1">VOUCHER </div>
                <ShoppingBagIcon className="me-1 h-6 w-6" />
              </div>
              <div className="text-sm mb-1 mt-1 p-1">
                Giảm đến <span className="text-yellow-400 font-bold">{voucher.discountLevel}%</span> cho lần mua tiếp theo với tổng hóa đơn là
                <span className="text-yellow-400 font-bold">
                  {" "}{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(voucher.leastBill)}{" "}
                </span>!
              </div>
              <div className="text-xs mb-1 mt-1 p-1">Giá giảm tối đa:
                <span> {" "}{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(voucher.biggestDiscount)}{" "}</span>
              </div>
              <div className="bg-white text-gray-800 rounded-lg px-1 py-1 flex items-center justify-between">
                <span className="text-xs font-semibold">{voucher.voucherCode}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(voucher.voucherCode)}
                  className="bg-blue-800 text-white mt-1 p-1 px-1 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                >
                  Copy
                </button>
              </div>
              <div className="text-xs mt-2 p-1">
                <div className="flex gap-1 mt-1">
                  <div>
                    <span className="countdown font-mono text-lg">{voucher.countdown?.days}</span> ngày
                  </div>
                  <div>
                    <span className="countdown font-mono text-lg">{voucher.countdown?.hours}</span> giờ
                  </div>
                  <div>
                    <span className="countdown font-mono text-lg">{voucher.countdown?.minutes}</span> phút
                  </div>
                  <div>
                    <span className="countdown font-mono text-lg">{voucher.countdown?.seconds}</span> giây
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}


    </TitleCard>

  );
}

export default Voucher;
