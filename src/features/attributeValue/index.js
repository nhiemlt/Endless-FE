import { useState, useEffect } from 'react';
import SearchBar from '../../components/Input/SearchBar';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import FunnelIcon from '@heroicons/react/24/outline/FunnelIcon';
import TitleCard from '../../components/Cards/TitleCard';

const TopSideButtons = ({ removeFilter, applyFilter, applySearch }) => {
  const [filterParam, setFilterParam] = useState("");
  const [searchText, setSearchText] = useState("");
  const locationFilters = ["Color", "Size", "Material"];

  const showFiltersAndApply = (params) => {
    applyFilter(params);
    setFilterParam(params);
  }

  const removeAppliedFilter = () => {
    removeFilter();
    setFilterParam("");
    setSearchText("");
  }

  useEffect(() => {
    if (searchText === "") {
      removeAppliedFilter();
    } else {
      applySearch(searchText);
    }
  }, [searchText]);

  return (
    <div className="inline-block float-right">
      <SearchBar searchText={searchText} styleClass="mr-4" setSearchText={setSearchText} />
      {filterParam !== "" && (
        <button onClick={removeAppliedFilter} className="btn btn-xs mr-2 btn-active btn-ghost normal-case">
          {filterParam}<XMarkIcon className="w-4 ml-2" />
        </button>
      )}
      <div className="dropdown dropdown-bottom dropdown-end">
        <label tabIndex={0} className="btn btn-sm btn-outline"><FunnelIcon className="w-5 mr-2" />Filter</label>
        <ul tabIndex={0} className="dropdown-content menu p-2 text-sm shadow bg-base-100 rounded-box w-52">
          {locationFilters.map((l, k) => (
            <li key={k}><a onClick={() => showFiltersAndApply(l)}>{l}</a></li>
          ))}
          <div className="divider mt-0 mb-0"></div>
          <li><a onClick={removeAppliedFilter}>Remove Filter</a></li>
        </ul>
      </div>
    </div>
  );
}

function AttributeTable() {
  const [attributes, setAttributes] = useState([]); // State cho danh sách attributes

  // Giả lập dữ liệu cho attributes
  useEffect(() => {
    // Thay thế bằng API gọi đến backend
    const fetchAttributes = async () => {
      // Thực hiện gọi API để lấy danh sách attributes
      const response = await fetch('/api/attributes'); // Cập nhật với URL API chính xác
      const data = await response.json();
      setAttributes(data);
    };

    fetchAttributes();
  }, []);

  const removeFilter = () => {
    // Gọi lại dữ liệu gốc nếu có API
    const fetchAttributes = async () => {
      const response = await fetch('/api/attributes'); // Cập nhật với URL API chính xác
      const data = await response.json();
      setAttributes(data);
    };

    fetchAttributes();
  };

  const applyFilter = (params) => {
    // Thực hiện bộ lọc nếu cần
  };

  const applySearch = (value) => {
    // Thực hiện tìm kiếm theo tên thuộc tính
    const filteredAttributes = attributes.filter(attr =>
      attr.attributeName.toLowerCase().includes(value.toLowerCase())
    );
    setAttributes(filteredAttributes);
  };

  return (
    <>
      <TitleCard title="Manage Attributes" topMargin="mt-2" TopSideButtons={<TopSideButtons applySearch={applySearch} applyFilter={applyFilter} removeFilter={removeFilter} />}>
        <div className="flex justify-center">
          <div className="overflow-x-auto w-full max-w-6xl">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Attribute Name</th>
                  <th>Attribute Values</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {attributes.map(attr => (
                  <tr key={attr.id}>
                    <td>{attr.attributeName}</td>
                    <td>
                      <ul>
                        {attr.values.map((value, index) => (
                          <li key={index}>{value}</li>
                        ))}
                      </ul>
                    </td>
                    <td>
                      <button className="btn btn-xs btn-outline">Edit</button>
                      <button className="btn btn-xs btn-outline btn-error">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </TitleCard>
    </>
  );
}

export default AttributeTable;
