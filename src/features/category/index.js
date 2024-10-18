import { useState, useEffect } from 'react';
import TitleCard from '../../components/Cards/TitleCard';
import InputText from '../../components/Input/InputText';
import { useDispatch } from 'react-redux';
import { showNotification } from '../common/headerSlice';
import SearchBar from '../../components/Input/SearchBar';

function CategoryPage() {
  const dispatch = useDispatch();

  const [categories, setCategories] = useState([]); // State cho danh sách categories
  const [category, setCategory] = useState({ name: '' }); // State cho category mới
  const [searchText, setSearchText] = useState(""); // State cho tìm kiếm

  // Giả lập dữ liệu cho categories
  useEffect(() => {
    setCategories([
      { id: 1, name: "Electronics" },
      { id: 2, name: "Fashion" },
      { id: 3, name: "Home Appliances" },
    ]);
  }, []);

  // Cập nhật giá trị của Category
  const updateFormValue = (e) => {
    setCategory({ name: e.target.value });
  };

  // Lưu Category mới
  const saveCategory = () => {
    const newCategory = { id: categories.length + 1, name: category.name };
    setCategories([...categories, newCategory]); // Thêm danh mục mới vào danh sách
    dispatch(
      showNotification({
        message: 'Category Added Successfully!',
        status: 1,
      })
    );
    setCategory({ name: '' }); // Reset form sau khi lưu
  };

  // Tìm kiếm category
  const applySearch = (value) => {
    setSearchText(value);
  };

  // Lọc danh sách categories theo searchText
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <TitleCard title="Manage Categories" topMargin="mt-6">
      <div className="mb-12 flex">
        <div className="flex-grow mr-2">
          <InputText
            labelTitle="Category Name"
            value={category.name}
            updateFormValue={updateFormValue}
          />
        </div>
        <div className="flex-none mt-9">
          <button className="btn btn-primary" onClick={saveCategory}>
            Save Category
          </button>
        </div>
      </div>
      {/* Thêm SearchBar vào đây */}
      <SearchBar searchText={searchText} setSearchText={applySearch} styleClass="mb-4" />
      <div className="overflow-x-auto w-full">
        <table className="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th className='text-center'>Category Name</th>
              <th colSpan={2} className='text-center'>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.id}</td>
                <td className='text-center'>{cat.name}</td>
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
      <div className="join flex justify-center mt-5">
        <button className="join-item btn">«</button>
        <button className="join-item btn">Page 1</button>
        <button className="join-item btn">»</button>
      </div>
    </TitleCard>
  );
}

export default CategoryPage;
