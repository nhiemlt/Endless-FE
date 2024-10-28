import { useState, useEffect } from 'react';
import EntryService from '../../../services/EntryService';
import ProductVersionService from '../../../services/productVersionService';
import InputDropdown from '../../../components/Input/InputDropdown';
import { useDispatch } from 'react-redux';
import { showNotification } from "../../common/headerSlice";

function CreateEntryModal({ showModal, closeModal, onEntryCreated }) {
  const dispatch = useDispatch();
  const [cart, setCart] = useState([]);
  const [productVersions, setProductVersions] = useState([]);

  useEffect(() => {
    // Gọi API lấy danh sách sản phẩm khi modal mở
    const fetchProductVersions = async () => {
      try {
        const data = await ProductVersionService.getAllProductVersions();
        console.log(data.content)
        setProductVersions(data.content);
      } catch (error) {
        dispatch(showNotification({ message: 'Lỗi khi tải danh sách sản phẩm.', status: 0 }));
      }
    };
    if (showModal) fetchProductVersions();
  }, [showModal, dispatch]);

  const resetData = () => {
    setCart([]);
  };

  const handleSelectProduct = (selectedProduct) => {
    if (!selectedProduct) return;
    const existingItem = cart.find(item => item.productVersionID === selectedProduct.productVersionID);
    if (existingItem) {
      // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng
      setCart(cart.map(item =>
        item.productVersionID === selectedProduct.productVersionID
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới với số lượng 1
      setCart([...cart, { ...selectedProduct, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter(item => item.productVersionID !== productId));
  };

  const handleQuantityChange = (index, newQuantity) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity = newQuantity;
    setCart(updatedCart);
  };

  const handleCreateEntry = async () => {
    if (cart.length === 0) {
      dispatch(showNotification({ message: 'Vui lòng thêm ít nhất một sản phẩm vào giỏ hàng.', status: 0 }));
      return;
    }
    try {
      const entryData = {
        details: cart.map(item => ({
          productVersionID: item.productVersionID,
          quantity: item.quantity
        }))
      };
      await EntryService.createEntryOrder(entryData);
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
                options={productVersions || []} // truyền danh sách sản phẩm vào InputDropdown
                onSelect={handleSelectProduct}
                placeholder="Tìm sản phẩm..."
              />
            </div>
            <div className="mt-4">
              <h4 className="font-semibold">Giỏ hàng</h4>
              <table className="table table-auto table-xs w-full mt-2">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item, index) => (
                    <tr key={item.productVersionID}>
                      <td className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-8 h-8">
                            <img src={item.image} />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{item.product.name}</div>
                          <div className="text-sm opacity-50">{item.versionName}</div>
                        </div>
                      </td>
                      <td>
                        <input
                          type="number"
                          className="input input-bordered w-16"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                        />
                      </td>
                      <td>
                        <button
                          className="btn btn-error btn-sm"
                          onClick={() => handleRemoveFromCart(item.productVersionID)}
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
