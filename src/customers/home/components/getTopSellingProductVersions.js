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
            {/* Section 1: Product Image */}
            {products.length > 0 && (
                <div className="bg-white dark:bg-base-100 overflow-hidden">
                    <div className="container">
                        <div className="product-card">
                            <img
                                src={products[0].image}
                                alt={products[0].name}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TopSellingProducts;
