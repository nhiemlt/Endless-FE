// hooks/usePageTitle.js

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const usePageTitle = () => {
  const location = useLocation();

  useEffect(() => {
    let title;

    // Xác định tiêu đề dựa trên đường dẫn hiện tại
    switch (location.pathname) {
      case '/dashboard':
        title = 'Bảng điều khiển';
        break;
      case '/welcome':
        title = 'Chào mừng';
        break;
      case '/leads':
        title = 'Khách hàng tiềm năng';
        break;
      case '/settings-team':
        title = 'Nhóm';
        break;
      case '/calendar':
        title = 'Lịch';
        break;
      case '/transactions':
        title = 'Giao dịch';
        break;
      case '/settings-profile':
        title = 'Thông tin cá nhân';
        break;
      case '/settings-billing':
        title = 'Hóa đơn';
        break;
      case '/getting-started':
        title = 'Bắt đầu';
        break;
      case '/features':
        title = 'Tính năng';
        break;
      case '/components':
        title = 'Thành phần';
        break;
      case '/integration':
        title = 'Tích hợp';
        break;
      case '/charts':
        title = 'Biểu đồ';
        break;
      case '/404':
        title = 'Trang không tồn tại';
        break;
      case '/blank':
        title = 'Trang trống';
        break;
      default:
        title = 'Không tìm thấy';
    }

    // Cập nhật tiêu đề trang
    document.title = title;
  }, [location]);
}

export default usePageTitle;
