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
  /** ETH price display string, e.g. "2.5 ETH" */
  priceLabel?: string;
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
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  customer?: {
    first_name?: string;
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