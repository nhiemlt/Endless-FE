import { useState, useEffect } from 'react';
import TitleCard from '../../components/Cards/TitleCard';
import InputText from '../../components/Input/InputText';
import { useDispatch } from 'react-redux';
import { showNotification } from '../common/headerSlice';
import SearchBar from '../../components/Input/SearchBar';
import ProductVersionService from '../../services/productVersionService';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';

function ProductVersionPage() {
  const [productVersions, setProductVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');


  useEffect(() => {
    const fetchProductVersions = async () => {
      setLoading(true); // Bắt đầu loading
      try {
        const data = await ProductVersionService.getAllProductVersions();
        setProductVersions(data.content); // Lưu dữ liệu vào state
      } catch (err) {
        console.error("Error fetching product versions:", err);
        setError("Có lỗi xảy ra khi tải dữ liệu."); // Lưu thông báo lỗi
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };

    fetchProductVersions();
  }, []);

  // Hiển thị loading nếu đang tải dữ liệu
  if (loading) {
    return <div>Loading...</div>;
  }

  // Hiển thị thông báo lỗi nếu có
  if (error) {
    return <div>{error}</div>;
  }
  const applySearch = (value) => setSearchText(value);


  return (
    <TitleCard title="Manage Product Versions" topMargin="mt-6">
      <div className="space-y-4">


        <SearchBar searchText={searchText} setSearchText={applySearch} styleClass="mb-4" />

        <div className="overflow-x-auto">
          <table className="table table-xs w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Version Name</th>
                {/* <th>Product</th> */}
                <th>Cost Price</th>
                <th>Price</th>
                <th>Weight</th>
                <th>Height</th>
                <th>Length</th>
                <th>Width</th>
                {/* <th>Attributes</th> */}
                <th>Status</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {productVersions.map((version) => (
                <tr key={version.productVersionID}>
                  <td>{version.productVersionID}</td>
                  <td>{version.versionName}</td>
                  <td>{version.purchasePrice}</td>
                  <td>{version.price}</td>
                  <td>{version.shipFee}</td>
                  <td>{version.height}</td>
                  <td>{version.length}</td>
                  <td>{version.width}</td>
                  <td>{version.status}</td>
                  <td>
                    <img src={version.image} alt={version.versionName} className="w-20 h-20 object-cover" />
                  </td>
                  <td> <button className="btn btn-sm btn-outline btn-primary border-0">
                    <PencilIcon className="h-4 w-4" />
                  </button>
                    <button className="btn btn-sm btn-outline btn-error border-0" >
                      <TrashIcon className="h-4 w-4" />
                    </button></td>
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
