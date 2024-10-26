import { useState, useEffect } from 'react';

import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import TitleCard from '../../components/Cards/TitleCard';
import InputText from '../../components/Input/InputText';
import { useDispatch } from 'react-redux';
import { showNotification } from '../common/headerSlice';
import SearchBar from '../../components/Input/SearchBar';
import ProductService from '../../services/ProductService';

function ProductPage() {
  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);  // Loading state
  const [searchText, setSearchText] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);  // Kiểm tra chế độ chỉnh sửa
  const [product, setProduct] = useState({

    name: '',
    categoryID: '',
    brandID: '',
    description: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData, brandsData] = await Promise.all([
          ProductService.getProducts(),
          ProductService.getCategories(),
          ProductService.getBrands()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
        setBrands(brandsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        dispatch(showNotification({ message: 'Failed to load data', status: 0 }));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  const updateFormValue = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const saveProduct = async () => {
    try {
      if (isEditMode) {
        await ProductService.updateProduct(product.productID, product);
        setProducts(products.map(p => p.productID === product.productID ? product : p));
        dispatch(showNotification({ message: 'Product updated successfully!', status: 1 }));
      } else {
        const newProduct = await ProductService.createProduct(product);
        setProducts([...products, newProduct]);
        dispatch(showNotification({ message: 'Product added successfully!', status: 1 }));
      }
      resetForm();
    } catch (error) {
      console.error('Failed to save product:', error);
      dispatch(showNotification({ message: 'Failed to save product', status: 0 }));
    }
  };

  const editProduct = (prod) => {
    setProduct({
      productID: prod.productID,
      name: prod.name,
      categoryID: prod.categoryID,
      brandID: prod.brandID,
      description: prod.description
    });
    setIsEditMode(true);
  };

  const deleteProduct = async (id) => {
    try {
      await ProductService.deleteProduct(id);
      setProducts(products.filter((prod) => prod.productID !== id));
      dispatch(showNotification({ message: 'Product deleted successfully!', status: 1 }));
    } catch (error) {
      console.error('Failed to delete product:', error);
      dispatch(showNotification({ message: 'Failed to delete product', status: 0 }));
    }
  };

  const resetForm = () => {
    setProduct({ productID: '', name: '', categoryID: '', brandID: '', description: '' });
    setIsEditMode(false);
  };

  const applySearch = (value) => setSearchText(value);

  const filteredProducts = products.filter((prod) =>
    prod.name.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) return <p>Loading...</p>;



  return (
    <TitleCard title="Manage Products" topMargin="mt-6">
      <div className="mb-12 grid grid-cols-1 gap-4 ">
        <div className="relative">
          <input
            type="text"
            value={product.name}
            onChange={updateFormValue}
            id="name"
            placeholder=" "
            name="name"
            className="w-full peer bg-transparent h-10 rounded-lg text-black placeholder-transparent ring-2 px-2 ring-gray-200 focus:ring-sky-600 focus:outline-none"
          />
          <label
            htmlFor="name"
            className="absolute left-0 -top-3 text-sm text-gray-500 bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-3 peer-focus:text-sky-600"
          >
            Product name
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="relative">
            <select
              name="categoryID"
              value={product.categoryID}
              onChange={updateFormValue}
              className="select w-full border-2 border-neutral-content rounded-lg">
              <option value="" disabled>Select Category</option>
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
              className="select w-full border-2 border-neutral-content rounded-lg"
            >
              <option value="" disabled>Select Brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.brandName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <textarea
          name="description"
          value={product.description}
          onChange={updateFormValue}
          placeholder="Product Description"
          className="textarea w-full border-2 border-neutral-content rounded-lg h-24 mt-4"
        />
      </div>
      <div className="flex justify-end space-x-4">
        <button className="btn btn-secondary" onClick={resetForm}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={saveProduct}>
          {isEditMode ? 'Update Product' : 'Save Product'}
        </button>
      </div>
      <SearchBar searchText={searchText} setSearchText={applySearch} styleClass="mb-4" />
      <div className="overflow-x-auto w-full">
        <table className="table table-xs">
          <thead>
            <tr>
              <th>No.</th>
              <th>Name</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((prod) => (
              <tr key={prod.productID}>
                <td>{prod.productID}</td>
                <td>{prod.name}</td>
                <td>{categories.find(cat => cat.categoryID === prod.categoryID?.categoryID)?.name || 'N/A'}</td>
                <td>{brands.find(brand => brand.brandID === prod.brandID?.brandID)?.brandName || 'N/A'}</td>
                {/* <td>{categories.find(cat => cat.categoryID === prod.categoryID)?.name || 'N/A'}</td>
                <td>{brands.find(brand => brand.brandID === prod.brandID)?.brandName || 'N/A'}</td> */}

                <td>{prod.description}</td>
                <td className="flex space-x-2">
                  <button className="btn btn-sm btn-outline btn-primary border-0" onClick={() => editProduct(prod)}>
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button className="btn btn-sm btn-outline btn-error border-0" onClick={() => deleteProduct(prod.productID)}>
                    <TrashIcon className="h-4 w-4" />
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
