import React, { useState, useEffect } from "react";
import ratingService from "../../../services/ratingService";

function RatingAll() {

    const [totalRatings, setTotalRatings] = useState(0);
    const [weightedAverageRating, setWeightedAverageRating] = useState(0);
    const [loading, setLoading] = useState(true);

    // Hàm để lấy tổng số đánh giá
    const fetchTotalRatingsCount = async () => {
        try {
            const response = await ratingService.getTotalRatingsCount();
            setTotalRatings(response); // Cập nhật tổng số đánh giá vào state
            setLoading(false); // Đã xong việc tải dữ liệu, set loading = false
        } catch (error) {
            console.error("Error fetching total ratings count:", error);
            setLoading(false); // Xử lý lỗi và dừng loading
        }
    };

    // Dùng useEffect để gọi API khi component load
    useEffect(() => {
        fetchTotalRatingsCount();
    }, []); // [] giúp gọi chỉ 1 lần khi component render lần đầu tiên

    // Hàm để lấy trung bình trọng số đánh giá
    const fetchWeightedAverageRating = async () => {
        try {
            const response = await ratingService.getWeightedAverageRating();
            setWeightedAverageRating(response); // Cập nhật trung bình trọng số vào state
            setLoading(false); // Đã xong việc tải dữ liệu, set loading = false
        } catch (error) {
            console.error("Error fetching weighted average rating:", error);
            setLoading(false); // Xử lý lỗi và dừng loading
        }
    };

    useEffect(() => {
        fetchWeightedAverageRating();
    }, []); // [] giúp gọi chỉ 1 lần khi component render lần đầu tiên


    return (

        <div>
            <div className="p-8 dark:bg-base-200 bg-amber-50 rounded-3xl flex flex-col items-center justify-end">
                {/* Rating Number */}
                <h2 className="font-manrope font-bold text-5xl text-amber-400 mb-6">
                    {loading ? "Loading..." : weightedAverageRating.toFixed(1)}
                </h2>
                {/* Star Icons */}
                <div className="flex items-end justify-end gap-2 sm:gap-6 mb-4">
                    {[...Array(5)].map((_, index) => (
                        <svg
                            key={index}
                            xmlns="http://www.w3.org/2000/svg"
                            width="44"
                            height="44"
                            viewBox="0 0 44 44"
                            fill="none"
                            className="text-amber-400"
                        >
                            <g clipPath="url(#clip0_13624_2608)">
                                <path
                                    d="M21.1033 2.9166C21.4701 2.17335 22.5299 2.17335 22.8967 2.9166L28.233 13.729C28.3786 14.0241 28.6602 14.2287 28.9859 14.276L40.9181 16.0099C41.7383 16.1291 42.0658 17.137 41.4723 17.7156L32.8381 26.1318C32.6024 26.3616 32.4949 26.6926 32.5505 27.017L34.5888 38.9009C34.7289 39.7178 33.8714 40.3408 33.1378 39.9551L22.4653 34.3443C22.174 34.1911 21.826 34.1911 21.5347 34.3443L10.8622 39.9551C10.1286 40.3408 9.27114 39.7178 9.41125 38.9009L11.4495 27.017C11.5051 26.6926 11.3976 26.3616 11.1619 26.1318L2.52771 17.7156C1.93419 17.137 2.2617 16.1291 3.08192 16.0099L15.0141 14.276C15.3398 14.2287 15.6214 14.0241 15.767 13.729L21.1033 2.9166Z"
                                    fill="#FBBF24"
                                />
                            </g>
                            <defs>
                                <clipPath id="clip0_13624_2608">
                                    <rect width="44" height="44" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    ))}
                </div>

                {/* Ratings Text */}
                <p className="font-medium text-xl leading-8 dark:text-white text-gray-900 text-center">
                    {loading ? "Loading..." : `${totalRatings} Đánh giá`} {/* Hiển thị thông tin tổng số đánh giá */}
                </p>
            </div>

        </div>
    );
}
export default RatingAll;