
export interface CustomerReviewCardProps {
  name: string;
  rating: number; // 1–5
  comment: string;
  date: string; // ISO string
  verified?: boolean;
}
