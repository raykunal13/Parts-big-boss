// src/data/megaMenus.ts

export const partsMegaMenu = {
  sections: [
    {
      title: "Engine & Performance",
      items: [
        { label: "Oil Filters", href: "/parts/oil-filters" },
        { label: "Air Filters", href: "/parts/air-filters" },
        { label: "Spark Plugs", href: "/parts/spark-plugs" },
        { label: "Fuel Injectors", href: "/parts/fuel-injectors" },
        { label: "Performance Exhausts", href: "/parts/exhausts", featured: true },
      ],
    },
    {
      title: "Brakes & Suspension",
      items: [
        { label: "Brake Pads", href: "/parts/brake-pads", badge: "Hot" },
        { label: "Brake Discs", href: "/parts/brake-discs" },
        { label: "Shock Absorbers", href: "/parts/shocks" },
        { label: "Suspension Kits", href: "/parts/suspension-kits" },
        { label: "Calipers", href: "/parts/calipers" },
      ],
    },
    {
      title: "Electrical & Lighting",
      items: [
        { label: "Car Batteries", href: "/parts/batteries" },
        { label: "LED Headlights", href: "/parts/led-headlights", badge: "New" },
        { label: "Tail Lights", href: "/parts/tail-lights" },
        { label: "Wiring Harnesses", href: "/parts/wiring" },
        { label: "Sensors", href: "/parts/sensors" },
      ],
    },
  ],
};

export const categoriesMegaMenu = {
  sections: [
    {
      title: "Exterior Accessories",
      items: [
        { label: "Alloy Wheels", href: "/categories/alloy-wheels", featured: true },
        { label: "Car Covers", href: "/categories/car-covers" },
        { label: "Body Kits", href: "/categories/body-kits" },
        { label: "Wiper Blades", href: "/categories/wipers" },
      ],
    },
    {
      title: "Interior Accessories",
      items: [
        { label: "Seat Covers", href: "/categories/seat-covers" },
        { label: "Steering Covers", href: "/categories/steering-covers" },
        { label: "Floor Mats", href: "/categories/floor-mats", badge: "Top" },
        { label: "Dashboard Cameras", href: "/categories/dashcams" },
      ],
    },
    {
      title: "Tools & Maintenance",
      items: [
        { label: "Car Tool Kits", href: "/categories/tool-kits" },
        { label: "Hydraulic Jacks", href: "/categories/jacks" },
        { label: "Cleaning Kits", href: "/categories/cleaning-kits" },
        { label: "Engine Oils", href: "/categories/engine-oils" },
      ],
    },
  ],
};

export const brandsMegaMenu = {
  sections: [
    {
      title: "Top Brands",
      items: [
        { label: "Bosch", href: "/brands/bosch", featured: true },
        { label: "Brembo", href: "/brands/brembo" },
        { label: "NGK", href: "/brands/ngk" },
        { label: "Michelin", href: "/brands/michelin" },
        { label: "Castrol", href: "/brands/castrol" },
      ],
    },
    {
      title: "Performance Brands",
      items: [
        { label: "K&N", href: "/brands/k-n", badge: "Pro" },
        { label: "HKS", href: "/brands/hks" },
        { label: "Bilstein", href: "/brands/bilstein" },
        { label: "Eibach", href: "/brands/eibach" },
      ],
    },
    {
      title: "OEM & Trusted",
      items: [
        { label: "Valeo", href: "/brands/valeo" },
        { label: "Denso", href: "/brands/denso" },
        { label: "SKF", href: "/brands/skf" },
        { label: "Continental", href: "/brands/continental" },
      ],
    },
  ],
};
