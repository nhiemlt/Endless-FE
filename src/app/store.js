import { configureStore } from '@reduxjs/toolkit';
import headerSlice from '../features/common/headerSlice';
import modalSlice from '../features/common/modalSlice';
import rightDrawerSlice from '../features/common/rightDrawerSlice';
import leadsSlice from '../features/leads/leadSlice';
import vouchersSlice from '../features/voucher/voucherSlice';
import userSlice from '../features/common/userSlide'; 

const combinedReducer = {
    header: headerSlice,
    rightDrawer: rightDrawerSlice,
    modal: modalSlice,
    lead: leadsSlice,
    voucher: vouchersSlice,
    user: userSlice, 
};

export default configureStore({
    reducer: combinedReducer,
});
