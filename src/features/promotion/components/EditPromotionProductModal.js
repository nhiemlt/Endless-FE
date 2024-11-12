import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../common/headerSlice';
import PromotionService from '../../../services/PromotionService';
import UploadFileService from '../../../services/UploadFileService';
import MinusIcon from '@heroicons/react/24/outline/MinusIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';

const EditPromotionProductModal = ({ isOpen, onClose, editPromotion, onPromotionUpdate }) => {




    return (
        <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
            <div className="modal-box">


                <div className="modal-action">
                    <button onClick={onClose} className="btn btn-outline">Hủy</button>
                    <button className="btn btn-primary">Cập Nhật</button>
                </div>
            </div>
        </div>
    );
};

export default EditPromotionProductModal;
