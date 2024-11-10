import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from '../common/headerSlice';
import TitleCard from '../../components/Cards/TitleCard';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import attributeService from '../../services/attributeService';
import AddAttributeModal from './components/addAttributeModal'; // Nhập modal thêm thuộc tính
import UpdateAttributeModal from './components/updateAttributeModal'; // Nhập modal chỉnh sửa thuộc tính
import SearchBar from '../../components/Input/SearchBar';

function AttributePage() {
  const dispatch = useDispatch();

  const [attributesList, setAttributesList] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  const fetchAttributes = async () => {
    try {
      const response = await attributeService.getAttributes();
      console.log(response.data); // Kiểm tra cấu trúc dữ liệu
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

  const handleDeleteAttribute = async (attributeID) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa thuộc tính này?");
    if (confirmDelete) {
      try {
        await attributeService.deleteAttribute(attributeID);
        setAttributesList((prev) => prev.filter(attr => attr.attributeID !== attributeID));
        dispatch(showNotification({ message: 'Xóa thuộc tính thành công!', status: 1 }));
      } catch (error) {
        dispatch(showNotification({ message: 'Xóa thuộc tính không thành công!', status: 0 }));
      }
    }
  };

  // Hàm tìm kiếm thuộc tính
  const applySearch = (keyword) => {
    setSearchKeyword(keyword);
  };

  const filteredAttributesList = attributesList.filter(attribute =>
    attribute.attributeName.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div className="p-4">
      <TitleCard title="Quản Lý Thuộc Tính">
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
                <th>Tên thuộc tính</th>
                <th>Giá trị</th>
                <th colSpan={2} className="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttributesList.length > 0 ? (
                filteredAttributesList.map((attribute) => (
                  <tr key={attribute.attributeID}>
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
                        <PencilIcon
                          className="w-5 h-5 cursor-pointer text-info"
                          onClick={() => {
                            setSelectedAttribute(attribute);
                            setShowEditModal(true);
                          }}
                        />
                        <TrashIcon
                          className="w-5 h-5 cursor-pointer text-error"
                          onClick={() => handleDeleteAttribute(attribute.attributeID)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">Không có thuộc tính nào!</td>
                </tr>
              )}
            </tbody>


          </table>
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
    </div>
  );
}

export default AttributePage;
