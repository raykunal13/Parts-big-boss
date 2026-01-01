import { Make } from "../types/vehicle";

export async function getVehicleMakes(): Promise<Make[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/vehicles/companies`, {
      // Cache this request for 1 hour since car brands rarely change
      next: { revalidate: 3600 } 
    });
    
    if (!res.ok) throw new Error('Failed to fetch makes');
    
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}