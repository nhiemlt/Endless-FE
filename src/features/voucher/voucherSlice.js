import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8080/api/vouchers";

export const fetchVouchers = createAsyncThunk(
    "vouchers/fetchVouchers",
    async ({ voucherCode, leastBill, leastDiscount, page, size, sortBy, sortDir }) => {
        const response = await axios.get(API_URL, {
            params: {
                voucherCode,
                leastBill,
                leastDiscount,
                page,
                size,
                sortBy,
                sortDir,
            },
        });
        return response.data.data.content;
    }
);

export const fetchVoucherById = createAsyncThunk(
    "vouchers/fetchVoucherById",
    async (id) => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    }
);

export const updateVoucher = createAsyncThunk(
    "vouchers/updateVoucher",
    async (voucherModel) => {
        const response = await axios.put(`${API_URL}/update`, voucherModel);
        return response.data;
    }
);

export const addVoucher = createAsyncThunk(
    "vouchers/addVoucher",
    async (voucherModel) => {
        const response = await axios.post(`${API_URL}/add`, voucherModel);
        return response.data;
    }
);

export const deleteVoucher = createAsyncThunk(
    "vouchers/deleteVoucher",
    async (id) => {
        const response = await axios.delete(`${API_URL}/delete/${id}`);
        return response.data;
    }
);

const voucherSlice = createSlice({
    name: "vouchers",
    initialState: {
        vouchers: [],
        loading: false,
        error: null,
        voucher: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVouchers.pending, (state) => {
                state.loading = true;
                state.error = null; // Reset lỗi trước khi fetch
            })
            .addCase(fetchVouchers.fulfilled, (state, action) => {
                state.loading = false;
                state.vouchers = action.payload;
            })
            .addCase(fetchVouchers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchVoucherById.pending, (state) => {
                state.voucher = null; // Reset voucher khi đang fetch
            })
            .addCase(fetchVoucherById.fulfilled, (state, action) => {
                state.voucher = action.payload;
            })
            .addCase(fetchVoucherById.rejected, (state, action) => {
                state.error = action.error.message; // Xử lý lỗi
            })
            .addCase(updateVoucher.fulfilled, (state, action) => {
                const updatedVoucher = action.payload;
                const index = state.vouchers.findIndex(voucher => voucher.voucherID === updatedVoucher.voucherID);
                if (index !== -1) {
                    state.vouchers[index] = updatedVoucher;
                }
            });
    },
});

export const getVouchersContent = fetchVouchers; 
export default voucherSlice.reducer;
