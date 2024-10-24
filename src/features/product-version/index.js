import { useState, useEffect } from 'react';
import TitleCard from '../../components/Cards/TitleCard';
import InputText from '../../components/Input/InputText';
import { useDispatch } from 'react-redux';
import { showNotification } from '../common/headerSlice';
import SearchBar from '../../components/Input/SearchBar';

function ProductVersionPage() {
  const dispatch = useDispatch();

  const [productVersions, setProductVersions] = useState([]);
  const [products, setProducts] = useState([]); // Giả lập sản phẩm
  const [productVersion, setProductVersion] = useState({
    productVersionID: '', // UUID
    productID: '',
    versionName: '',
    costPrice: '',
    price: '',
    status: '',
    image: '',
  });

  const [searchText, setSearchText] = useState('');

  // Giả lập dữ liệu cho Products
  useEffect(() => {
    setProducts([
      { id: '1', name: 'Samsung Galaxy S21' },
      { id: '2', name: 'iPhone 13' },
      { id: '3', name: 'Sony WH-1000XM4' },
    ]);
  }, []);

  const updateFormValue = (e) => {
    const { name, value } = e.target;
    setProductVersion((prev) => ({ ...prev, [name]: value }));
  };

  const saveProductVersion = () => {
    const newProductVersion = {
      ...productVersion,
      productVersionID: `uuid-${productVersions.length + 1}`, // Giả lập UUID
      productName: products.find((prod) => prod.id === productVersion.productID)?.name || '',
    };

    setProductVersions([...productVersions, newProductVersion]);

    dispatch(
      showNotification({
        message: 'Product Version added successfully!',
        status: 1,
      })
    );

    setProductVersion({
      productVersionID: '',
      productID: '',
      versionName: '',
      costPrice: '',
      price: '',
      status: '',
      image: '',
    });
  };
  const [selectedImages, setSelectedImages] = useState([]);

  // Hàm xử lý khi chọn ảnh
  const handleImageChange = (event) => {
    const files = event.target.files;
    const newImages = Array.from(files);
    setSelectedImages((prevImages) => [...prevImages, ...newImages]);
  };

  // Hàm xóa ảnh theo chỉ số
  const removeImage = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const applySearch = (value) => setSearchText(value);

  const filteredProductVersions = productVersions.filter((ver) =>
    ver.versionName.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <TitleCard title="Manage Product Versions" topMargin="mt-6">
      <div className="mb-12 grid grid-cols-1 gap-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Input Version Name */}
          <div className="bg-white rounded-lg p-4">
            <div className="relative bg-inherit">
              <input
                type="text"
                onChange={updateFormValue}
                value={productVersion.versionName}
                id="versionName"
                placeholder="Version Name"
                name="versionName"
                className="w-full peer bg-transparent h-10 rounded-lg text-black placeholder-transparent ring-2 px-2 ring-gray-200 focus:ring-sky-600 focus:outline-none"
              />
              <label
                htmlFor="versionName"
                className="absolute cursor-text left-0 -top-3 text-sm text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all"
              >
                Version Name
              </label>
            </div>
          </div>

          {/* Select Product */}
          <div className="relative bg-white rounded-lg p-4">
            <select
              name="productID"
              value={productVersion.productID}
              onChange={updateFormValue}
              className="select w-full appearance-none text-gray-500 border-2 border-gray-300 rounded-lg focus:bg-white focus:text-black focus:ring-2 focus:ring-sky-600 focus:outline-none"
            >
              <option value="" disabled>
                Select Product
              </option>
              {products.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Input Cost Price */}
          <div className="bg-white rounded-lg p-4">
            <div className="relative bg-inherit">
              <input
                type="number"
                onChange={updateFormValue}
                value={productVersion.costPrice}
                id="costPrice"
                placeholder="Cost Price"
                name="costPrice"
                className="w-full peer bg-transparent h-10 rounded-lg text-black placeholder-transparent ring-2 px-2 ring-gray-200 focus:ring-sky-600 focus:outline-none"
              />
              <label
                htmlFor="costPrice"
                className="absolute cursor-text left-0 -top-3 text-sm text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all"
              >
                Cost Price
              </label>
            </div>
          </div>

          {/* Input Price */}
          <div className="bg-white rounded-lg p-4">
            <div className="relative bg-inherit">
              <input
                type="number"
                onChange={updateFormValue}
                value={productVersion.price}
                id="price"
                placeholder="Price"
                name="price"
                className="w-full peer bg-transparent h-10 rounded-lg text-black placeholder-transparent ring-2 px-2 ring-gray-200 focus:ring-sky-600 focus:outline-none"
              />
              <label
                htmlFor="price"
                className="absolute cursor-text left-0 -top-3 text-sm text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all"
              >
                Price
              </label>
            </div>
          </div>
        </div>

        {/* Input Attribute Value ID */}
        <div className="bg-white rounded-lg p-4">
          <div className="relative bg-inherit">
            <input
              type="text"
              onChange={updateFormValue}
              value={productVersion.attributeValueID}
              id="attributeValueID"
              placeholder="Attribute Value ID"
              name="attributeValueID"
              className="w-full peer bg-transparent h-10 rounded-lg text-black placeholder-transparent ring-2 px-2 ring-gray-200 focus:ring-sky-600 focus:outline-none"
            />
            <label
              htmlFor="attributeValueID"
              className="absolute cursor-text left-0 -top-3 text-sm text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all"
            >
              Attribute Value ID
            </label>
          </div>
        </div>

        {/* Input Image */}
        <div className="bg-white rounded-lg p-4">
          <input
            type="file"
            onChange={handleImageChange}
            id="image"
            placeholder="Select Images"
            name="image"
            multiple
            className="w-full text-gray-500 border-2 border-gray-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-sky-600 focus:outline-none"
          />
          <div className="mt-4 grid grid-cols-3 gap-2">
            {selectedImages.map((image, index) => (
              <div key={index} className="relative">
                <img src={URL.createObjectURL(image)} alt="Selected" className="w-full h-20 object-cover rounded-lg" />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>


      <div className="flex justify-end">
        <button className="btn btn-primary" onClick={saveProductVersion}>
          Save Product Version
        </button>
      </div>

      <SearchBar searchText={searchText} setSearchText={applySearch} styleClass="mb-4" />

      <div className="overflow-x-auto w-full">
        <table className="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Version Name</th>
              <th>Product</th>
              <th>Cost Price</th>
              <th>Price</th>
              <th>Status</th>
              <th>Image</th>
              <th className="text-center" colSpan={2}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProductVersions.map((ver) => (
              <tr key={ver.productVersionID}>
                <td>{ver.productVersionID}</td>
                <td>{ver.versionName}</td>
                <td>{ver.productName}</td>
                <td>{ver.costPrice}</td>
                <td>{ver.price}</td>
                <td>{ver.status}</td>
                <td>
                  <img src={ver.image} alt={ver.versionName} className="w-20 h-20 object-cover" />
                </td>
                <td className="text-center">
                  <button className="btn btn-warning">Edit</button>
                </td>
                <td className="text-center">
                  <button className="btn btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TitleCard>
  );
}

export default ProductVersionPage;
