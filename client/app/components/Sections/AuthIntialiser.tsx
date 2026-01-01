"use client";

import { useEffect } from "react";
import { bootstrapAuth } from "../../store/bootstrapAuth";

export default function AuthInitializer() {
  useEffect(() => {
    bootstrapAuth();
  }, []);

  return null; // This component renders nothing, just runs logic
}