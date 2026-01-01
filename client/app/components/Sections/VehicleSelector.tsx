"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { vehicleCategoryInfo } from "../../Data/vehicleCategoryInfo"; // Note: I fixed your path import
import { Make, Model } from "../../types/vehicle";
import { Loader2 } from "lucide-react";

// Define the selection object
export interface VehicleSelection {
  makeId: string;
  modelId: string;
  year: string;
  makeName?: string;
  modelName?: string;
}

interface VehicleSelectorProps {
  initialMakes?: Make[]; // Passed from Server
  onConfirm?: (selection: VehicleSelection) => void; // Optional: Overrides navigation
  variant?: "hero" | "modal"; // For styling differences
}

export default function VehicleSelector({ 
  initialMakes = [], 
  onConfirm,
  variant = "hero" 
}: VehicleSelectorProps) {
  const router = useRouter();

  // State
  const [makes, setMakes] = useState<Make[]>(initialMakes);
  const [models, setModels] = useState<Model[]>([]);
  const [years, setYears] = useState<number[]>([]);

  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [isLoadingYears, setIsLoadingYears] = useState(false);

  // 1. Fallback: If no initialMakes provided (e.g., used deep in client tree), fetch them
  useEffect(() => {
    if (initialMakes.length === 0) {
      const loadMakes = async () => {
        const data = await vehicleCategoryInfo.getMakes();
        setMakes(data);
      };
      loadMakes();
    }
  }, [initialMakes]);

  // 2. Fetch Models
  useEffect(() => {
    if (!selectedMake) {
      setModels([]);
      setSelectedModel("");
      return;
    }
    const loadModels = async () => {
      setIsLoadingModels(true);
      const data = await vehicleCategoryInfo.getModels(Number(selectedMake));
      setModels(data);
      setIsLoadingModels(false);
    };
    loadModels();
    setSelectedModel(""); 
    setSelectedYear("");
  }, [selectedMake]);

  // 3. Fetch Years
  useEffect(() => {
    if (!selectedModel) {
      setYears([]);
      return;
    }
    const loadYears = async () => {
      setIsLoadingYears(true);
      const data = await vehicleCategoryInfo.getYears(Number(selectedModel));
      setYears(data);
      setIsLoadingYears(false);
    };
    loadYears();
    setSelectedYear("");
  }, [selectedModel]);

  // Logic: Search or Callback
  const handleSubmit = () => {
    if (!selectedMake || !selectedModel || !selectedYear) return;

    // Build the selection object
    const selection: VehicleSelection = {
      makeId: selectedMake,
      modelId: selectedModel,
      year: selectedYear,
      // Find names for convenience (optional)
      makeName: makes.find(m => m.id.toString() === selectedMake)?.name,
      modelName: models.find(m => m.id.toString() === selectedModel)?.name,
    };

    if (onConfirm) {
      // Mode 1: Add to Garage (Profile)
      onConfirm(selection);
    } else {
      // Mode 2: Search (Landing Page)
      const queryParams = new URLSearchParams();
      queryParams.append("make", selectedMake);
      queryParams.append("model", selectedModel);
      queryParams.append("year", selectedYear);
      router.push(`/search?${queryParams.toString()}`);
    }
  };

  const isReady = selectedMake && selectedModel && selectedYear;

  // STYLES: Differentiate between Hero (Big/Shadow) and Modal (Clean)
  const containerClass = variant === "hero" 
    ? "bg-white border-y-2 border-gray-100 p-6 w-full max-w-6xl mx-auto my-4 shadow-sm"
    : "w-full space-y-4"; // Modal mode is simpler

  const gridClass = variant === "hero"
    ? "grid grid-cols-1 md:grid-cols-4 gap-4"
    : "flex flex-col gap-4"; 

  return (
    <div className={containerClass}>
      {variant === "hero" && (
        <div className="mb-6 flex items-center space-x-2">
          <h2 className="text-center w-full text-xl font-bold text-gray-900">Find part by vehicle</h2>
        </div>
      )}

      <div className={gridClass}>
        {/* MAKE */}
        <div className="relative">
          <select
            value={selectedMake}
            onChange={(e) => setSelectedMake(e.target.value)}
            className="w-full appearance-none bg-[var(--surface)] text-gray-900 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
          >
            <option value="">Select Make</option>
            {makes.map((make) => (
              <option key={make.id} value={make.id}>{make.name}</option>
            ))}
          </select>
        </div>

        {/* MODEL */}
        <div className="relative">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={!selectedMake || isLoadingModels}
            className="w-full appearance-none bg-[var(--surface)] text-gray-900 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] disabled:opacity-50 disabled:bg-gray-50"
          >
            <option value="">{isLoadingModels ? "Loading..." : "Select Model"}</option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>{model.name}</option>
            ))}
          </select>
          {isLoadingModels && <Loader2 className="absolute right-3 top-3.5 animate-spin text-gray-400" size={16} />}
        </div>

        {/* YEAR */}
        <div className="relative">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            disabled={!selectedModel || isLoadingYears}
            className="w-full appearance-none bg-[var(--surface)] text-gray-900 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] disabled:opacity-50 disabled:bg-gray-50"
          >
            <option value="">{isLoadingYears ? "Loading..." : "Select Year"}</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* ACTION BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={!isReady}
          className={`
            w-full py-3 rounded-lg font-bold text-white shadow-md transition-all duration-200 flex items-center justify-center
            ${isReady ? "bg-[var(--accent)] hover:bg-red-700 hover:-translate-y-0.5" : "bg-gray-300 cursor-not-allowed shadow-none"}
          `}
        >
          {onConfirm ? "Add Vehicle" : "Find Parts"}
        </button>
      </div>
    </div>
  );
}