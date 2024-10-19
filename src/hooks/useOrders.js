// hooks/useOrders.js
import { useEffect, useState } from "react";
import OrderService from "../services/OrderService";

const useOrders = (currentPage, ordersPerPage, searchText, orderStatus) => {
    const [orders, setOrders] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await OrderService.getAllOrders(
                    orderStatus === 'Tất cả' ? null : orderStatus,
                    searchText,
                    null, // startDate
                    null, // endDate
                    currentPage - 1,
                    ordersPerPage
                );
                setOrders(response.data.content);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };
        fetchOrders();
    }, [currentPage, searchText, orderStatus]);

    return { orders, totalPages };
};

export default useOrders;
