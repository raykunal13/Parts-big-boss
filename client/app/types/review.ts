
export interface CustomerReview {
  id: string;
  name: string;
  rating: number; // 1–5
  title?: string;
  comment: string;
  date: string; // ISO string for future backend compatibility
  verified: boolean;
}
