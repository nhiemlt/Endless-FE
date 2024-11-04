import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import NotificationService from '../../services/NotificationService';

// Thunk để lấy số lượng thông báo chưa đọc
export const fetchUnreadCount = createAsyncThunk(
    'header/fetchUnreadCount',
    async () => {
        const count = await NotificationService.getUnreadCount();
        return count;
    }
);

// Thunk để đánh dấu thông báo là đã đọc
export const markNotificationAsRead = createAsyncThunk(
    'header/markNotificationAsRead',
    async (notificationRecipientId) => {
        const count = await NotificationService.markAsRead(notificationRecipientId);
        return count; // Trả về số lượng thông báo chưa đọc sau khi đánh dấu
    }
);

export const headerSlice = createSlice({
    name: 'header',
    initialState: {
        pageTitle: "Trang chủ",
        noOfNotifications: 0,
        newNotificationMessage: "",
        newNotificationStatus: 1,
    },
    reducers: {
        setPageTitle: (state, action) => {
            state.pageTitle = action.payload.title;
        },
        removeNotificationMessage: (state) => {
            state.newNotificationMessage = "";
        },
        showNotification: (state, action) => {
            state.newNotificationMessage = action.payload.message;
            state.newNotificationStatus = action.payload.status;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUnreadCount.fulfilled, (state, action) => {
                state.noOfNotifications = action.payload;
            })
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                state.noOfNotifications = action.payload; // Cập nhật số lượng thông báo chưa đọc
            });
    },
});

export const { setPageTitle, removeNotificationMessage, showNotification } = headerSlice.actions;

export default headerSlice.reducer;
