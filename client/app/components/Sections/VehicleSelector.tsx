"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { vehicleCategoryInfo } from "../Data/vehicleCategoryInfo";
import { Make, Model } from "../../types/vehicle";

// Simple Chevron Icon component to keep the main code clean
const ChevronIcon = () => (
  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6"/>
    </svg>
  </div>
);

export default function VehicleSelector() {
  const router = useRouter();

  // State Management
  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [years, setYears] = useState<number[]>([]);

  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const [isLoadingModels, setIsLoadingModels] = useState(false);

  // 1. Fetch Makes on Mount
  useEffect(() => {
    const loadMakes = async () => {
      const data = await vehicleCategoryInfo.getMakes();
      setMakes(data);
    };
    loadMakes();
  }, []);

  // 2. Fetch Models when Make changes
  useEffect(() => {
    if (!selectedMake) {
      setModels([]);
      setSelectedModel("");
      setSelectedYear("");
      return;
    }

    const loadModels = async () => {
      setIsLoadingModels(true);
      try {
        const data = await vehicleCategoryInfo.getModels(Number(selectedMake));
        setModels(data);
      } finally {
        setIsLoadingModels(false);
      }
    };
    
    loadModels();
    // Reset downstream selections
    setSelectedModel("");
    setSelectedYear("");
  }, [selectedMake]);

  // 3. Fetch Years when Model changes
  useEffect(() => {
    if (!selectedModel) {
      setYears([]);
      setSelectedYear("");
      return;
    }

    const loadYears = async () => {
      const data = await vehicleCategoryInfo.getYears(Number(selectedModel));
      setYears(data);
    };

    loadYears();
    // Reset downstream selection
    setSelectedYear("");
  }, [selectedModel]);

  // Search Handler
  const handleSearch = () => {
    if (!selectedMake) return;

    const queryParams = new URLSearchParams();
    if (selectedMake) queryParams.append("make", selectedMake);
    if (selectedModel) queryParams.append("model", selectedModel);
    if (selectedYear) queryParams.append("year", selectedYear);

    router.push(`/search?${queryParams.toString()}`);
  };

  // Derived state for the button
  const isSearchEnabled = Boolean(selectedMake);

  return (
    <div className="bg-white border-t-2 border-b-2 p-6 w-[100%] max-w-6xl mx-auto my-4">
      <div className="mb-6 flex items-center space-x-2">
        <h2 className="text-center w-full text-xl font-bold text-gray-900">Find part by vehicle</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Make */}
        <div className="relative">
          <select
            value={selectedMake}
            onChange={(e) => setSelectedMake(e.target.value)}
            className="w-full appearance-none bg-[var(--surface)] text-gray-900 border border-gray-200 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
          >
            <option value="">Select Make</option>
            {makes.map((make) => (
              <option key={make.id} value={make.id}>
                {make.name}
              </option>
            ))}
          </select>
          <ChevronIcon />
        </div>

        {/* Model */}
        <div className="relative">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={!selectedMake || isLoadingModels}
            className="w-full appearance-none bg-[var(--surface)] text-gray-900 border border-gray-200 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">
              {isLoadingModels ? "Loading..." : "Select Model"}
            </option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
          <ChevronIcon />
        </div>

        {/* Year */}
        <div className="relative">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            disabled={!selectedModel || years.length === 0}
            className="w-full appearance-none bg-[var(--surface)] text-gray-900 border border-gray-200 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <ChevronIcon />
        </div>

        {/* Button */}
        <button
          onClick={handleSearch}
          disabled={!isSearchEnabled}
          className={`
            w-full py-3 rounded-lg font-bold text-white shadow-md transition-all duration-200 flex items-center justify-center
            ${
              isSearchEnabled
                ? "bg-[var(--accent)] hover:bg-[var(--accent-hover)] hover:-translate-y-0.5"
                : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
            }
          `}
        >
          Find Parts
        </button>
      </div>
    </div>
  );
}