import { useState, useEffect } from 'react';
import TitleCard from '../../components/Cards/TitleCard';
import InputText from '../../components/Input/InputText';
import { useDispatch } from 'react-redux';
import { showNotification } from '../common/headerSlice';
import SearchBar from '../../components/Input/SearchBar';

function ProductVersionPage() {
  const dispatch = useDispatch();

  const [productVersions, setProductVersions] = useState([]);
  const [products, setProducts] = useState([]);
  const [attributes, setAttributes] = useState([]); // Giả lập các thuộc tính
  const [productVersion, setProductVersion] = useState({
    productVersionID: '',
    productID: '',
    versionName: '',
    costPrice: '',
    price: '',
    status: '',
    image: '',
    attributes: [],
  });

  const [searchText, setSearchText] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    setProducts([
      { id: '1', name: 'Samsung Galaxy S21' },
      { id: '2', name: 'iPhone 13' },
      { id: '3', name: 'Sony WH-1000XM4' },
    ]);

    setAttributes([
      { id: 'color', name: 'Color' },
      { id: 'size', name: 'Size' },
      { id: 'material', name: 'Material' },
    ]);
  }, []);

  const updateFormValue = (e) => {
    const { name, value } = e.target;
    setProductVersion((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAttribute = () => {
    setProductVersion((prev) => ({
      ...prev,
      attributes: [...prev.attributes, { attributeID: '', value: '' }],
    }));
  };

  const handleAttributeChange = (index, field, value) => {
    const newAttributes = [...productVersion.attributes];
    newAttributes[index][field] = value;
    setProductVersion((prev) => ({ ...prev, attributes: newAttributes }));
  };

  const handleRemoveAttribute = (index) => {
    const newAttributes = productVersion.attributes.filter((_, i) => i !== index);
    setProductVersion((prev) => ({ ...prev, attributes: newAttributes }));
  };

  const handleImageChange = (event) => {
    const files = event.target.files;
    const newImages = Array.from(files);
    setSelectedImages((prevImages) => [...prevImages, ...newImages]);
  };

  const removeImage = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const saveProductVersion = () => {
    const newProductVersion = {
      ...productVersion,
      productVersionID: `uuid-${productVersions.length + 1}`,
      productName: products.find((prod) => prod.id === productVersion.productID)?.name || '',
    };

    setProductVersions([...productVersions, newProductVersion]);
    dispatch(showNotification({ message: 'Product Version added successfully!', status: 1 }));

    setProductVersion({
      productVersionID: '',
      productID: '',
      versionName: '',
      costPrice: '',
      price: '',
      status: '',
      image: '',
      attributes: [],
    });
  };

  const applySearch = (value) => setSearchText(value);

  const filteredProductVersions = productVersions.filter((ver) =>
    ver.versionName.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <TitleCard title="Manage Product Versions" topMargin="mt-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            onChange={updateFormValue}
            value={productVersion.versionName}
            placeholder="Version Name"
            name="versionName"
            className="input w-full border-gray-300 rounded-lg focus:ring-sky-600 focus:border-sky-600"
          />
          <select
            name="productID"
            value={productVersion.productID}
            onChange={updateFormValue}
            className="select w-full border-gray-300 rounded-lg focus:ring-sky-600 focus:border-sky-600"
          >
            <option value="" disabled>Select Product</option>
            {products.map((prod) => (
              <option key={prod.id} value={prod.id}>{prod.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            onChange={updateFormValue}
            value={productVersion.costPrice}
            placeholder="Cost Price"
            name="costPrice"
            className="input w-full border-gray-300 rounded-lg focus:ring-sky-600 focus:border-sky-600"
          />
          <input
            type="number"
            onChange={updateFormValue}
            value={productVersion.price}
            placeholder="Price"
            name="price"
            className="input w-full border-gray-300 rounded-lg focus:ring-sky-600 focus:border-sky-600"
          />
        </div>

        <div>
          <button onClick={handleAddAttribute} className="btn btn-secondary mb-2">
            Add Attribute
          </button>
          {productVersion.attributes.map((attr, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <select
                value={attr.attributeID}
                onChange={(e) => handleAttributeChange(index, 'attributeID', e.target.value)}
                className="select w-1/2 border-gray-300 rounded-lg focus:ring-sky-600 focus:border-sky-600"
              >
                <option value="" disabled>Select Attribute</option>
                {attributes.map((attr) => (
                  <option key={attr.id} value={attr.id}>{attr.name}</option>
                ))}
              </select>
              <input
                type="text"
                value={attr.value}
                onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                placeholder="Attribute Value"
                className="input w-1/2 border-gray-300 rounded-lg focus:ring-sky-600 focus:border-sky-600"
              />
              <button onClick={() => handleRemoveAttribute(index)} className="btn btn-danger">
                X
              </button>
            </div>
          ))}
        </div>

        <div>
          <input
            type="file"
            onChange={handleImageChange}
            multiple
            className="input w-full border-gray-300 rounded-lg focus:ring-sky-600 focus:border-sky-600"
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

        <div className="flex justify-end">
          <button onClick={saveProductVersion} className="btn btn-primary">
            Save Product Version
          </button>
        </div>

        <SearchBar searchText={searchText} setSearchText={applySearch} styleClass="mb-4" />

        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Version Name</th>
                <th>Product</th>
                <th>Cost Price</th>
                <th>Price</th>
                <th>Attributes</th>
                <th>Image</th>
                <th>Actions</th>
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
                  <td>{ver.attributes.map(attr => `${attr.attributeID}: ${attr.value}`).join(', ')}</td>
                  <td>
                    <img src={ver.image} alt={ver.versionName} className="w-20 h-20 object-cover" />
                  </td>
                  <td className="flex space-x-2">
                    <button className="btn btn-warning">Edit</button>
                    <button className="btn btn-danger">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </TitleCard>
  );
}

export default ProductVersionPage;
