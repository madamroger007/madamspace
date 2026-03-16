import { ZodErrorProductSchema, ZodErrorCategorySchema } from '@/src/server/validations/products';

// ─── Product Types ───────────────────────────────────────────────────────────

export interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string | null;
    videoUrl: string | null;
    category: string | null;
    likes: number | null;
    createdAt: string;
}

export interface ProductFormData {
    name: string;
    price: number;
    description: string;
    image: string;
    videoUrl: string;
    category: string;
}

export type ProductFormError = ZodErrorProductSchema | null;

// ─── Category Types ──────────────────────────────────────────────────────────

export interface Category {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface CategoryFormData {
    name: string;
}

export type CategoryFormError = ZodErrorCategorySchema | null;
