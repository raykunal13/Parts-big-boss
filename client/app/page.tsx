import { getVehicleMakes } from "./lib/vehicleFetch";
import Navbar from "./components/Sections/Navbar";
import HeroSlider from "./components/Hero-Slider/HeroSlider";
import VehicleSelector from "./components/Sections/VehicleSelector";
import FeaturedProductsSection from "./components/Sections/FeaturedProductsSection";
import CustomerReviewSection from "./components/Sections/CustomerReviewSection";
import CategoryGrid from "./components/Sections/CategoryGrid";
import BrandMarquee from "./components/Sections/BrandMarquee";
import Footer from "./components/Sections/Footer";
import AuthInitializer from "./components/Sections/AuthIntialiser";

// 1. Mark component as async to enable Server-Side Rendering
export default async function Home() {
  // 2. Fetch data on the server (Instant load, SEO friendly)
  const initialMakes = await getVehicleMakes();

  return (
    <>
      {/* 3. Client-side logic runs here */}
      <AuthInitializer /> 
      
      <Navbar />

      <main className="w-full pb-20 bg-[var(--surface-hover)] min-h-screen">
        <HeroSlider />

        <div className="z-10 px-4">
           {/* 4. Pass server-fetched data to the client component */}
           <VehicleSelector initialMakes={initialMakes} variant="hero" />
        </div>

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
      </main>

      <Footer/>
    </>
  );
}