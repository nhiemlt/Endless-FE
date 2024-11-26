import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { showNotification } from '../../features/common/headerSlice';
import TitleCard from "../../components/Cards/TitleCard";
import CartService from "../../services/CartService";
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});

  // Hàm định dạng tiền tệ
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

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

  const incrementQuantity = async (index) => {
    const updatedProduct = { ...products[index] };
    const originalQuantity = updatedProduct.quantity;

    const newQuantity = updatedProduct.quantity + 1;

    if (newQuantity > updatedProduct.stock) {
      dispatch(showNotification({ message: "Số lượng vượt quá số lượng tồn kho", status: 0 }));
      return;
    }

    updatedProduct.quantity = newQuantity;

    setProducts((prevProducts) =>
      prevProducts.map((product, i) => (i === index ? updatedProduct : product))
    );

    // Cập nhật selectedProducts nếu sản phẩm đang được chọn
    setSelectedProducts((prevSelected) => {
      if (prevSelected[updatedProduct.productVersionID]) {
        return { ...prevSelected, [updatedProduct.productVersionID]: updatedProduct };
      }
      return prevSelected;
    });

    try {
      await CartService.updateCartQuantity(updatedProduct); // Lưu vào database
    } catch (error) {
      dispatch(showNotification({ message: "Lỗi khi cập nhật số lượng", status: 0 }));
      // Khôi phục lại số lượng gốc nếu có lỗi
      updatedProduct.quantity = originalQuantity;
      setProducts((prevProducts) =>
        prevProducts.map((product, i) => (i === index ? updatedProduct : product))
      );
      setSelectedProducts((prevSelected) => {
        if (prevSelected[updatedProduct.productVersionID]) {
          return { ...prevSelected, [updatedProduct.productVersionID]: updatedProduct };
        }
        return prevSelected;
      });
    }
  };

  const decrementQuantity = async (index) => {
    const updatedProduct = { ...products[index] };
    const originalQuantity = updatedProduct.quantity;

    if (updatedProduct.quantity > 1) {
      updatedProduct.quantity -= 1;

      setProducts((prevProducts) =>
        prevProducts.map((product, i) => (i === index ? updatedProduct : product))
      );

      // Cập nhật selectedProducts nếu sản phẩm đang được chọn
      setSelectedProducts((prevSelected) => {
        if (prevSelected[updatedProduct.productVersionID]) {
          return { ...prevSelected, [updatedProduct.productVersionID]: updatedProduct };
        }
        return prevSelected;
      });

      try {
        await CartService.updateCartQuantity(updatedProduct); // Lưu vào database
      } catch (error) {
        dispatch(showNotification({ message: "Lỗi khi cập nhật số lượng", status: 0 }));
        // Khôi phục lại số lượng gốc nếu có lỗi
        updatedProduct.quantity = originalQuantity;
        setProducts((prevProducts) =>
          prevProducts.map((product, i) => (i === index ? updatedProduct : product))
        );
        setSelectedProducts((prevSelected) => {
          if (prevSelected[updatedProduct.productVersionID]) {
            return { ...prevSelected, [updatedProduct.productVersionID]: updatedProduct };
          }
          return prevSelected;
        });
      }
    } else {
      dispatch(showNotification({ message: "Số lượng tối thiểu là 1", status: 0 }));
    }
  };


  const handleQuantityChange = async (index, value) => {
    const newQuantity = Math.max(1, Number(value));
    const updatedProduct = { ...products[index], quantity: newQuantity };
    const originalQuantity = products[index].quantity;

    setProducts((prevProducts) =>
      prevProducts.map((product, i) => (i === index ? updatedProduct : product))
    );

    // Cập nhật selectedProducts nếu sản phẩm đang được chọn
    setSelectedProducts((prevSelected) => {
      if (prevSelected[updatedProduct.productVersionID]) {
        return { ...prevSelected, [updatedProduct.productVersionID]: updatedProduct };
      }
      return prevSelected;
    });

    try {
      await CartService.updateCartQuantity(updatedProduct); // Lưu vào database
    } catch (error) {
      dispatch(showNotification({ message: "Lỗi khi cập nhật số lượng", status: 0 }));
      // Khôi phục lại số lượng gốc nếu có lỗi
      updatedProduct.quantity = originalQuantity;
      setProducts((prevProducts) =>
        prevProducts.map((product, i) => (i === index ? updatedProduct : product))
      );
      setSelectedProducts((prevSelected) => {
        if (prevSelected[updatedProduct.productVersionID]) {
          return { ...prevSelected, [updatedProduct.productVersionID]: updatedProduct };
        }
        return prevSelected;
      });
    }
  };


  const handleRemoveItem = async (productVersionID) => {
    try {
      await CartService.deleteCartItem(productVersionID);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.productVersionID !== productVersionID)
      );
      setSelectedProducts((prevSelected) => {
        const newSelected = { ...prevSelected };
        delete newSelected[productVersionID];
        return newSelected;
      });
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleCheckboxChange = (product) => {
    setSelectedProducts((prevSelected) => ({
      ...prevSelected,
      [product.productVersionID]: !prevSelected[product.productVersionID] ? product : undefined, // Lưu sản phẩm nếu chưa được chọn, hoặc undefined nếu đã được chọn
    }));
  };

  const totalAmount = () => {
    const selectedTotal = products.reduce((total, product) => {
      return selectedProducts[product.productVersionID]
        ? total + product.discountPrice * product.quantity
        : total;
    }, 0);

    return Object.keys(selectedProducts).length > 0 ? selectedTotal : 0;
  };

  const totalQuantity = () => {
    return products.reduce((total, product) => {
      return selectedProducts[product.productVersionID]
        ? total + product.quantity
        : total;
    }, 0);
  };

  const handleCheckout = async () => {
    try {
      // Chọn các sản phẩm đã chọn
      const selectedItems = Object.values(selectedProducts).filter(Boolean);

      // Kiểm tra nếu không có sản phẩm nào được chọn
      if (selectedItems.length === 0) {
        dispatch(showNotification({ message: "Bạn cần chọn ít nhất một sản phẩm", status: 0 }));
        return;
      }

      // Điều hướng sang trang thanh toán
      navigate('/purchase', { state: { selectedItems } });
    } catch (error) {
      dispatch(showNotification({ message: "Lỗi khi chuyển sang trang thanh toán", status: 0 }));
    }
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
                    <input
                      type="checkbox"
                      checked={!!selectedProducts[product.productVersionID]}
                      onChange={() => handleCheckboxChange(product)} // Truyền cả sản phẩm vào đây
                      className="mr-2"
                    />
                    <img
                      src={product.image}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div className="flex flex-1 flex-col">
                      <h3 className="text-sm text-gray-900 dark:text-gray-200"><b>{product.productName} | {product.versionName}</b></h3>
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
                    <div className="flex items-center gap-2">
                      <div className="flex items-center space-x-2">
                        <div>
                          <label htmlFor={`Quantity_${index}`} className="sr-only">Quantity</label>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => decrementQuantity(index)} // Gọi hàm giảm số lượng
                              className={`size-10 leading-10 font-bold dark:text-white text-gray-900 transition hover:opacity-75 ${product.quantity === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                              disabled={product.quantity === 1} // Vô hiệu hóa nếu số lượng là 1
                            >
                              -
                            </button>

                            <input
                              type="number"
                              id={`Quantity_${index}`}
                              value={product.quantity} // Lấy giá trị số lượng từ product
                              onChange={(e) => handleQuantityChange(index, e.target.value)} // Cập nhật khi giá trị thay đổi
                              className="h-10 w-20 rounded border border-gray-200 bg-white text-black text-center [-moz-appearance:_textfield] sm:text-sm [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                            />

                            <button
                              type="button"
                              onClick={() => incrementQuantity(index)} // Gọi hàm tăng số lượng
                              className="size-10 leading-10 font-bold dark:text-white text-gray-900 transition hover:opacity-75"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(product.productVersionID)}
                        className="text-gray-600 transition hover:text-red-600"
                      >
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
                    <div className="flex justify-between font-semibold">
                      <dt>Tổng tiền</dt>
                      <dd className="text-red-500"><b>{formatCurrency(totalAmount())}</b></dd>
                    </div>
                  </dl>
                  <div className="flex justify-end">
                  <button
                    onClick={handleCheckout}
                    className={`block rounded bg-blue-600 px-5 py-3 text-sm text-white transition ${Object.keys(selectedProducts).length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={Object.keys(selectedProducts).length === 0} // Disable the button if no products are selected
                  >
                    Thanh toán
                  </button>
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
