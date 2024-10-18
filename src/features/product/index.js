import { useState, useEffect } from 'react';
import TitleCard from '../../components/Cards/TitleCard';
import InputText from '../../components/Input/InputText';
import { useDispatch } from 'react-redux';
import { showNotification } from '../common/headerSlice';
import SearchBar from '../../components/Input/SearchBar';

function ProductPage() {
  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [product, setProduct] = useState({
    name: '',
    categoryID: '',
    brandID: '',
    description: '',
  });

  const [searchText, setSearchText] = useState('');

  // Giả lập dữ liệu cho Categories và Brands
  useEffect(() => {
    setCategories([
      { id: '1', name: 'Electronics' },
      { id: '2', name: 'Fashion' },
      { id: '3', name: 'Home Appliances' },
    ]);

    setBrands([
      { id: '1', name: 'Samsung' },
      { id: '2', name: 'Apple' },
      { id: '3', name: 'Sony' },
    ]);
  }, []);

  const updateFormValue = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const saveProduct = () => {
    const newProduct = {
      ...product,
      id: products.length + 1,
      categoryName: categories.find((cat) => cat.id === product.categoryID)?.name || '',
      brandName: brands.find((brand) => brand.id === product.brandID)?.name || '',
    };

    setProducts([...products, newProduct]);

    dispatch(
      showNotification({
        message: 'Product added successfully!',
        status: 1,
      })
    );

    setProduct({ name: '', categoryID: '', brandID: '', description: '' });
  };

  const applySearch = (value) => setSearchText(value);

  const filteredProducts = products.filter((prod) =>
    prod.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <TitleCard title="Manage Products" topMargin="mt-6">
      <div className="mb-12 grid grid-cols-1 gap-4">
        {/* Input name đứng riêng 1 hàng */}

        <div className="bg-white rounded-lg ">
          <div className="relative bg-inherit">
            <input type="text"
              onChange={updateFormValue}
              value={product.name}
              id="name"
              placeholder="Product Name"
              name="name" className="w-full peer bg-transparent h-10 w-72 rounded-lg text-black placeholder-transparent ring-2 px-2 ring-gray-200 focus:ring-sky-600 focus:outline-none focus:border-rose-600" /><label for="product name" class="absolute cursor-text left-0 -top-3 text-sm text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all">Product Name</label>
          </div>
        </div>


        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="relative">
            <select
              name="categoryID"
              value={product.categoryID}
              onChange={updateFormValue}
              className="select w-full appearance-none bg-gray-100 text-gray-500 border-2 border-gray-300 rounded-lg focus:bg-white focus:text-black focus:ring-2 focus:ring-sky-600 focus:outline-none"
            >
              <option value="" disabled>
                Select Category
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <select
              name="brandID"
              value={product.brandID}
              onChange={updateFormValue}
              className="select w-full appearance-none bg-gray-100 text-gray-500 border-2 border-gray-300 rounded-lg focus:bg-white focus:text-black focus:ring-2 focus:ring-sky-600 focus:outline-none"
            >
              <option value="" disabled>
                Select Brand
              </option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Textarea đứng riêng 1 hàng */}
        <div className="bg-white rounded-lg mt-4">
          <div className="relative bg-inherit">
            <textarea
              name="description"
              value={product.description}
              onChange={updateFormValue}
              rows={3}
              id="description"
              placeholder="Product Description"
              className="w-full peer bg-transparent h-24 w-72 rounded-lg text-black placeholder-transparent ring-2 px-2 py-1 ring-gray-200 focus:ring-sky-600 focus:outline-none"
            />
            <label
              htmlFor="description"
              className="absolute cursor-text left-0 -top-3 text-sm text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all"
            >
              Product Description
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="btn btn-primary" onClick={saveProduct}>
          Save Product
        </button>
      </div>

      <SearchBar searchText={searchText} setSearchText={applySearch} styleClass="mb-4" />

      <div className="overflow-x-auto w-full">
        <table className="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Description</th>
              <th className="text-center" colSpan={2}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((prod) => (
              <tr key={prod.id}>
                <td>{prod.id}</td>
                <td>{prod.name}</td>
                <td>{prod.categoryName}</td>
                <td>{prod.brandName}</td>
                <td>{prod.description}</td>
                <td className="text-center">
                  <button className="btn btn-sm btn-outline btn-info">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                      />
                    </svg>
                  </button>
                  <button className="btn btn-sm btn-outline btn-error">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TitleCard>
  );
}

export default ProductPage;
