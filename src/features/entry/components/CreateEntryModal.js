import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../common/headerSlice';
import Select from 'react-select';
import ProductVersionService from '../../../services/productVersionService';
import EntryService from '../../../services/EntryService';

function CreateEntryModal({ showModal, closeModal, onEntryCreated }) {
  const dispatch = useDispatch();
  const [cart, setCart] = useState([]);
  const [productVersions, setProductVersions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10000000;
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchProductId, setSearchProductId] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const [selectedProduct, setSelectedProduct] = useState(null); // State mới để theo dõi sản phẩm đã chọn

  useEffect(() => {
    if (showModal) {
      const fetchProductVersions = async () => {
        try {
          const response = await ProductVersionService.getAllProductVersions(
            currentPage,
            itemsPerPage,
            'versionName',
            'ASC',
            searchKeyword,
            searchProductId,
            minPrice,
            maxPrice
          );
          setProductVersions(response.content);
        } catch (error) {
          dispatch(showNotification({ message: 'Lỗi khi tải danh sách sản phẩm.', status: 0 }));
        }
      };
      fetchProductVersions();
    }
  }, [showModal, currentPage, searchKeyword, searchProductId, minPrice, maxPrice, dispatch]);

  const resetData = () => {
    setCart([]);
    setSelectedProduct(null); // Reset giá trị sản phẩm khi đóng modal hoặc khi cần
  };

  const handleSelectProduct = (selectedProduct) => {
    if (!selectedProduct) return;

    const existingItem = cart.find(item => item.productVersionID === selectedProduct.productVersionID);
    if (existingItem) {
      setCart(cart.map(item =>
        item.productVersionID === selectedProduct.productVersionID
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...selectedProduct, quantity: 1 }]);
    }

    setSelectedProduct(null); // Reset lại giá trị sau khi chọn sản phẩm
  };

  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter(item => item.productVersionID !== productId));
  };

  const handleQuantityChange = (index, newQuantity) => {
    if (newQuantity < 1) return;
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
      dispatch(showNotification({ message: 'Đã xảy ra lỗi khi tạo đơn nhập.', status: 0 }));
    }
  };

  const handleCloseModal = () => {
    resetData();
    closeModal();
  };

  const customSingleValue = ({ data }) => (
    <div className="flex items-center">
      <img src={data.image} alt={data.label} className="w-8 h-8 rounded-full mr-2" />
      {data.label}
    </div>
  );

  const customOption = (props) => {
    const { data, innerRef, innerProps } = props;
    return (
      <div ref={innerRef} {...innerProps} className="flex items-center space-x-2 p-2 cursor-pointer">
        <img src={data.image} alt={data.label} className="w-8 h-8 rounded-full" />
        <span>{data.label}</span>
      </div>
    );
  };

  return (
    <div>
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Tạo đơn nhập</h3>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Chọn sản phẩm</span>
              </label>
              <Select
                options={productVersions.map(item => ({
                  image: item.image,
                  value: item.productVersionID,
                  label: `${item.product.name} - ${item.versionName}`
                })) || []}
                value={selectedProduct}  // Giá trị chọn được đặt thành null để không giữ giá trị
                onChange={(selectedOption) => {
                  const selectedProduct = productVersions.find(product => product.productVersionID === selectedOption.value);
                  handleSelectProduct(selectedProduct);
                }}
                placeholder="Tìm sản phẩm..."
                components={{ SingleValue: customSingleValue, Option: customOption }}
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
    </div>
  );
}

export default CreateEntryModal;
