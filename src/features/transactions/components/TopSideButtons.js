import React, { useEffect, useState } from "react";
import FunnelIcon from '@heroicons/react/24/outline/FunnelIcon';
import SearchBar from "../../../components/Input/SearchBar";
import Datepicker from "react-tailwindcss-datepicker";

// Cập nhật thêm prop cho việc chọn trạng thái đơn hàng
const TopSideButtons = ({ applySearch, updateDateRange, sortTransactions, onStatusChange, activeStatus }) => {
    const [searchText, setSearchText] = useState("");
    const [dateValue, setDateValue] = useState({ startDate: null, endDate: null });
    const [dropdownStatus, setDropdownStatus] = useState(activeStatus || 'Tất cả'); // Giá trị mặc định là 'Tất cả'

    const handleDatePickerValueChange = (newValue) => {
        setDateValue(newValue);
        updateDateRange(newValue);
    };

    useEffect(() => {
        applySearch(searchText);
    }, [searchText]);

    const handleStatusChange = (status) => {
        setDropdownStatus(status);
        onStatusChange(status); // Gọi hàm thay đổi trạng thái từ props
    };

    return (
        <div className="flex justify-start items-center space-x-4">
            {/* Thanh tìm kiếm */}
            <SearchBar searchText={searchText} styleClass="w-60" setSearchText={setSearchText} />
            
            {/* Bộ lọc theo ngày */}
            <div className="flex items-center space-x-4">
                <Datepicker
                    containerClassName="w-62 inline-block"
                    value={dateValue}
                    inputClassName="input input-bordered w-55 h-9"
                    displayFormat={"DD-MM-YYYY"}
                    onChange={handleDatePickerValueChange}
                />

                {/* Dropdown chọn trạng thái đơn hàng */}
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-sm btn-outline m-1 w-100">
                        Trạng thái
                    </label>
                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li><a onClick={() => handleStatusChange('Tất cả')}>Tất cả</a></li>
                        <li><a onClick={() => handleStatusChange('Đang chờ')}>Đang chờ</a></li>
                        <li><a onClick={() => handleStatusChange('Đã thanh toán')}>Đã thanh toán</a></li>
                        <li><a onClick={() => handleStatusChange('Đang giao hàng')}>Đang giao</a></li>
                        <li><a onClick={() => handleStatusChange('Đã giao hàng')}>Đã giao</a></li>
                    </ul>
                </div>

                {/* Dropdown sắp xếp */}
                <div className="dropdown dropdown-bottom dropdown-end">
                    <label tabIndex={0} className="btn btn-sm btn-outline">
                        <FunnelIcon className="w-5 mr-2" />Sắp xếp
                    </label>
                    <ul tabIndex={0} className="dropdown-content menu p-2 text-sm z-[1] shadow bg-base-100 rounded-box w-52">
                        <li><a onClick={() => sortTransactions('amountAsc')}>Số tiền - Tăng dần</a></li>
                        <li><a onClick={() => sortTransactions('amountDesc')}>Số tiền - Giảm dần</a></li>
                        <li><a onClick={() => sortTransactions('dateAsc')}>Ngày - Tăng dần</a></li>
                        <li><a onClick={() => sortTransactions('dateDesc')}>Ngày - Giảm dần</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TopSideButtons;
