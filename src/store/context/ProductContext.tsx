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
} from "@/src/types/type";
import { FetchProductsData } from "../../utils/FetchData";

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

    const products = localStorage.getItem("products")
    if (products) {
      dispatch({ type: "SET_PRODUCTS", payload: JSON.parse(products) });
      console.log("Products loaded from localStorage");
    } else {
      FetchProductsData().then((data) => {
        dispatch({ type: "SET_PRODUCTS", payload: data });
        localStorage.setItem("products", JSON.stringify(data));
      });
      console.log("Products fetched from API");
    }

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
  const cartCount = state.cart.reduce((acc: number, i: CartItem) => acc + i.quantity, 0);
  const cartTotal = state.cart.reduce(
    (acc: number, i: CartItem) => acc + i.price * i.quantity,
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
          items: state.cart.map((item: CartItem) => ({
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
export function useProductContext(): ProductContextValue {
  const ctx = useContext(ProductContext);
  if (!ctx) {
    throw new Error("useProduct must be used within a <ProductProvider>");
  }
  return ctx;
}
