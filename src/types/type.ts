export type Orders = {
    createdAt: string,
    items: Item[],
    order_id: string,
    status: string,
    gross_amount: number,
    snap_token: string,
    customer: Customer,
    payment_method: string,
    va_number: string
}

export type Customer = {
    name: string,
    email: string,
    phone: string
}
export type Item = {
    id: string,
    name: string,
    image?: string,
    videoUrl?: string,
    price: number,
    quantity: number
}

// ─── Product ─────────────────────────────────────────────────────────────────
export type ProductCategory =
  | "Artwork"
  | "Music"
  | "Photography"
  | "Sports"
  | "Videos"
  | "Virtual Reality";

export type Product = {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  /** Optional YouTube video URL for the product preview */
  videoUrl?: string;
  category?: ProductCategory;
  likes?: number;
  createdAt: string; // ISO date string
};

// ─── Cart ────────────────────────────────────────────────────────────────────
export type CartItem = Product & {
  quantity: number;
};

// ─── Checkout ────────────────────────────────────────────────────────────────
export type CheckoutStatus = "idle" | "loading" | "success" | "error";

export type MidtransTransaction = {
  order_id: string;
  gross_amount: number;
  items: Item[];
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  payment_method?: string;
};

// ─── State ───────────────────────────────────────────────────────────────────
export type ProductState = {
  products: Product[];
  cart: CartItem[];
  checkoutStatus: CheckoutStatus;
  snapToken: string | null;
};

// ─── Actions ─────────────────────────────────────────────────────────────────
export type ProductAction =
  | { type: "SET_PRODUCTS"; payload: Product[] }
  | { type: "ADD_TO_CART"; payload: Product }
  | { type: "REMOVE_FROM_CART"; payload: string } // product id
  | { type: "CLEAR_CART" }
  | { type: "SET_CHECKOUT_STATUS"; payload: CheckoutStatus }
  | { type: "SET_SNAP_TOKEN"; payload: string | null }
  | { type: "SET_CART"; payload: CartItem[] };

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


export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

export interface Voucher {
    id: number | undefined;
    code: string;
    discount: string;
    expiredAt:string;
    createdAt: string;
    updatedAt: string;
}