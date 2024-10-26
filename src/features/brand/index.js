import { useState, useEffect } from 'react';
import TitleCard from '../../components/Cards/TitleCard';
import InputText from '../../components/Input/InputText';
import SearchBar from '../../components/Input/SearchBar';
import { showNotification } from '../common/headerSlice';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import BrandService from '../../services/BrandService';
import { useDispatch } from 'react-redux'; // Import useDispatch để gọi showNotification


function BrandPage() {
  const [brandName, setBrandName] = useState('');
  const [brandLogo, setBrandLogo] = useState(null);
  const [brands, setBrands] = useState([]);
  const [editBrand, setEditBrand] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [searchText, setSearchText] = useState('');
  const applySearch = (value) => setSearchText(value);


  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const fetchedBrands = await BrandService.getBrands();
        setBrands(fetchedBrands);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };
    fetchBrands();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setBrandLogo(file);
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl); // Lưu URL của ảnh đã chọn vào state
    }
  };

  const dispatch = useDispatch(); // Khởi tạo dispatch để gọi showNotification

  const createBrand = async () => {
    const brandData = new FormData();
    brandData.append('name', brandName);
    if (brandLogo) {
      brandData.append('logo', brandLogo);
    }

    try {
      await BrandService.createBrand(brandData);
      const fetchedBrands = await BrandService.getBrands();
      setBrands(fetchedBrands);
      resetForm();
      dispatch(
        showNotification({
          message: 'Brand Created Successfully!',
          status: 1,
        })
      );
    } catch (error) {
      console.error('Error creating brand:', error);
      dispatch(
        showNotification({
          message: 'Failed to Create Brand!',
          status: 0,
        })
      );
    }
  };


  const handleEdit = (brand) => {
    setBrandName(brand.brandName);
    setEditBrand(brand);
    setBrandLogo(null);
  };
  // Cập nhật thương hiệu
  const handleUpdate = async () => {
    const brandData = new FormData();
    brandData.append('name', brandName);
    if (brandLogo) brandData.append('logo', brandLogo);

    try {
      await BrandService.updateBrand(editBrand.brandID, brandData);
      const fetchedBrands = await BrandService.getBrands();
      setBrands(fetchedBrands);
      resetForm();
      dispatch(
        showNotification({
          message: 'Brand Updated Successfully!',
          status: 1,
        })
      );
    } catch (error) {
      console.error('Error updating brand:', error);
      dispatch(
        showNotification({
          message: 'Failed to Update Brand!',
          status: 0,
        })
      );
    }
  };

  // Xóa thương hiệu
  const handleDelete = async (id) => {
    try {
      await BrandService.deleteBrand(id);
      setBrands(brands.filter((brand) => brand.brandID !== id));
      dispatch(
        showNotification({
          message: 'Brand Deleted Successfully!',
          status: 1,
        })
      );
    } catch (error) {
      console.error('Error deleting brand:', error);
      dispatch(
        showNotification({
          message: 'Failed to Delete Brand!',
          status: 0,
        })
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editBrand) {
      await handleUpdate();
    } else {
      await createBrand();
    }
  };

  const resetForm = () => {
    setBrandName('');
    setBrandLogo(null);
    setEditBrand(null);
  };

  return (
    <TitleCard title="Manage Brands" topMargin="mt-6">
      <form onSubmit={handleSubmit}>
        <div className="mb-12 flex">
          <div className="flex-grow mr-2">
            <div className="p-8 items-center">
              <div className="relative">
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  id="name"
                  placeholder=" "
                  name="name"
                  className="w-full peer bg-transparent h-10 rounded-lg text-black placeholder-transparent ring-2 px-2 ring-gray-200 focus:ring-sky-600 focus:outline-none"
                />
                <label
                  htmlFor="name"
                  className="absolute left-0 -top-3 text-sm text-gray-500 bg-white px-1 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-3 peer-focus:text-sky-600"
                >
                  Brand Name
                </label>
              </div>

              <div className="mt-5">
                <input
                  id="logoInput"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="h-40 flex justify-center items-center border border-dashed border-gray-400 rounded-lg bg-no-repeat bg-center bg-cover cursor-pointer"
                  style={{ backgroundImage: previewImage ? `url(${previewImage})` : 'none' }}
                  onClick={() => document.getElementById('logoInput').click()}
                >
                  {!previewImage && (
                    <span className="text-gray-400 opacity-75">
                      <svg
                        className="w-14 h-14"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="0.7"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                        />
                      </svg>
                    </span>
                  )}
                </div>

                <div className="flex justify-end mt-2">
                  <button type="submit" className="btn btn-primary">
                    {editBrand ? 'Update Brand' : 'Save Brand'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      <hr />

      <SearchBar searchText={searchText} setSearchText={applySearch} styleClass="mb-4" />

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>No.</th>
              <th className="text-center">Brand Name</th>
              <th>Logo</th>
              <th className="text-center" colSpan={2}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand, index) => (
              <tr key={brand.brandID}>
                <td>{index + 1}</td>
                <td className="text-center">{brand.brandName}</td>
                <td className="text-center">
                  <img
                    src={brand.logo}
                    alt={brand.brandName}
                    className="w-10 h-10"
                  />
                </td>
                <td className="text-center">
                  <button
                    className="btn btn-sm btn-outline btn-info"
                    onClick={() => handleEdit(brand)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    className="btn btn-sm btn-outline btn-error"
                    onClick={() => handleDelete(brand.brandID)}
                  >
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

export default BrandPage;
