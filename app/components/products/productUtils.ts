import type { Product } from "../../store/context/productTypes";

// ── Sort ──────────────────────────────────────────────────────────────────────
export type SortKey =
  | "name_asc"
  | "name_desc"
  | "price_asc"
  | "price_desc"
  | "newest"
  | "oldest";

export const SORT_OPTIONS: { label: string; value: SortKey }[] = [
  { label: "Name A → Z", value: "name_asc" },
  { label: "Name Z → A", value: "name_desc" },
  { label: "Price: Low → High", value: "price_asc" },
  { label: "Price: High → Low", value: "price_desc" },
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
];

export function sortProducts(products: Product[], key: SortKey): Product[] {
  return [...products].sort((a, b) => {
    switch (key) {
      case "name_asc":
        return a.name.localeCompare(b.name);
      case "name_desc":
        return b.name.localeCompare(a.name);
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      default:
        return 0;
    }
  });
}

// ── Categories ────────────────────────────────────────────────────────────────
import type { ProductCategory } from "../../store/context/productTypes";

export type CategoryFilter = "All" | ProductCategory;

export const CATEGORIES: CategoryFilter[] = [
  "All",
  "Artwork",
  "Music",
  "Photography",
  "Sports",
  "Videos",
  "Virtual Reality",
];
