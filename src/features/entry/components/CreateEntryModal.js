import { useState } from 'react';
import EntryService from '../../../services/EntryService';
import InputDropdown from '../../../components/Input/InputDropdown'; 
import { useDispatch } from 'react-redux';
import { showNotification } from "../../common/headerSlice";

function CreateEntryModal({ showModal, closeModal, onEntryCreated }) {
  const dispatch = useDispatch();
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState('');

  const resetData = () => {
    setCart([]);
    setSelectedProduct(null);
    setQuantity('');
  };

  const handleAddToCart = () => {
    if (!selectedProduct || quantity <= 0) {
      dispatch(showNotification({ message: 'Vui lòng chọn sản phẩm và nhập số lượng hợp lệ.', status: 0 }));
      return;
    }
    const existingItem = cart?.find(item => item?.productVersionID === selectedProduct?.id);
    if (existingItem) {
      setCart(cart?.map(item => 
        item?.productVersionID === selectedProduct?.id 
          ? { ...item, quantity: item?.quantity + parseInt(quantity) }
          : item
      ));
    } else {
      setCart([...cart, { ...selectedProduct, quantity: parseInt(quantity) }]);
    }
    setSelectedProduct(null);
    setQuantity('');
  };

  const handleRemoveFromCart = (productId) => {
    setCart(cart?.filter(item => item?.productVersionID !== productId));
  };

  const handleQuantityChange = (index, newQuantity) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity = newQuantity;
    setCart(updatedCart);
  };

  const handleCreateEntry = async () => {
    if (cart?.length === 0) {
      dispatch(showNotification({ message: 'Vui lòng thêm ít nhất một sản phẩm vào giỏ hàng.', status: 0 }));
      return;
    }
    try {
      const entryData = {
        details: cart?.map(item => ({
          productVersionID: item?.productVersionID,
          quantity: item?.quantity
        }))
      };
      await EntryService?.createEntryOrder(entryData);
      dispatch(showNotification({ message: 'Đơn nhập đã được tạo thành công!', status: 1 }));
      onEntryCreated();
      handleCloseModal();
    } catch (error) {
      console.error("Lỗi khi tạo đơn nhập:", error);
      dispatch(showNotification({ message: 'Đã xảy ra lỗi khi tạo đơn nhập.', type: 'error' }));
    }
  };

  const handleCloseModal = () => {
    resetData();
    closeModal();
  };

  return (
    <>
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Tạo đơn nhập</h3>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Chọn sản phẩm</span>
              </label>
              <InputDropdown 
                onSelect={setSelectedProduct} 
                placeholder="Tìm sản phẩm..." 
              />
            </div>
            <div className="form-control mt-2">
              <label className="label">
                <span className="label-text">Số lượng</span>
              </label>
              <input
                type="number"
                className="input input-bordered"
                value={quantity}
                onChange={(e) => setQuantity(e?.target?.value)}
                placeholder="Nhập số lượng..."
              />
            </div>
            <button className="btn btn-primary mt-4" onClick={handleAddToCart}>
              Thêm vào giỏ hàng
            </button>
            <div className="mt-4">
              <h4 className="font-semibold">Giỏ hàng</h4>
              <table className="table table-auto w-full mt-2">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {cart?.map((item, index) => (
                    <tr key={item?.productVersionID}>
                      <td>{item?.productVersionName}</td>
                      <td>
                        <input
                          type="number"
                          className="input input-bordered w-16"
                          value={item?.quantity}
                          onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                        />
                      </td>
                      <td>
                        <button 
                          className="btn btn-error btn-sm"
                          onClick={() => handleRemoveFromCart(item?.productVersionID)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-action">
              <button className="btn btn-primary" onClick={handleCreateEntry}>Tạo đơn nhập</button>
              <button className="btn" onClick={handleCloseModal}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CreateEntryModal;
