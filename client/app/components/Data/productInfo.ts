import axios from "axios";
import { Product } from "../../types/product";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const fetchProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/products`);
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};
export const FEATURED_PRODUCTS: Product[] = [
  {
    id: 1,
    title: "High Performance Brake Pad Set - ceramic compound",
    price: 4599, // ₹4,599
    part_number: "BP-2024-X",
    image_url: "/top-view-hard-disk-with-white-light.jpg", 
    category: "Brakes",
    slug: "high-perf-brake-pads",
    rating: 4.5,
    rating_count: 128,
  },
  {
    id: 2,
    title: "Synthetic Motor Oil 5W-30 - 4L Pack",
    price: 3250,
    part_number: "OIL-5W30-4L",
    image_url: "/close-up-car-engine.jpg",
    category: "Engine Oil",
    slug: "synthetic-oil-5w30",
    rating: 4.2,
    rating_count: 85,
  },
  {
    id: 3,
    title: "Performance Air Filter - High Flow",
    price: 1899,
    part_number: "AF-SP-01",
    image_url: "/detail-shot-wheel.jpg",
    category: "Filters",
    slug: "perf-air-filter",
    rating: 4.8,
    rating_count: 210,
  },
  {
    id: 4,
    title: "Spark Plug Platinum Series (Set of 4)",
    price: 1200,
    part_number: "SP-PLT-4",
    image_url: "https://placehold.co/400x300/e2e8f0/1e293b?text=Spark+Plugs",
    category: "Ignition",
    slug: "spark-plug-platinum",
    rating: 3.5,
    rating_count: 42,
  },
  {
    id: 5,
    title: "LED Headlight Bulbs conversion kit H4",
    price: 2499,
    part_number: "LED-H4-6000K",
    image_url: "https://placehold.co/400x300/e2e8f0/1e293b?text=LED+Lights",
    category: "Lighting",
    slug: "led-headlight-h4",
    rating: 4.6,
    rating_count: 156,
  },
  {
    id: 6,
    title: "Oil Filter - Heavy Duty",
    price: 450,
    part_number: "OF-HD-99",
    image_url: "https://placehold.co/400x300/e2e8f0/1e293b?text=Oil+Filter",
    category: "Filters",
    slug: "oil-filter-hd",
    rating: 4.9,
    rating_count: 310,
  },
  {
    id: 7,
    title: "Wiper Blades - Hybrid Technology (Pair)",
    price: 899,
    part_number: "WB-HYB-2218",
    image_url: "https://placehold.co/400x300/e2e8f0/1e293b?text=Wipers",
    category: "Wipers",
    slug: "wiper-blades-pair",
    rating: 4.3,
    rating_count: 89,
  },
  {
    id: 8,
    title: "Car Battery 12V 45Ah - Maintenance Free",
    price: 5500,
    part_number: "BAT-12V-45AH",
    image_url: "https://placehold.co/400x300/e2e8f0/1e293b?text=Battery",
    category: "Electrical",
    slug: "car-battery-45ah",
    rating: 4.7,
    rating_count: 204,
  },
  {
    id: 9,
    title: "Cabin Air Filter - Activated Carbon",
    price: 699,
    part_number: "CAF-AC-05",
    image_url: "https://placehold.co/400x300/e2e8f0/1e293b?text=Cabin+Filter",
    category: "Filters",
    slug: "cabin-air-filter",
    rating: 4.4,
    rating_count: 112,
  },
  {
    id: 10,
    title: "Transmission Fluid ATF - 1L",
    price: 850,
    part_number: "TF-ATF-1L",
    image_url: "https://placehold.co/400x300/e2e8f0/1e293b?text=Trans+Fluid",
    category: "Fluids",
    slug: "trans-fluid-atf",
    rating: 4.8,
    rating_count: 67,
  }
];