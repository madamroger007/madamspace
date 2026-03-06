"use client";

import { ProductProvider } from "../context/ProductContext";

/**
 * Aggregate all store providers here.
 * Add new providers as the store grows — wrap innermost first.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return <ProductProvider>{children}</ProductProvider>;
}
