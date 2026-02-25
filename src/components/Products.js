'use client';

import ProductCard from "./ProductCard";
import React, { useEffect, useState } from "react";
import useEqualHeight from "../hooks/useEqualHeight";

const mockProducts = {
  status: "success",
  message: "Card designs fetched successfully",
  data: [
    {
      _id: "691486c1181eacb6ee4558ed",
      name: "digital + plastic card",
      type: "NFC",
      description: "Always ready, never runs out: Be ready to follow up every time.",
      price: 749,
      image: "product4.svg",
      isActive: true,
      createdAt: "2025-11-12T13:08:17.492Z",
      updatedAt: "2025-12-06T13:42:54.819Z",
      __v: 0
    },
    {
      _id: "69148698181eacb6ee4558ea",
      name: "digital + metal card",
      type: "NFC",
      description: "Share sustainably, stay remembered.",
      price: 1599,
      image: "product3.svg",
      isActive: true,
      createdAt: "2025-11-12T13:07:36.795Z",
      updatedAt: "2025-12-06T13:43:19.234Z",
      __v: 0
    },
    {
      _id: "691485b8181eacb6ee4558e1",
      name: "digital + plastic NFC card",
      type: "NFC",
      description: "Make an unforgettable impression.",
      price: 9000,
      image: "product2.svg",
      isActive: true,
      createdAt: "2025-11-12T13:03:52.489Z",
      updatedAt: "2025-12-06T13:43:59.245Z",
      __v: 0
    },
    {
      _id: "69148577181eacb6ee4558de",
      name: "Only digital card",
      type: "Template",
      description: "Stand out instantly, close confidently.",
      price: 399,
      image: "product1.svg",
      isActive: true,
      createdAt: "2025-11-12T13:02:47.577Z",
      updatedAt: "2025-12-06T13:42:29.113Z",
      __v: 0
    }
  ]
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        // Simulate API call with mock data
        setProducts(mockProducts.data);
        setError("");
      } catch (err) {
        setError("Failed to load plans");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // equalize heights of product cards whenever products or loading changes
  useEqualHeight(".equal-height-card", [products, loading]);

  return (
    <div id="process" className="w-full flex items-center flex-col justify-center py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-inter leading-tight lg:leading-10 text-center max-w-4xl">A mini-website in your pocket</h2>
      <p className="text-sm sm:text-base font-normal leading-5 font-inter mt-2 text-lightGrey text-center max-w-2xl">The smarter, modern alternative to traditional business cards.</p>
      <div className="w-full max-w-6xl flex items-start justify-center gap-4 sm:gap-6 lg:gap-8 flex-wrap mt-6 sm:mt-8">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}