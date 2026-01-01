import axios from "axios";
import { hydrate } from "./useAuthStore";

export async function bootstrapAuth() {
  try {
    // 1. Fetch User
    const userRes = await axios.get(
      "http://localhost:5000/api/users/me",
      { withCredentials: true }
    );

    // 2. If user exists, fetch their garage
    let garage = [];
    if (userRes.data) {
      try {
        const vehicleRes = await axios.get(
          "http://localhost:5000/api/user/vehicles",
          { withCredentials: true }
        );
        garage = vehicleRes.data;
      } catch (vErr) {
        console.warn("Failed to fetch garage:", vErr);
        // Don't fail auth just because garage failed
      }
    }

    // 3. Hydrate everything at once
    hydrate(userRes.data, garage);

  } catch (err) {
    // Auth failed completely
    hydrate(null, []);
  }
}