import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from '../common/headerSlice';
import TitleCard from '../../components/Cards/TitleCard';
import InputText from '../../components/Input/InputText';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import attributeService from '../../services/attributeService';

function AttributePage() {
  const dispatch = useDispatch();

  const [attribute, setAttribute] = useState({
    attributeName: '',
    enAttributeName: '',
    values: [],
  });

  const [attributesList, setAttributesList] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // Thêm trạng thái isEditing
  const [attributeId, setAttributeId] = useState(null); // Khai báo biến attributeId


  // Cập nhật giá trị của Attribute hoặc Value
  const updateFormValue = (key, value) => {
    setAttribute((prev) => ({ ...prev, [key]: value }));
  };

  const updateValue = (index, newValue) => {
    const updatedValues = [...attribute.values];
    updatedValues[index] = newValue;
    setAttribute((prev) => ({ ...prev, values: updatedValues }));
  };

  const addValueField = () => {
    setAttribute((prev) => ({
      ...prev,
      values: [...prev.values, ''],
    }));
  };

  const removeValueField = (index) => {
    const updatedValues = attribute.values.filter((_, i) => i !== index);
    setAttribute((prev) => ({ ...prev, values: updatedValues }));
  };

  // Sửa Attribute
  const handleEditAttribute = (attr) => {
    setAttribute({
      attributeName: attr.attributeName,
      enAttributeName: attr.enAttributeName,
      values: attr.values || [],
    });
    setAttributeId(attr.attributeID); // Lưu trữ attributeId
    setIsEditing(true);
  };


  // Lưu Attribute và các Value
  const saveAttribute = async () => {
    try {
      if (isEditing) {
        // Nếu đang chỉnh sửa, cập nhật thuộc tính
        await attributeService.updateAttribute(attributeId, attribute); // Thêm attributeId
      } else {
        // Nếu không, tạo thuộc tính mới
        await attributeService.saveAttribute(attribute);
      }
      dispatch(
        showNotification({
          message: isEditing
            ? 'Attribute updated successfully!'
            : 'Attribute saved successfully!',
          status: 1,
        })
      );
      fetchAttributes(); // Cập nhật danh sách attributes
      resetForm(); // Reset form sau khi lưu
      setIsEditing(false); // Đặt lại trạng thái chỉnh sửa
    } catch (error) {
      dispatch(
        showNotification({
          message: 'Failed to save attribute: ' + error.message,
          status: 0,
        })
      );
    }
  };

  // Lấy danh sách attributes
  const fetchAttributes = async () => {
    try {
      const data = await attributeService.getAttributes();
      setAttributesList(data);
    } catch (error) {
      dispatch(
        showNotification({
          message: 'Failed to fetch attributes: ' + error.message,
          status: 0,
        })
      );
    }
  };

  // Xóa Attribute
  const handleDeleteAttribute = async (attributeId) => {
    try {
      await attributeService.deleteAttribute(attributeId);
      dispatch(
        showNotification({
          message: 'Attribute deleted successfully!',
          status: 1,
        })
      );
      fetchAttributes(); // Cập nhật lại danh sách sau khi xóa
    } catch (error) {
      dispatch(
        showNotification({
          message: 'Failed to delete attribute: ' + error.message,
          status: 0,
        })
      );
    }
  };

  // Reset form
  const resetForm = () => {
    setAttribute({ attributeName: '', enAttributeName: '', values: [] });
  };

  useEffect(() => {
    fetchAttributes(); // Lấy danh sách attributes khi component mount
  }, []);

  return (
    <TitleCard title="Manage Attributes and Values" topMargin="mt-6">
      <div className="relative">
        <input
          type="text"
          value={attribute.attributeName}
          onChange={(e) => updateFormValue('attributeName', e.target.value)} // Sửa lại ở đây
          id="name"
          placeholder=" "
          name="name"
          className="w-full peer bg-transparent h-10 rounded-lg text-black placeholder-transparent ring-2 px-2 ring-gray-200 focus:ring-sky-600 focus:outline-none"
        />
        <label
          htmlFor="name"
          className="absolute left-0 -top-3 text-sm text-gray-500 bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-3 peer-focus:text-sky-600"
        >
          Attribute Name
        </label>
      </div>

      <div className="mt-6">
        {attribute.values.map((value, index) => (
          <div key={index} className="flex items-center gap-4 mb-2">
            <InputText
              labelTitle={`Value ${index + 1}`}
              value={value}
              updateFormValue={(e) => updateValue(index, e.target.value)}
            />
            <button
              className="btn btn-error mt-8"
              onClick={() => removeValueField(index)}
            >
              Remove
            </button>
          </div>
        ))}

        <button className="btn btn-secondary mt-2" onClick={addValueField}>
          + Add Value
        </button>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="btn btn-primary" onClick={saveAttribute}>
          {isEditing ? 'Update Attribute' : 'Save Attribute'} {/* Thay đổi văn bản nút */}
        </button>
      </div>

      <div className="flex justify-center">
        <div className="overflow-x-auto w-full max-w-6xl">
          <table className="table w-full">
            <thead>
              <tr>
                <th>No.</th>
                <th>Attribute Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {attributesList.map((attr, index) => (
                <tr key={attr.attributeID}>
                  <td>{index + 1}</td>
                  <td>{attr.attributeName}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline btn-info"
                      onClick={() => handleEditAttribute(attr)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      className="btn btn-sm btn-outline btn-error"
                      onClick={() => handleDeleteAttribute(attr.attributeID)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="join">
        <button className="join-item btn">«</button>
        <button className="join-item btn">Page 1</button>
        <button className="join-item btn">»</button>
      </div>
    </TitleCard>
  );
}

export default AttributePage;
