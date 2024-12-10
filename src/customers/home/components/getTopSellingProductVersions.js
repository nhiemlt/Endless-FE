import React, { useEffect, useState } from "react";
import productVersionService from '../../../services/productVersionService';

function TopSellingProducts() {
    const [products, setProducts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchTopSellingProducts = async () => {
            try {
                const data = await productVersionService.getTopSellingProductVersions();
                setProducts(data.content); // Assuming response is an array
            } catch (error) {
                console.error("Error fetching top-selling products:", error);
            }
        };

        fetchTopSellingProducts();
    }, []);

    return (
        <div>
            <div className="bg-white dark:bg-base-100 flex relative items-center overflow-hidden">
                <div className="container mx-auto px-2 flex relative py-16">
                    {products.length > 0 && (
                        <div className="product-card">
                            <img
                                src={products[0].image}
                                alt={products[0].name}
                                className="rounded-[7px] shadow-lg shadow-black/40" // Rounding corners and shadow effect
                            />
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}

export default TopSellingProducts;
