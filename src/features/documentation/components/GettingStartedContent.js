import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../common/headerSlice';

function DashboardContent() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Bảng Điều Khiển'));
    }, [dispatch]);

    return (
        <>
            <article className="prose">
                <h1>Bảng Điều Khiển</h1>

                {/* Hiển thị Logo với hiệu ứng mờ */}
                <div className="flex justify-center mb-6">
                    <img
                        src={'./logo192.png'}
                        alt="Logo Endless"
                        className="w-32 h-auto rounded-lg blur-sm" // Thêm lớp CSS để làm mờ logo
                    />
                </div>

                {/* Tổng quan hệ thống */}
                <h2>Tổng Quan Hệ Thống</h2>
                <p>Chào mừng bạn đến với bảng điều khiển quản trị của Endless. Tại đây, bạn có thể dễ dàng theo dõi và quản lý các hoạt động của hệ thống, bao gồm các sản phẩm, giao dịch, khuyến mãi và khách hàng.</p>

                {/* Thống kê nhanh */}
                <h3>Thống Kê Nhanh</h3>
                <ul>
                    <li><strong>Sản phẩm:</strong> 120 sản phẩm hiện có.</li>
                    <li><strong>Khách hàng:</strong> 3000 khách hàng đã đăng ký.</li>
                    <li><strong>Giao dịch:</strong> 1500 giao dịch trong tháng này.</li>
                </ul>

                {/* Các tính năng quản trị */}
                <h3>Các Tính Năng Quản Trị</h3>
                <ul>
                    <li><strong>Quản lý Sản phẩm:</strong> Thêm, sửa, xóa và quản lý các sản phẩm của bạn.</li>
                    <li><strong>Quản lý Khách hàng:</strong> Theo dõi và quản lý thông tin khách hàng, đơn hàng của họ.</li>
                    <li><strong>Khuyến mãi & Voucher:</strong> Tạo và quản lý chương trình khuyến mãi, mã giảm giá cho khách hàng.</li>
                    <li><strong>Giao dịch:</strong> Theo dõi và thống kê các giao dịch mua bán.</li>
                    <li><strong>Thống kê:</strong> Xem các báo cáo và thống kê hệ thống chi tiết.</li>
                </ul>

                {/* Liên kết đến các phần quản trị khác */}
                <h3>Điều Hướng Nhanh</h3>
                <ul>
                    <li><a href="/products" className="text-blue-500">Quản lý Sản phẩm</a></li>
                    <li><a href="/customers" className="text-blue-500">Quản lý Khách hàng</a></li>
                    <li><a href="/transactions" className="text-blue-500">Quản lý Giao dịch</a></li>
                    <li><a href="/promotions" className="text-blue-500">Khuyến mãi & Voucher</a></li>
                    <li><a href="/statistics" className="text-blue-500">Thống Kê</a></li>
                </ul>

                <div className='h-24'></div>
            </article>
        </>
    );
}

export default DashboardContent;
