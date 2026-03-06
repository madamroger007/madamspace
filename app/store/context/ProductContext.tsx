"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { productReducer, initialState } from "./productReducer";
import type {
  Product,
  ProductState,
  CartItem,
  CheckoutStatus,
  MidtransTransaction,
} from "./productTypes";

// ── Snap.js type augmentation ────────────────────────────────────────────────
declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options?: {
          onSuccess?: (result: unknown) => void;
          onPending?: (result: unknown) => void;
          onError?: (result: unknown) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

// ── Context shape ─────────────────────────────────────────────────────────────
type ProductContextValue = {
  // State
  products: Product[];
  cart: CartItem[];
  checkoutStatus: CheckoutStatus;
  cartCount: number;
  cartTotal: number;

  // Actions
  setProducts: (products: Product[]) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  checkout: (
    customer?: MidtransTransaction["customer"],
    payment_method?: string
  ) => Promise<{ order_id: string; snap_token: string } | null>;
};

const ProductContext = createContext<ProductContextValue | null>(null);

// ── Seed data ─────────────────────────────────────────────────────────────────
const SEED_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Cyber Warrior #01",
    price: 2500000,
    priceLabel: "2.5 ETH",
    description: "A rare cyber warrior from the genesis collection.",
    image: "/nft-card-1.png",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    category: "Artwork",
    likes: 1200,
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Neon Matrix #45",
    price: 1800000,
    priceLabel: "1.8 ETH",
    description:
      "Immersive neon-lit matrix artwork born from the intersection of code and consciousness. Each glowing strand tells a story of the digital world beyond.",
    image: "/nft-card-1.png",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    category: "Virtual Reality",
    likes: 850,
    createdAt: "2024-02-20T08:30:00Z",
  },
  {
    id: "3",
    name: "Ape Rebel #11",
    price: 4200000,
    priceLabel: "4.2 ETH",
    description:
      "The most rebellious ape in the metaverse. Wearing neon shades and a leather jacket, Ape Rebel #11 is a symbol of the counter-culture digital movement.",
    image: "/nft-card-1.png",
    category: "Artwork",
    likes: 2400,
    createdAt: "2024-03-05T14:00:00Z",
  },
  {
    id: "4",
    name: "Future Soul #99",
    price: 900000,
    priceLabel: "0.9 ETH",
    description:
      "A soul trapped in digital form, waiting to be released. Captured at the exact moment of digital transcendence by renowned metaverse photographer Zara Solis.",
    image: "/nft-card-1.png",
    category: "Photography",
    likes: 420,
    createdAt: "2024-03-18T09:15:00Z",
  },
  {
    id: "5",
    name: "Digital Ghost #07",
    price: 3100000,
    priceLabel: "3.1 ETH",
    description:
      "Ethereal ghost rendered in 4K — a first of its kind cinematic NFT. Each frame was hand-rendered over 300 hours using proprietary volumetric simulation.",
    image: "/nft-card-1.png",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    category: "Videos",
    likes: 1100,
    createdAt: "2024-04-01T16:45:00Z",
  },
  {
    id: "6",
    name: "Sonic Pulse #33",
    price: 1500000,
    priceLabel: "1.5 ETH",
    description:
      "Visualized sonic waves turned into living art. Generated from a real studio recording session, each color shift maps to a unique frequency in the track.",
    image: "/nft-card-1.png",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    category: "Music",
    likes: 670,
    createdAt: "2024-04-12T11:00:00Z",
  },
  {
    id: "7",
    name: "Stadium Legend #88",
    price: 5000000,
    priceLabel: "5.0 ETH",
    description:
      "A legendary sports moment immortalized on-chain — the final second of the greatest comeback in metaverse sports history. Authenticated by the league.",
    image: "/nft-card-1.png",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    category: "Sports",
    likes: 3200,
    createdAt: "2024-05-01T07:00:00Z",
  },
  {
    id: "8",
    name: "Abstract Void #22",
    price: 2100000,
    priceLabel: "2.1 ETH",
    description:
      "Abstract void captured at the edge of the universe — a meditation rendered through 11,000 procedurally generated particles. No two renders are ever the same.",
    image: "/nft-card-1.png",
    category: "Artwork",
    likes: 960,
    createdAt: "2024-05-20T13:30:00Z",
  },
];

// ── Provider ──────────────────────────────────────────────────────────────────
export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(productReducer, initialState);
  const snapScriptLoaded = useRef(false);

  // Load Midtrans Snap.js once
  useEffect(() => {
    if (snapScriptLoaded.current) return;
    const clientKey =
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? "SB-Mid-client-demo";
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", clientKey);
    script.async = true;
    document.head.appendChild(script);
    snapScriptLoaded.current = true;
  }, []);

  // Seed products on first mount and load cart from localStorage
  useEffect(() => {
    dispatch({ type: "SET_PRODUCTS", payload: SEED_PRODUCTS });
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          dispatch({ type: "SET_CART", payload: parsed });
        }
      } catch (e) {
        console.error("Failed to parse saved cart", e);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.cart));
  }, [state.cart]);

  // Derived values
  const cartCount = state.cart.reduce((acc, i) => acc + i.quantity, 0);
  const cartTotal = state.cart.reduce(
    (acc, i) => acc + i.price * i.quantity,
    0
  );

  // Actions
  const setProducts = useCallback((products: Product[]) => {
    dispatch({ type: "SET_PRODUCTS", payload: products });
  }, []);

  const addToCart = useCallback((product: Product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: productId });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const checkout = useCallback(
    async (
      customer?: MidtransTransaction["customer"],
      payment_method?: string
    ): Promise<{ order_id: string; snap_token: string } | null> => {
      if (state.cart.length === 0) return null;

      dispatch({ type: "SET_CHECKOUT_STATUS", payload: "loading" });

      try {
        const payload: MidtransTransaction = {
          order_id: `ORDER-${Date.now()}`,
          gross_amount: cartTotal,
          items: state.cart.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          customer,
          payment_method,
        };

        const res = await fetch("/api/payment/create-transaction", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Failed to create transaction");

        const { snap_token } = await res.json();
        
        // Save order for persistence (mock DB in localStorage)
        const pendingOrder = {
          ...payload,
          snap_token,
          createdAt: new Date().toISOString(),
          status: "pending"
        };
        const existingOrders = JSON.parse(localStorage.getItem("pending_orders") || "{}");
        existingOrders[payload.order_id] = pendingOrder;
        localStorage.setItem("pending_orders", JSON.stringify(existingOrders));

        dispatch({ type: "SET_SNAP_TOKEN", payload: snap_token });
        dispatch({ type: "SET_CHECKOUT_STATUS", payload: "idle" });

        return { order_id: payload.order_id, snap_token };
      } catch (err) {
        console.error("[checkout]", err);
        dispatch({ type: "SET_CHECKOUT_STATUS", payload: "error" });
        return null;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.cart, cartTotal]
  );

  return (
    <ProductContext.Provider
      value={{
        products: state.products,
        cart: state.cart,
        checkoutStatus: state.checkoutStatus,
        cartCount,
        cartTotal,
        setProducts,
        addToCart,
        removeFromCart,
        clearCart,
        checkout,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useProduct(): ProductContextValue {
  const ctx = useContext(ProductContext);
  if (!ctx) {
    throw new Error("useProduct must be used within a <ProductProvider>");
  }
  return ctx;
}
