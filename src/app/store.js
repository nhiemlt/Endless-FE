import { configureStore } from '@reduxjs/toolkit';
import headerSlice from '../features/common/headerSlice';
import modalSlice from '../features/common/modalSlice';
import rightDrawerSlice from '../features/common/rightDrawerSlice';
import leadsSlice from '../features/leads/leadSlice';
import voucherSlice from '../services/voucherSlice';
import userSlice from '../features/common/userSlide';

const combinedReducer = {
    header: headerSlice,
    rightDrawer: rightDrawerSlice,
    modal: modalSlice,
    lead: leadsSlice,
    voucher: voucherSlice,
    user: userSlice,
};

export default configureStore({
    reducer: combinedReducer,
});
