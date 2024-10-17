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

export const getVouchersContent = fetchVouchers; // Xuất như tên mới

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
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVouchers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchVouchers.fulfilled, (state, action) => {
                state.loading = false;
                state.vouchers = action.payload;
            })
            .addCase(fetchVouchers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addVoucher.fulfilled, (state, action) => {
                state.vouchers.push(action.payload);
            })
            .addCase(deleteVoucher.fulfilled, (state, action) => {
                state.vouchers = state.vouchers.filter(voucher => voucher.id !== action.meta.arg);
            });
    },
});

export default voucherSlice.reducer;
