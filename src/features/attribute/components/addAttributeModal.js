import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../common/headerSlice';
import attributeService from '../../../services/attributeService';
import MinusIcon from '@heroicons/react/24/outline/MinusIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';

const AddAttributeModal = ({ onClose, onAttributeAdded }) => {
    const [attributeName, setAttributeName] = useState('');
    const [values, setValues] = useState([]); // Không có giá trị ban đầu
    const [visibleInputs, setVisibleInputs] = useState([]); // Lưu trạng thái hiển thị của từng input
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra input nào đang hiển thị nhưng bị bỏ trống
        const invalidIndex = visibleInputs.findIndex((visible, index) => visible && !values[index]);
        if (invalidIndex !== -1) {
            dispatch(showNotification({
                message: `Giá trị ở vị trí ${invalidIndex + 1} không được để trống.`,
                status: 0
            }));
            return;
        }

        // Kiểm tra trùng lặp
        const duplicateValue = values.find((value, index) => values.indexOf(value) !== index);
        if (duplicateValue) {
            dispatch(showNotification({
                message: `Giá trị "${duplicateValue}" đã tồn tại. Vui lòng nhập giá trị khác.`,
                status: 0
            }));
            return;
        }

        try {
            const newAttribute = {
                attributeName,
                attributeValues: values.map(value => ({ attributeValue: value }))
            };

            const createdAttribute = await attributeService.createAttribute(newAttribute);
            onAttributeAdded(createdAttribute);
            dispatch(showNotification({ message: 'Thêm thuộc tính thành công!', status: 1 }));
            resetForm();
            onClose();
        } catch (error) {
            dispatch(showNotification({ message: `Thêm thuộc tính không thành công! Lỗi: ${error.message}`, status: 0 }));
            console.error("Error creating attribute:", error);
        }
    };

    const resetForm = () => {
        setAttributeName('');
        setValues([]);
        setVisibleInputs([]);
    };

    const addValueField = () => {
        setValues([...values, '']);
        setVisibleInputs([...visibleInputs, false]); // Input mặc định ẩn
    };

    const showValueField = (index) => {
        const updatedVisibleInputs = [...visibleInputs];
        updatedVisibleInputs[index] = true;
        setVisibleInputs(updatedVisibleInputs);
    };

    const updateValue = (index, newValue) => {
        const updatedValues = [...values];
        updatedValues[index] = newValue;
        setValues(updatedValues);
    };

    const removeValueField = (index) => {
        const updatedValues = values.filter((_, i) => i !== index);
        const updatedVisibleInputs = visibleInputs.filter((_, i) => i !== index);
        setValues(updatedValues);
        setVisibleInputs(updatedVisibleInputs);
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
            <dialog open className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Thêm Thuộc Tính</h3>
                    <form className="mt-4" onSubmit={handleSubmit}>
                        {/* Label for Attribute Name */}
                        <label htmlFor="attributeName" className="block mb-2 font-semibold">Tên thuộc tính</label>
                        <input
                            id="attributeName"
                            type="text"
                            value={attributeName}
                            onChange={(e) => setAttributeName(e.target.value)}
                            placeholder="Nhập tên thuộc tính"
                            className="input input-bordered w-full mb-2"
                            required
                        />

                        {/* Loop through values and add labels */}
                        {values.map((value, index) => (
                            <div key={index} className="flex items-center mb-4">
                                {visibleInputs[index] ? (
                                    <>
                                        <label htmlFor={`value-${index}`} className="w-32 text-right pr-4 font-semibold">
                                            Giá trị {index + 1}
                                        </label>
                                        <input
                                            id={`value-${index}`}
                                            type="text"
                                            value={value}
                                            onChange={(e) => updateValue(index, e.target.value)}
                                            placeholder={`Nhập giá trị ${index + 1}`}
                                            className="input input-bordered w-full"
                                        />
                                        <MinusIcon
                                            className="w-10 h-10 ml-2 cursor-pointer text-error"
                                            onClick={() => removeValueField(index)}
                                            title="Xóa giá trị" // Tooltip mặc định
                                        />
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        className="btn btn-outline btn-sm btn-secondary"
                                        onClick={() => showValueField(index)}
                                    >
                                        Thêm giá trị {index + 1}
                                    </button>
                                )}
                            </div>
                        ))}


                        {/* Add new value field */}
                        <div className="flex justify-end p-2">
                            <PlusIcon
                                className="w-8 h-8 text-primary cursor-pointer"
                                onClick={addValueField}
                                title="Thêm giá trị" // Tooltip mặc định
                            />
                        </div>


                        <div className="modal-action">
                            <button type="submit" className="btn btn-outline btn-sm btn-primary">Lưu</button>
                            <button type="button" className="btn btn-outline btn-sm btn-secondary" onClick={onClose}>Đóng</button>
                        </div>
                    </form>
                </div>
            </dialog>
        </>
    );
};

export default AddAttributeModal;
