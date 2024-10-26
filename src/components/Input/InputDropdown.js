import React, { useState } from 'react';

function InputDropdown({ options, onSelect, placeholder = "Search...", limit = 5 }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Lọc danh sách dựa trên từ khóa tìm kiếm
  const filteredOptions = options
    .filter(option =>
      option.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, limit);

  const handleSelect = (option) => {
    setSearchQuery(option.fullName);
    onSelect(option); // Gọi callback khi chọn
    setIsDropdownOpen(false); // Đóng dropdown
  };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <input
        type="text"
        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-lg w-full px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setIsDropdownOpen(true);
        }}
        placeholder={placeholder}
      />

      {isDropdownOpen && searchQuery && (
        <ul className="absolute w-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600 rounded-lg mt-1 max-h-60 overflow-y-auto z-10">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <li
                key={option.id}
                onClick={() => handleSelect(option)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors duration-200"
              >
                <img
                  src={option.avatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full mr-3 object-cover"
                />
                <span className="text-gray-900 dark:text-gray-200">{option.fullName}</span>
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-center text-gray-500 dark:text-gray-400">
              Không có kết quả
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

export default InputDropdown;
