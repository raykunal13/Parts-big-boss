"use client";

import { Star, CheckCircle } from "lucide-react";
import { CustomerReviewCardProps } from "../../types/reviewCardProp";

export default function CustomerReviewCard({
  name,
  rating,
  comment,
  date,
  verified = false,
}: CustomerReviewCardProps) {
  return (
    <div
      className="
        rounded-xl
        border border-[var(--border)]
        bg-white
        p-4
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            {name}
          </p>

          <div className="mt-1 flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < rating
                    ? "fill-yellow-500 text-yellow-500"
                    : "text-yellow-300"
                }
              />
            ))}
          </div>
        </div>

        {verified && (
          <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
            <CheckCircle size={14} className="text-green-600" />
            Verified
          </div>
        )}
      </div>

      {/* Comment */}
      <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
        {comment}
      </p>

      {/* Date */}
      <p className="mt-4 text-xs text-[var(--text-muted)]">
        {new Date(date).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </p>
    </div>
  );
}
