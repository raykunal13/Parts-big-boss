"use client";

import Navbar from "./Sections/Navbar";
import HeroSlider from "./Hero-Slider/HeroSlider";
import VehicleSelector from "./Sections/VehicleSelector";
import FeaturedProductsSection from "./Sections/FeaturedProductsSection";
import CustomerReviewSection from "./Sections/CustomerReviewSection";
import CategoryGrid from "./Sections/CategoryGrid";
import BrandMarquee from "./Sections/BrandMarquee";
import Footer from "./Sections/Footer";
export default function Home() {
  return (
    <>
      <Navbar />

      <main className="w-full pb-20 bg-[var(--surface-hover)] min-h-screen">
        <HeroSlider />

        <div className="z-10 px-4">
           <VehicleSelector />
        </div>

        {/* Featured Products Section Demo */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12"> 
       <FeaturedProductsSection />
        </section>
        <section>
            <CustomerReviewSection />
        </section>
        <section>
            <CategoryGrid />
        </section>
        <section>
            <BrandMarquee />
        </section>
        {/* Future sections go here */}
        {/* <FeaturedCategories /> */}
        {/* <BestSellers /> */}
        {/* <DealsStrip /> */}
      </main>
        <Footer/>
    </>
  );
}
