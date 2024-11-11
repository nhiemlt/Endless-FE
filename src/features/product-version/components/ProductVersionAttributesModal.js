import React, { useEffect } from 'react';

function ProductVersionAttributesModal({ version, onClose }) {

    // In thông tin version và attributes khi component được render
    useEffect(() => {
        if (version && version.versionAttributes && version.versionAttributes.length > 0) {
            console.log("Attributes data:", version.versionAttributes);
        } else {
            console.log("No attributes available.");
        }
    }, [version]);


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Chi tiết sản phẩm</h2>

                <h3 className="font-bold">Version Name: {version.versionName}</h3>
                <hr></hr>
                <h4 className="mt-2">Thuộc tính:</h4>
                <table className="table table-sm w-full mt-2">
                    <thead>
                        <tr>
                            <th>Tên thuộc tính</th>
                            <th>Giá trị</th>
                        </tr>
                    </thead>
                    <tbody>
                        {version.versionAttributes && version.versionAttributes.length > 0 ? (
                            version.versionAttributes.map((attribute, index) => (
                                <tr key={index}>
                                    <td>{attribute.attributeName}</td>
                                    <td>{attribute.attributeValue}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2" className="text-center">Không có thuộc tính nào</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="flex justify-end mt-6">
                    <button className="btn btn-outline btn-primary px-6 py-2" onClick={onClose}>Đóng</button>
                </div>
            </div>
        </div>
    );
}

export default ProductVersionAttributesModal;
