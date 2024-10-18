import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import TitleCard from '../../components/Cards/TitleCard';
import InputText from '../../components/Input/InputText';
import SearchBar from '../../components/Input/SearchBar';
import { showNotification } from '../common/headerSlice';

function BrandPage() {
  const dispatch = useDispatch();

  // State quản lý danh sách brands và brand mới
  const [brands, setBrands] = useState([]);
  const [brand, setBrand] = useState({ name: '', logo: '' });
  const [searchText, setSearchText] = useState('');

  // Giả lập dữ liệu thương hiệu ban đầu
  useEffect(() => {
    const mockData = [
      { BrandID: '1', name: 'Apple', logo: 'apple-logo.png' },
      { BrandID: '2', name: 'Nike', logo: 'nike-logo.png' },
      { BrandID: '3', name: 'Samsung', logo: 'samsung-logo.png' },
    ];
    setBrands(mockData);
  }, []);

  // Hàm cập nhật thông tin brand mới
  const updateFormValue = (e) => {
    const { name, value } = e.target;
    setBrand((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý upload file logo
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setBrand((prev) => ({ ...prev, logo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Thêm thương hiệu mới vào danh sách
  const saveBrand = () => {
    if (!brand.name || !brand.logo) {
      dispatch(showNotification({ message: 'Please provide both name and logo.', status: 0 }));
      return;
    }

    const newBrand = {
      BrandID: (brands.length + 1).toString(),
      name: brand.name,
      logo: brand.logo,
    };

    setBrands([...brands, newBrand]);
    dispatch(showNotification({ message: 'Brand Added Successfully!', status: 1 }));
    setBrand({ name: '', logo: '' }); // Reset form
  };

  // Lọc danh sách thương hiệu theo từ khóa tìm kiếm
  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <TitleCard title="Manage Brands" topMargin="mt-6">

      <div className="mb-12 flex">
        <div className="flex-grow mr-2">
          <div className="p-8 items-center bg-white">
            <div className="flex flex-wrap">
              <InputText
                labelTitle="Brand Name"
                name="name"
                value={brand.name}
                updateFormValue={updateFormValue}
              />
            </div>

            {/* Chia bố cục 50-50 cho form chọn ảnh và nút Save */}
            <div className="mt-5 flex flex-wrap">
              {/* Form chọn và remove ảnh */}
              <div className="w-full md:w-1/2 relative grid grid-cols-1 md:grid-cols-3 border border-gray-300 bg-gray-100 rounded-lg">
                <div className="rounded-l-lg p-4 bg-gray-200 flex flex-col justify-center items-center border-0 border-r border-gray-300">
                  <label
                    className="cursor-pointer hover:opacity-80 inline-flex items-center shadow-md my-2 px-2 py-2 bg-gray-900 text-gray-50 border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 transition ease-in-out duration-150"
                    htmlFor="restaurantImage"
                  >
                    Select logo
                    <input
                      id="restaurantImage"
                      className="text-sm cursor-pointer w-36 hidden"
                      type="file"
                      onChange={handleLogoUpload}
                    />
                  </label>
                  <button
                    className="inline-flex items-center shadow-md my-2 px-2 py-2 bg-gray-900 text-gray-50 border border-transparent rounded-md font-semibold text-xs uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 transition ease-in-out duration-150"
                    onClick={() => setBrand({ ...brand, logo: '' })}
                  >
                    Remove logo
                  </button>
                </div>

                <div
                  className="relative order-first md:order-last h-28 md:h-auto flex justify-center items-center border border-dashed border-gray-400 col-span-2 m-2 rounded-lg bg-no-repeat bg-center bg-origin-padding bg-cover"
                  style={{ backgroundImage: `url(${brand.logo})` }}
                >
                  {!brand.logo && (
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
              </div>

              {/* Nút Save Brand */}
              <div className="w-full md:w-1/2 flex justify-end items-center mt-2 md:mt-0">
                <button className="btn btn-primary" onClick={saveBrand}>
                  Save Brand
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


      <hr />

      <SearchBar
        searchText={searchText}
        setSearchText={setSearchText}
        styleClass="mb-4 mt-4"
      />

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th className="text-center">Brand Name</th>
              <th>Logo</th>
              <th className="text-center" colSpan={2}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredBrands.map((b) => (
              <tr key={b.BrandID}>
                <td>{b.BrandID}</td>
                <td className="text-center">{b.name}</td>
                <td className="text-center">
                  <img src={b.logo} alt={b.name} className="w-10 h-10" />
                </td>
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

export default BrandPage;
