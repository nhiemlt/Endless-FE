import React, { useEffect, useState } from 'react';
import TitleCard from '../../components/Cards/TitleCard';
import AddPromotionModalBody from './modal/Promotion';
import AddPromotionDetailModalBody from './modal/PromotionDetail';
import AddPromotionProductModalBody from './modal/PromotionProduct';


import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import PromotionService from '../../services/PromotionService';
import PromotionDetailService from '../../services/PromotionDetailService';
import PromotionProductService from '../../services/PromotionProductService';


const TopSideButtons = ({ onAddClick }) => (
  <div className="inline-block float-right">
    <button className="btn px-6 btn-sm normal-case btn-primary" onClick={onAddClick}>
      Add new
    </button>
  </div>
);

function PromotionList() {
  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [activeTab, setActiveTab] = useState('promotions'); // Manage the selected tab
  const [promotions, setPromotions] = useState([]); // State for promotions
  const [promotionDetails, setPromotionDetails] = useState([]);
  const [promotionProducts, setPromotionProducts] = useState([]);



  // Handlers for modals
  const openPromotionModal = (promotion = null) => {
    setSelectedPromotion(promotion);
    setIsPromotionModalOpen(true);
  };

  const openDetailModal = (detail = null) => {
    setSelectedDetail(detail);
    setIsDetailModalOpen(true);
  };

  const openProductModal = (product = null) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const closeModal = () => {
    setIsPromotionModalOpen(false);
    setIsDetailModalOpen(false);
    setIsProductModalOpen(false);
  };

  // Fetch promotions from the API when the component mounts
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const data = await PromotionService.getPromotions();
        setPromotions(data);
      } catch (error) {
        console.error('Error fetching promotions:', error);
      }
    };

    fetchPromotions();
  }, []); // Empty dependency array to run only once on mount
  // Fetch promotion details when the tab is selected
  useEffect(() => {
    const fetchPromotionDetails = async () => {
      try {
        const data = await PromotionDetailService.getPromotionDetails();
        setPromotionDetails(data);
      } catch (error) {
        console.error('Error fetching promotion details:', error);
      }

    };


    fetchPromotionDetails();
  }, [activeTab]); // Re-fetch when activeTab changes

  // Fetch promotion products when the tab is selected
  useEffect(() => {
    const fetchPromotionProducts = async () => {
      if (activeTab === 'products') {
        try {
          const data = await PromotionProductService.getPromotionProducts();
          setPromotionProducts(data);
        } catch (error) {
          console.error('Error fetching promotion products:', error);
        }
      }
    };

    fetchPromotionProducts();
  }, [activeTab]); // Re-fetch when activeTab changes



  return (
    <>
      {/* Tabs */}
      <div role="tablist" className="tabs tabs-bordered mb-6">
        <button
          className={`tab ${activeTab === 'promotions' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('promotions')}
        >
          Promotions
        </button>
        <button
          className={`tab ${activeTab === 'details' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Promotion Details
        </button>
        <button
          className={`tab ${activeTab === 'products' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Promotion Products
        </button>
      </div>

      {/* Promotions Table */}
      {activeTab === 'promotions' && (
        <TitleCard
          title="Promotion List"
          topMargin="mt-2"
          TopSideButtons={<TopSideButtons onAddClick={() => openPromotionModal()} />}
        >
          <div className="overflow-x-auto w-full">
            <table className="table table-xs">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Promotion Name</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Poster</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {promotions.map((promotion, index) => (
                  <tr key={promotion.id}>
                    <td>{index + 1}</td>
                    <td>{promotion.name}</td>
                    <td>{promotion.startDate}</td>
                    <td>{promotion.endDate}</td>
                    <td>{promotion.poster}</td>
                    <td>
                      <button className="btn btn-sm btn-outline btn-primary border-0" onClick={() => openPromotionModal(promotion)}>
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="btn btn-sm btn-outline btn-error border-0" >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TitleCard>
      )}

      {/* Promotion Details Table */}
      {activeTab === 'details' && (
        <TitleCard
          title="Promotion Details"
          topMargin="mt-4"
          TopSideButtons={<TopSideButtons onAddClick={() => openDetailModal()} />}
        >
          <div className="overflow-x-auto w-full">
            <table className="table table-xs">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Promotion ID</th>
                  <th>Discount Percentage</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {promotionDetails.map((detail, index) => (
                  <tr key={detail.id}>
                    <td>{index + 1}</td>
                    <td>{detail.promotionID}</td>
                    <td>{detail.percentDiscount}%</td>
                    <td>
                      <button className="btn btn-sm btn-outline btn-primary border-0" onClick={() => openDetailModal(detail)}>
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="btn btn-sm btn-outline btn-error border-0" >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TitleCard>
      )}

      {/* Promotion Products Table */}
      {activeTab === 'products' && (
        <TitleCard
          title="Promotion Products"
          topMargin="mt-4"
          TopSideButtons={<TopSideButtons onAddClick={() => openProductModal()} />}
        >
          <div className="overflow-x-auto w-full">
            <table className="table table-xs">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Promotion Detail ID</th>
                  <th>Product Version ID</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {promotionProducts.map((product, index) => (
                  <tr key={product.id}>
                    <td>{index + 1}</td>
                    <td>{product.promotionDetailID}</td>
                    <td>{product.productVersionID}</td>
                    <td>
                      <button className="btn btn-sm btn-outline btn-primary border-0" onClick={() => openProductModal(product)}>
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="btn btn btn-sm btn-outline btn-error border-0" >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TitleCard>
      )}

      {/* Modals */}
      <AddPromotionModalBody isOpen={isPromotionModalOpen} onClose={closeModal} promotion={selectedPromotion} />
      <AddPromotionDetailModalBody isOpen={isDetailModalOpen} onClose={closeModal} detail={selectedDetail} />
      <AddPromotionProductModalBody isOpen={isProductModalOpen} onClose={closeModal} product={selectedProduct} />
    </>
  );
}

export default PromotionList;
