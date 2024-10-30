import { useState, useEffect } from 'react';
import TitleCard from "../../components/Cards/TitleCard";
import CartService from "../../services/CartService";
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';

function Cart() {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});

  // Hàm định dạng tiền tệ
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  // Lấy dữ liệu giỏ hàng từ API khi component mount
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const cartItems = await CartService.getCarts();
        setProducts(cartItems);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  const handleQuantityChange = (index, newQuantity) => {
    setProducts((prevProducts) =>
      prevProducts.map((product, i) =>
        i === index ? { ...product, quantity: newQuantity } : product
      )
    );
  };

  const handleRemoveItem = async (productVersionID) => {
    try {
      await CartService.deleteCartItem(productVersionID);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.productVersionID !== productVersionID)
      );
      // Xóa sản phẩm khỏi danh sách chọn nếu có
      setSelectedProducts((prevSelected) => {
        const newSelected = { ...prevSelected };
        delete newSelected[productVersionID];
        return newSelected;
      });
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleCheckboxChange = (productVersionID) => {
    setSelectedProducts((prevSelected) => ({
      ...prevSelected,
      [productVersionID]: !prevSelected[productVersionID],
    }));
  };

  const totalAmount = () => {
    const selectedTotal = products.reduce((total, product) => {
      return selectedProducts[product.productVersionID]
        ? total + product.discountPrice * product.quantity
        : total;
    }, 0);

    // Trả về 0 nếu không có sản phẩm nào được chọn
    return Object.keys(selectedProducts).length > 0 ? selectedTotal : 0;
  };

  const totalQuantity = () => {
    return products.reduce((total, product) => {
      return selectedProducts[product.productVersionID]
        ? total + product.quantity
        : total;
    }, 0);
  };

  return (
    <TitleCard>
      <section className="bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <header className="text-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-3xl">Giỏ hàng của bạn</h1>
            </header>
            <div className="mt-8">
              <ul className="space-y-4">
                {products.map((product, index) => (
                  <li key={product.productVersionID} className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                    {/* Checkbox nằm trước hình ảnh */}
                    <input
                      type="checkbox"
                      checked={!!selectedProducts[product.productVersionID]}
                      onChange={() => handleCheckboxChange(product.productVersionID)}
                      className="mr-2"
                    />
                    <img
                      src={product.image}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div className="flex flex-1 flex-col">
                      <h3 className="text-sm text-gray-900 dark:text-gray-200"><b>{product.versionName}</b></h3>
                      <dl className="mt-0.5 space-y-px text-[10px] text-gray-600 dark:text-gray-400">
                        <div>
                          <dt className="inline">Giá: </dt>
                          <dd className="inline">{formatCurrency(product.price)}</dd>
                        </div>
                        <div>
                          <dt className="inline">Giá khuyến mãi: </dt>
                          <dd className="inline">{formatCurrency(product.discountPrice)}</dd>
                        </div>
                      </dl>
                    </div>

                    <div className="flex flex-1 items-center justify-end gap-2">
                      <label htmlFor={`qty_${index}`} className="sr-only">Số lượng</label>
                      <input
                        type="number"
                        min="1"
                        value={product.quantity}
                        id={`qty_${index}`}
                        onChange={(e) => handleQuantityChange(index, parseInt(e.target.value, 10))}
                        className="h-8 w-12 rounded border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 p-0 text-center text-xs text-gray-600 dark:text-gray-300"
                      />
                      <button
                        onClick={() => handleRemoveItem(product.productVersionID)}
                        className="text-gray-600 transition hover:text-red-600"
                      >
                        <span className="sr-only">Xóa sản phẩm</span>
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex justify-end border-t border-gray-100 dark:border-gray-700 pt-8">
                <div className="w-screen max-w-lg space-y-4">
                  <dl className="space-y-0.5 text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex justify-between">
                      <dt>Tổng số lượng</dt>
                      <dd>{totalQuantity()}</dd>
                    </div>
                    <div className="flex justify-between !text-base font-medium">
                      <dt>Tổng cộng</dt>
                      <dd>{formatCurrency(totalAmount())}</dd>
                    </div>
                  </dl>

                  <div className="flex justify-end">
                    <a
                      href="#"
                      className="block rounded bg-gray-700 px-5 py-3 text-sm text-gray-100 transition hover:bg-blue-600"
                    >
                      Thanh toán
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </TitleCard>
  );
}

export default Cart;
