"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import { productReducer, initialState } from "./productReducer";
import type {
  Product,
  ProductCategory,
} from "@/src/types/type";
import { getCategories, getProducts } from "@/src/server/actions/products/action";

// ── Context shape ─────────────────────────────────────────────────────────────
type ProductContextValue = {
  // State
  products: Product[];
  categories: ProductCategory[]; // Replace with actual Category type when defined
  // Actions
  setProducts: (products: Product[]) => void;
  updateProduct: (productId: Product) => void;
  deleteProduct: (productId: number) => void;
  addProduct: (product: Product) => void;

  // category
  setCategories: (categories: ProductCategory[]) => void;
  updateCategory: (categoryId: ProductCategory) => void;
  deleteCategory: (categoryId: number) => void;
  addCategory: (category: ProductCategory) => void;

  loading: boolean;
  error: string | null;
};

const ProductContext = createContext<ProductContextValue | null>(null);


// ── Provider ──────────────────────────────────────────────────────────────────
export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(productReducer, initialState);

  // Seed products on first mount and load cart from localStorage
  useEffect(() => {
    const products = localStorage.getItem("products")
    if (products) {
      dispatch({ type: "SET_PRODUCTS", payload: JSON.parse(products) });

    } else {
      getProducts().then((data) => {
        dispatch({ type: "SET_PRODUCTS", payload: data.products });
        localStorage.setItem("products", JSON.stringify(data.products));
      });

    }

    const categories = localStorage.getItem("categories")
    if (categories) {
      dispatch({ type: "SET_CATEGORIES", payload: JSON.parse(categories) });

    } else {
      getCategories().then((data) => {
        dispatch({ type: "SET_CATEGORIES", payload: data.categories });
        localStorage.setItem("categories", JSON.stringify(data.categories));
      });
    }

  }, []);

  useEffect(() => {
    // Sync products to localStorage whenever they change
    localStorage.setItem("products", JSON.stringify(state.products));
  }, [state.products]);

  // Sync categories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(state.categories));
  }, [state.categories]);


  // Actions
  const setProducts = useCallback((products: Product[]) => {
    dispatch({ type: "SET_PRODUCTS", payload: products });
  }, []);

  const updateProduct = useCallback((product: Product) => {
    dispatch({ type: "UPDATE_PRODUCT", payload: product });
  }, []);


  const deleteProduct = useCallback((productId: number) => {
    dispatch({ type: "DELETE_PRODUCT", payload: productId });
  }, []);

  const setCategories = useCallback((categories: ProductCategory[]) => {
    dispatch({ type: "SET_CATEGORIES", payload: categories });
  }, []);

  const updateCategory = useCallback((category: ProductCategory) => {
    dispatch({ type: "UPDATE_CATEGORY", payload: category });
  }, []);

  const deleteCategory = useCallback((categoryId: number) => {
    dispatch({ type: "DELETE_CATEGORY", payload: categoryId });
  }, []);

  const addProduct = useCallback((product: Product) => {
    dispatch({ type: "ADD_PRODUCT", payload: product });
  }, []);

  const addCategory = useCallback((category: ProductCategory) => {
    dispatch({ type: "ADD_CATEGORY", payload: category });
  }, []);


  return (
    <ProductContext.Provider
      value={{
        products: state.products,
        setProducts,
        updateProduct,
        deleteProduct,
        categories: state.categories,
        setCategories,
        updateCategory,
        deleteCategory,
        addProduct,
        addCategory,
        loading: state.loading,
        error: state.error,
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
