export interface Make {
  id: number;
  name: string;
}

export interface Model {
  id: number;
  name: string;
}

export interface Year {
  year: number;
}

// NEW: The Asset Type
export interface UserVehicle {
  id: number;
  user_id: number;
  vehicle_variant_id: number;
  nickname: string | null;
  is_active: boolean; // This is the most important field
  fitment_completeness: number;
  
  // Optional: In case the API returns the joined names directly
  vehicle_name?: string; 
  variant_name?: string;
  model_name?: string;
  make_name?: string;
  year?: number;
}