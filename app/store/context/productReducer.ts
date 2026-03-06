import type { ProductState, ProductAction, CartItem } from "./productTypes";

export const initialState: ProductState = {
  products: [],
  cart: [],
  checkoutStatus: "idle",
  snapToken: null,
};

export function productReducer(
  state: ProductState,
  action: ProductAction
): ProductState {
  switch (action.type) {
    // ── Products ────────────────────────────────────────────────────────────
    case "SET_PRODUCTS":
      return { ...state, products: action.payload };

    // ── Cart ────────────────────────────────────────────────────────────────
    case "ADD_TO_CART": {
      const existing = state.cart.find((item) => item.id === action.payload.id);
      let updatedCart: CartItem[];

      if (existing) {
        updatedCart = state.cart.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...state.cart, { ...action.payload, quantity: 1 }];
      }

      return { ...state, cart: updatedCart };
    }

    case "REMOVE_FROM_CART": {
      const existing = state.cart.find((item) => item.id === action.payload);
      if (!existing) return state;

      const updatedCart =
        existing.quantity > 1
          ? state.cart.map((item) =>
              item.id === action.payload
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
          : state.cart.filter((item) => item.id !== action.payload);

      return { ...state, cart: updatedCart };
    }

    case "CLEAR_CART":
      return { ...state, cart: [], snapToken: null, checkoutStatus: "idle" };

    // ── Checkout ────────────────────────────────────────────────────────────
    case "SET_CHECKOUT_STATUS":
      return { ...state, checkoutStatus: action.payload };

    case "SET_SNAP_TOKEN":
      return { ...state, snapToken: action.payload };

    case "SET_CART":
      return { ...state, cart: action.payload };

    default:
      return state;
  }
}
