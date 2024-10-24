import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from '../common/headerSlice';
import TitleCard from '../../components/Cards/TitleCard';
import InputText from '../../components/Input/InputText';

function AttributePage() {
  const dispatch = useDispatch();

  const [attribute, setAttribute] = useState({
    attributeName: '',
    enAttributeName: '',
    values: [], // Bắt đầu với mảng rỗng, không hiển thị input value mặc định
  });

  // Cập nhật giá trị của Attribute hoặc Value
  const updateFormValue = (key, value) => {
    setAttribute((prev) => ({ ...prev, [key]: value }));
  };

  // Cập nhật giá trị của từng Value theo chỉ số
  const updateValue = (index, newValue) => {
    const updatedValues = [...attribute.values];
    updatedValues[index] = newValue;
    setAttribute((prev) => ({ ...prev, values: updatedValues }));
  };

  // Thêm ô nhập Value mới
  const addValueField = () => {
    setAttribute((prev) => ({
      ...prev,
      values: [...prev.values, ''], // Thêm ô trống vào danh sách values
    }));
  };

  // Xóa một Value cụ thể theo chỉ số
  const removeValueField = (index) => {
    const updatedValues = attribute.values.filter((_, i) => i !== index);
    setAttribute((prev) => ({ ...prev, values: updatedValues }));
  };

  // Lưu Attribute và các Value
  const saveAttribute = () => {
    console.log('Saving Attribute with Values:', attribute);
    dispatch(
      showNotification({
        message: 'Attribute and Values Saved Successfully!',
        status: 1,
      })
    );

    // Reset form sau khi lưu
    setAttribute({ attributeName: '', enAttributeName: '', values: [] });
  };

  return (
    <TitleCard title="Manage Attributes and Values" topMargin="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <InputText
          labelTitle="Attribute Name"
          value={attribute.attributeName}
          updateFormValue={(e) => updateFormValue('attributeName', e.target.value)}
        />
      </div>

      <div className="mt-6">
        {/* Chỉ hiển thị ô nhập value nếu có ít nhất một giá trị */}
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
          Save Attribute
        </button>
      </div>
    </TitleCard>
  );
}

export default AttributePage;
