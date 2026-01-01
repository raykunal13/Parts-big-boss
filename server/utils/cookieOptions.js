export const cookieOptions = {
  httpOnly: true,
  // 'secure' must be false on localhost (unless you use https locally)
  secure: process.env.NODE_ENV === "production", 
  
  // 'sameSite' should be 'lax' on localhost because ports (3000 vs 5000)
  // are treated as the same site (localhost). 'none' is only needed for 
  // actual cross-domain (e.g., frontend.com vs api.backend.com).
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
  
  maxAge: 7 * 24 * 60 * 60 * 1000, 
};