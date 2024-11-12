import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../common/headerSlice'; // Đường dẫn đúng
import attributeService from '../../../services/attributeService';
import MinusIcon from '@heroicons/react/24/outline/MinusIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';

const UpdateAttributeModal = ({ onClose, attribute, onAttributeUpdated }) => {
    const [attributeName, setAttributeName] = useState('');
    const [values, setValues] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        if (attribute) {
            setAttributeName(attribute.attributeName);
            setValues(attribute.attributeValues || []); // Đảm bảo sử dụng attributeValues
        }
    }, [attribute]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Kiểm tra trùng lặp trong danh sách values
        const duplicateValue = values.find((value, index) =>
            values.findIndex(v => v.attributeValue === value.attributeValue) !== index
        );

        if (duplicateValue) {
            // Nếu có trùng, hiển thị thông báo lỗi và không tiếp tục
            dispatch(showNotification({
                message: `Giá trị "${duplicateValue.attributeValue}" đã tồn tại. Vui lòng nhập giá trị khác.`,
                status: 0
            }));
            return;
        }

        try {
            const updatedAttribute = { ...attribute, attributeName, attributeValues: values }; // Cập nhật đúng giá trị
            await attributeService.updateAttribute(attribute.attributeID, updatedAttribute);
            onAttributeUpdated(updatedAttribute);
            dispatch(showNotification({ message: 'Cập nhật thuộc tính thành công!', status: 1 }));
            onClose();
        } catch (error) {
            dispatch(showNotification({ message: 'Cập nhật thuộc tính không thành công!', status: 0 }));
        }
    };

    const addValueField = () => {
        setValues([...values, '']);
    };

    const updateValue = (index, newValue) => {
        const updatedValues = [...values];
        updatedValues[index] = newValue;
        setValues(updatedValues);
    };

    const removeValueField = (index) => {
        const updatedValues = values.filter((_, i) => i !== index);
        setValues(updatedValues);
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
            <dialog open className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Chỉnh Sửa Thuộc Tính</h3>
                    <form className='mt-4' onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={attributeName}
                            onChange={(e) => setAttributeName(e.target.value)}
                            placeholder="Tên thuộc tính"
                            className="input input-bordered w-full mb-2"
                            required
                        />
                        {values.map((value, index) => (
                            <div key={index} className="flex items-center mb-2">
                                <input
                                    type="text"
                                    value={value.attributeValue} // Sửa đổi ở đây nếu value là đối tượng
                                    onChange={(e) => updateValue(index, { ...value, attributeValue: e.target.value })} // Cập nhật đúng giá trị
                                    placeholder={`Giá trị ${index + 1}`}
                                    className="input input-bordered w-full"
                                />
                                <MinusIcon className="w-10 h-10 cursor-pointer text-error" onClick={() => removeValueField(index)}></MinusIcon>

                            </div>
                        ))}
                        <div className="flex justify-end">
                            <PlusIcon className="w-10 h-10 text-primary" onClick={addValueField} />
                        </div>
                        <div className="modal-action">
                            <button type="submit" className="btn btn-outline btn-sm btn-primary">Cập nhật</button>
                            <button type="button" className="btn btn-outline btn-sm btn-secondary" onClick={onClose}>Đóng</button>
                        </div>
                    </form>
                </div>
            </dialog>
        </>
    );
};

export default UpdateAttributeModal;
