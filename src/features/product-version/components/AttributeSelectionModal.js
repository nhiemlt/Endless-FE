import React, { useState, useEffect } from 'react';
import axios from 'axios';
import constants from '../../../utils/globalConstantUtil'; // Import constants


const AttributeSelectionModal = ({ onAddAttribute, onClose }) => {
    const [attributes, setAttributes] = useState([]); // Lưu trữ danh sách thuộc tính
    const [selectedAttribute, setSelectedAttribute] = useState(null);
    const [selectedValue, setSelectedValue] = useState('');
    const [loading, setLoading] = useState(true); // Trạng thái loading
    const [error, setError] = useState(''); // Lưu trữ thông báo lỗi

    // Gọi API để lấy danh sách thuộc tính
    useEffect(() => {
        const fetchAttributes = async () => {
            try {
                const response = await axios.get(`${constants.API_BASE_URL}/api/attributes`);
                console.log('Dữ liệu API trả về:', response.data); // Log toàn bộ dữ liệu để kiểm tra cấu trúc

                if (Array.isArray(response.data)) {
                    const validAttributes = response.data.filter(attr =>
                        attr.attributeID && attr.attributeName
                    );

                    if (validAttributes.length > 0) {
                        setAttributes(validAttributes);
                        setError('');
                    } else {
                        setError('Không có thuộc tính hợp lệ');
                    }
                } else {
                    setError('Dữ liệu trả về không hợp lệ');
                }
            } catch (error) {
                setError('Lỗi khi tải dữ liệu');
            } finally {
                setLoading(false);
            }
        };

        fetchAttributes();
    }, []);

    const handleAttributeChange = (e) => {
        const attributeId = e.target.value;
        const attribute = attributes.find(attr => attr.attributeID === attributeId);
        setSelectedAttribute(attribute);
        setSelectedValue(''); // Reset giá trị khi chọn thuộc tính mới
    };

    const handleValueChange = (value) => {
        setSelectedValue(value); // Cập nhật giá trị đã chọn
    };

    const handleAdd = () => {
        if (!selectedAttribute) {
            setError('Vui lòng chọn một thuộc tính');
        } else if (!selectedValue) {
            setError('Vui lòng chọn giá trị cho thuộc tính này');
        } else {
            // Tìm giá trị của thuộc tính đã chọn (attributeValue)
            const selectedAttributeValue = selectedAttribute.attributeValues.find(
                (value) => value.attributeValue === selectedValue
            );

            if (selectedAttributeValue) {
                console.log('Adding attribute:', {
                    attributeName: selectedAttribute.attributeName,
                    attributeValue: selectedValue,
                    attributeValueID: selectedAttributeValue.attributeValueID, // Thêm attributeValueID
                });

                // Truyền thông tin thuộc tính và attributeValueID lên component cha
                onAddAttribute({
                    attributeName: selectedAttribute.attributeName,
                    attributeValue: selectedValue,
                    attributeValueID: selectedAttributeValue.attributeValueID, // Truyền ID của giá trị thuộc tính
                });

                setSelectedAttribute(null); // Reset thuộc tính đã chọn
                setSelectedValue(''); // Reset giá trị đã chọn
                setError(''); // Xóa lỗi nếu đã chọn đầy đủ
            } else {
                setError('Không tìm thấy giá trị thuộc tính đã chọn');
            }
        }
    };



    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
            <dialog className="modal modal-open" role="dialog">
                <div className="modal-box w-11/12 max-w-lg">
                    <h3 className="font-bold text-lg">Chọn Thuộc Tính</h3>

                    {/* Hiển thị trạng thái loading */}
                    {loading && <p>Đang tải dữ liệu...</p>}

                    {/* Hiển thị lỗi nếu có */}
                    {error && <p className="text-red-500">{error}</p>}

                    <div className="mt-4">
                        {/* Dropdown chọn thuộc tính */}
                        {!loading && !error && (
                            <select
                                className="select select-bordered"
                                onChange={handleAttributeChange}
                                value={selectedAttribute ? selectedAttribute.attributeID : ''}
                            >
                                <option value="">Chọn thuộc tính</option>
                                {attributes.map((attribute) => (
                                    <option key={attribute.attributeID} value={attribute.attributeID}>
                                        {attribute.attributeName}
                                    </option>
                                ))}
                            </select>
                        )}

                        {/* Hiển thị các giá trị của thuộc tính khi đã chọn */}
                        {selectedAttribute && selectedAttribute.attributeValues && selectedAttribute.attributeValues.length > 0 && (
                            <div className="mt-4">
                                <h4 className="font-bold">{selectedAttribute.attributeName}</h4>
                                <div>
                                    {selectedAttribute.attributeValues.map((value) => (
                                        <label key={value.attributeValueID} className="block cursor-pointer">
                                            <input
                                                type="radio"
                                                name="attributeValue"
                                                value={value.attributeValue}
                                                checked={selectedValue === value.attributeValue}
                                                onChange={() => handleValueChange(value.attributeValue)}
                                            />
                                            {value.attributeValue}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Nếu không có giá trị nào cho thuộc tính */}
                        {selectedAttribute && selectedAttribute.attributeValues.length === 0 && (
                            <p>Không có giá trị nào cho thuộc tính này</p>
                        )}
                    </div>

                    <div className="modal-action mt-4">
                        <button
                            type="button"
                            className="btn btn-outline btn-sm btn-primary"
                            onClick={handleAdd}
                        >
                            Lưu
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline btn-sm btn-secondary"
                            onClick={onClose}
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </dialog>
        </>
    );
};

export default AttributeSelectionModal;
