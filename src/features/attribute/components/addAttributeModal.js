import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../common/headerSlice'; // Đường dẫn đúng
import attributeService from '../../../services/attributeService';
import MinusIcon from '@heroicons/react/24/outline/MinusIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';



const AddAttributeModal = ({ onClose, onAttributeAdded }) => {
    const [attributeName, setAttributeName] = useState('');
    const [values, setValues] = useState(['']); // Bắt đầu với một giá trị trống
    const dispatch = useDispatch();
    const [attributes, setAttributes] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newAttribute = {
                attributeName,
                attributeValues: values.map(value => ({ attributeValue: value })) // Chuyển đổi thành đối tượng
            };

            const createdAttribute = await attributeService.createAttribute(newAttribute);
            onAttributeAdded(createdAttribute); // Cập nhật state ở component cha
            dispatch(showNotification({ message: 'Thêm thuộc tính thành công!', status: 1 }));
            resetForm();
            onClose();
        } catch (error) {
            console.error("Error creating attribute:", error);
            dispatch(showNotification({ message: 'Thêm thuộc tính không thành công! Lỗi: ' + error.message, status: 0 }));
        }
    };


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
    const resetForm = () => {
        setAttributeName('');
        setValues(['']);
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
                    <h3 className="font-bold text-lg">Thêm Thuộc Tính</h3>
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
                                    value={value}
                                    onChange={(e) => updateValue(index, e.target.value)}
                                    placeholder={`Giá trị ${index + 1}`}
                                    className="input input-bordered w-full"
                                />
                                <MinusIcon className=" w-10 h-10 cursor-pointer text-error" onClick={() => removeValueField(index)}></MinusIcon>
                            </div>
                        ))}
                        <div className="flex justify-end p-2">
                            <PlusIcon className="w-8 h-8 text-primary" onClick={addValueField} />
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
