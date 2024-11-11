import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { showNotification } from '../../common/headerSlice';
import PromotionService from '../../../services/PromotionService';
import UploadFileService from '../../../services/UploadFileService';
import MinusIcon from '@heroicons/react/24/outline/MinusIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';

const AddPromotionProductModal = ({ isOpen, onClose, onPromotionAdded }) => {


    return isOpen ? (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
            <dialog id="add_promotion_modal" className="modal" role="dialog" open>
                <div className="modal-box">


                    <div className="modal-action">
                        <button onClick={onClose} className="btn btn-outline">Hủy</button>
                        <button className="btn btn-primary">Cập Nhật</button>
                    </div>
                </div>
            </dialog>
        </>
    ) : null;
};

export default AddPromotionProductModal;
