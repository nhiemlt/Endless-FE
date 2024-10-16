import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'


export const getVouchersContent = createAsyncThunk('/vouchers/content', async () => {
	const response = await axios.get('/api/users?page=2', {})
	return response.data;
})

export const vouchersSlice = createSlice({
    name: 'vouchers',
    initialState: {
        isLoading: false,
        vouchers : []
    },
    reducers: {


        addNewVoucher: (state, action) => {
            let {newVoucherObj} = action.payload
            state.vouchers = [...state.vouchers, newVoucherObj]
        },

        deleteVoucher: (state, action) => {
            let {index} = action.payload
            state.vouchers.splice(index, 1)
        }
    },

    extraReducers: {
		[getVouchersContent.pending]: state => {
			state.isLoading = true
		},
		[getVouchersContent.fulfilled]: (state, action) => {
			state.vouchers = action.payload.data
			state.isLoading = false
		},
		[getVouchersContent.rejected]: state => {
			state.isLoading = false
		},
    }
})

export const { addNewVoucher, deleteVoucher } = vouchersSlice.actions

export default vouchersSlice.reducer