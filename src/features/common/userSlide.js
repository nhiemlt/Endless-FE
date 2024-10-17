import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userInfo: null, // Trạng thái ban đầu của người dùng
    },
    reducers: {
        setUser: (state, action) => {
            state.userInfo = action.payload; // Lưu thông tin người dùng vào state
        },
        clearUser: (state) => {
            state.userInfo = null; // Xóa thông tin người dùng
        }
    }
});

// Xuất các action và reducer
export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;