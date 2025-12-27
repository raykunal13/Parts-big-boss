// client/app/utils/VehicleCategoryInfo.ts
import axios from "axios";
import { Make, Model } from "../../types/vehicle";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

class VehicleCategoryService {
  // We store data here. 
  // It starts small and only grows if the user clicks many different cars.
  private makes: Make[] | null = null;
  private models: Record<number, Model[]> = {}; // Stores models by Make ID
  private years: Record<number, number[]> = {}; // Stores years by Model ID

  async getMakes(): Promise<Make[]> {
    // 1. Check if we already have the list of companies
    if (this.makes) return this.makes;

    // 2. If not, fetch it from the backend
    try {
      const response = await axios.get<Make[]>(`${API_URL}/api/vehicles/companies`);
      this.makes = response.data;
      return this.makes;
    } catch (error) {
      console.error("Error fetching makes:", error);
      return [];
    }
  }

  async getModels(makeId: number): Promise<Model[]> {
    // 1. Check if we have models specifically for THIS makeId
    if (this.models[makeId]) return this.models[makeId];

    // 2. If not, fetch only this make's models
    try {
      const response = await axios.get<Model[]>(
        `${API_URL}/api/vehicles/models/${makeId}`
      );
      this.models[makeId] = response.data;
      return this.models[makeId];
    } catch (error) {
      console.error(`Error fetching models for make ${makeId}:`, error);
      return [];
    }
  }

  async getYears(modelId: number): Promise<number[]> {
    // 1. Check if we have years specifically for THIS modelId
    if (this.years[modelId]) return this.years[modelId];

    // 2. If not, fetch only this model's years
    try {
      const response = await axios.get<number[]>(
        `${API_URL}/api/vehicles/years/${modelId}`
      );
      this.years[modelId] = response.data;
      return this.years[modelId];
    } catch (error) {
      console.error(`Error fetching years for model ${modelId}:`, error);
      return [];
    }
  }
}

// Export a single instance so the data persists while the user is on the page
export const vehicleCategoryInfo = new VehicleCategoryService();