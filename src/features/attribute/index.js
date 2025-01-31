import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from '../common/headerSlice';
import TitleCard from '../../components/Cards/TitleCard';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import attributeService from '../../services/attributeService';
import AddAttributeModal from './components/addAttributeModal';
import UpdateAttributeModal from './components/updateAttributeModal';
import SearchBar from '../../components/Input/SearchBar';
import ConfirmDialog from './components/ConfirmDialog'; // Import ConfirmDialog

function AttributePage() {
  const dispatch = useDispatch();

  const [attributesList, setAttributesList] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false); // Hiển thị ConfirmDialog
  const [attributeToDelete, setAttributeToDelete] = useState(null); // Lưu thuộc tính cần xóa
  const [currentPage, setCurrentPage] = useState(0);
  const [size, setSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);



  const fetchAttributes = async () => {
    try {
      const response = await attributeService.getAttributes();
      if (response.data && Array.isArray(response.data)) {
        setAttributesList(response.data);
      } else {
        throw new Error("Data is undefined or not an array");
      }
    } catch (error) {
      console.error("Error fetching attributes:", error);
      dispatch(showNotification({ message: 'Lỗi khi tải danh sách thuộc tính', status: 0 }));
    }
  };

  useEffect(() => {
    fetchAttributes();
  }, []);

  const handleAttributeAdded = (newAttribute) => {
    setAttributesList((prev) => [...prev, newAttribute]);
  };

  const handleAttributeUpdated = (updatedAttribute) => {
    setAttributesList((prev) =>
      prev.map(attr =>
        attr.attributeID === updatedAttribute.attributeID ? updatedAttribute : attr
      )
    );
  };

  const handleDeleteAttribute = async () => {
    try {
      await attributeService.deleteAttribute(attributeToDelete.attributeID);
      setAttributesList((prev) => prev.filter(attr => attr.attributeID !== attributeToDelete.attributeID));
      dispatch(showNotification({ message: 'Xóa thuộc tính thành công!', status: 1 }));
      setConfirmDialogVisible(false);
      setAttributeToDelete(null);
    } catch (error) {
      dispatch(showNotification({ message: 'Xóa thuộc tính không thành công!', status: 0 }));
    }
  };

  // Xác nhận xóa thuộc tính
  const showConfirmDelete = (attribute) => {
    setAttributeToDelete(attribute);
    setConfirmDialogVisible(true);
  };

  // Hàm tìm kiếm thuộc tính
  const applySearch = (keyword) => {
    setSearchKeyword(keyword);
  };

  const filteredAttributesList = attributesList.filter(attribute =>
    attribute.attributeName.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="">
      <TitleCard >
        <div className="flex flex-col md:flex-row justify-between items-center w-full mb-4">
          <div className="flex justify-start items-center space-x-2 mb-2 mr-2 md:mb-0">
            <SearchBar searchText={searchKeyword} setSearchText={applySearch} styleClass="mb-4" />
          </div>
          <button className="btn btn-outline btn-sm btn-primary" onClick={() => setShowAddModal(true)}>Thêm thuộc tính</button>
        </div>

        <div className="overflow-x-auto">
          <table className="table table-xs w-full">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên thuộc tính</th>
                <th>Giá trị</th>
                <th colSpan={2} className="text-center"></th>
              </tr>
            </thead>
            <tbody>
              {filteredAttributesList.length > 0 ? (
                filteredAttributesList.map((attribute, index) => (
                  <tr key={attribute.attributeID}>
                    <td>{currentPage * size + index + 1}</td> {/* Hiển thị STT tính theo trang */}
                    <td>{attribute.attributeName}</td>
                    <td>
                      {Array.isArray(attribute.attributeValues) && attribute.attributeValues.length > 0
                        ? attribute.attributeValues.map((value, index) => (
                          <span key={value.attributeValueID}>
                            {value.attributeValue}{index < attribute.attributeValues.length - 1 ? ', ' : ''}
                          </span>
                        ))
                        : 'Không có giá trị'}
                    </td>
                    <td>
                      <div className="flex justify-center space-x-2">
                        {/* Nút Chỉnh sửa thuộc tính */}
                        <button
                          className="btn btn-sm btn-outline btn-primary border-0 group relative"
                          onClick={() => {
                            setSelectedAttribute(attribute);
                            setShowEditModal(true);
                          }}
                        >
                          <PencilIcon className="w-5 h-5" />
                          <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-700 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                            Chỉnh sửa thuộc tính
                          </span>
                        </button>

                        {/* Nút Xóa thuộc tính */}
                        <button
                          className="btn btn-sm btn-outline btn-error border-0 group relative"
                          onClick={() => showConfirmDelete(attribute)} // Hiển thị ConfirmDialog khi nhấn xóa
                        >
                          <TrashIcon className="w-5 h-5 cursor-pointer text-error" />
                          <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-700 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                            Xóa thuộc tính
                          </span>
                        </button>
                      </div>

                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">Không có thuộc tính nào!</td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
        <div className="join mt-4 flex justify-center w-full">
          <button
            onClick={handlePrevPage}
            className="join-item btn"
            disabled={currentPage === 0}
          >
            Trước
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)} // Chuyển trang khi nhấn
              className={`join-item btn ${currentPage === index ? 'btn-primary' : ''}`} // Thêm 'btn-primary' cho trang hiện tại
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={handleNextPage}
            className="join-item btn"
            disabled={currentPage === totalPages - 1}
          >
            Tiếp
          </button>
        </div>
      </TitleCard>

      {showAddModal && (
        <AddAttributeModal
          onClose={() => setShowAddModal(false)}
          onAttributeAdded={handleAttributeAdded}
        />
      )}

      {showEditModal && selectedAttribute && (
        <UpdateAttributeModal
          onClose={() => setShowEditModal(false)}
          attribute={selectedAttribute}
          onAttributeUpdated={handleAttributeUpdated}
        />
      )}

      {/* ConfirmDialog hiển thị khi confirmDialogVisible là true */}
      {confirmDialogVisible && (
        <ConfirmDialog
          message="Bạn có chắc chắn muốn xóa thuộc tính này?"
          onConfirm={handleDeleteAttribute} // Thực hiện xóa khi nhấn Confirm
          onCancel={() => setConfirmDialogVisible(false)} // Đóng dialog khi nhấn Cancel
        />
      )}
    </div>
  );
}

export default AttributePage;