export interface HeroSlideData {
  id: number;
  image: string;
  alt: string;
  href: string;
  title?: string;
  description?: string;
}

export const heroSlides: HeroSlideData[] = [
  {
    id: 1,
    image: "/top-view-hard-disk-with-white-light.jpg",
    alt: "Automobile brake system components",
    href: "/category/brakes",
    title: "Brake System Parts",
    description: "Reliable braking components for every vehicle",
  },
  {
    id: 2,
    image: "/close-up-car-engine.jpg",
    alt: "Automotive engine components",
    href: "/category/engine-parts",
    title: "Engine Components",
    description: "High-performance engine parts and accessories",
  },
  {
    id: 3,
    image: "/detail-shot-wheel.jpg",
    alt: "Vehicle suspension system",
    href: "/category/suspension",
    title: "Suspension Systems",
    description: "Smooth rides with premium suspension solutions",
  },
];
