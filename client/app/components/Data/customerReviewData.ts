// customerReviewData.ts
import { CustomerReview } from "../../types/review";

export const customerReviews: CustomerReview[] = [
  {
    id: "rev_001",
    name: "Rohit Sharma",
    rating: 5,
    title: "Perfect fit, OEM quality",
    comment:
      "The quality exceeded my expectations. Installed it on my car and the fit was absolutely spot on. Feels like OEM.",
    date: "2024-11-12",
    verified: true,
  },
  {
    id: "rev_002",
    name: "Ankit Verma",
    rating: 4,
    title: "Great value for money",
    comment:
      "Solid build quality and good finish. Delivery was quick. Would definitely recommend to others.",
    date: "2024-11-05",
    verified: true,
  },
  {
    id: "rev_003",
    name: "Siddharth Jain",
    rating: 5,
    comment:
      "Customer support was helpful and the product performs exactly as described. Will buy again.",
    date: "2024-10-28",
    verified: false,
  },
  {
    id: "rev_004",
    name: "Vikram Singh",
    rating: 5,
    title: "Fast shipping!",
    comment:
      "Ordered on Monday, arrived by Wednesday. The packaging was secure and the part works perfectly.",
    date: "2024-10-15",
    verified: true,
  },
  {
    id: "rev_005",
    name: "Priya Patel",
    rating: 4,
    title: "Good replacement",
    comment:
      "A very decent replacement for the original part. Slight difference in texture but barely noticeable.",
    date: "2024-09-30",
    verified: true,
  },
  {
    id: "rev_006",
    name: "Rahul Mehta",
    rating: 5,
    title: "Highly Recommended",
    comment:
      "I was skeptical at first because of the low price, but I am pleasantly surprised. Works like a charm!",
    date: "2024-09-22",
    verified: false,
  },
];
