import CustomerPageContent from "./CustomerPageContent";
import ModalLayout from "./ModalLayout";
import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { removeNotificationMessage } from "../features/common/headerSlice";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import RightSidebar from './RightSidebar'

function CustomerLayout() {
    const dispatch = useDispatch();
    const { newNotificationMessage, newNotificationStatus } = useSelector(state => state.header);

    useEffect(() => {
        if (newNotificationMessage !== "") {
            if (newNotificationStatus === 1) {
                NotificationManager.success(newNotificationMessage, 'Success');
            } else if (newNotificationStatus === 0) {
                NotificationManager.error(newNotificationMessage, 'Error');
            }
            dispatch(removeNotificationMessage());
        }
    }, [newNotificationMessage, newNotificationStatus, dispatch]);

    return (
        <>
            {/* Left drawer - containing page content and side bar (always open) */}
            <div className="drawer lg:drawer-open">
                <input id="left-sidebar-drawer" type="checkbox" className="drawer-toggle" />
                <CustomerPageContent />
            </div>
            
        { /* Right drawer - containing secondary content like notifications list etc.. */ }
        <RightSidebar />

            {/* Notification layout container */}
            <NotificationContainer />

            {/* Modal layout container */}
            <ModalLayout />
        </>
    );
}

export default CustomerLayout;
