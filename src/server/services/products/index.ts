import {
    productRepository,
    SelectCategory,
} from '@/src/server/repositories/products';
import { SelectProduct, InsertProduct } from '@/src/server/db/schema/products';
import { ProductSchema, UpdateProductSchema, CategorySchema } from '@/src/server/validations/products';

// ─── Product Service ─────────────────────────────────────────────────────────

export const productService = {
    // ── Products ───────────────────────────────────────────────────────────

    async getProducts(): Promise<SelectProduct[]> {
        return productRepository.getProducts();
    },

    async getProductById(id: number): Promise<SelectProduct | null> {
        const product = await productRepository.getProductById(id);
        return product ?? null;
    },

    async createProduct(data: ProductSchema): Promise<SelectProduct> {
        const now = new Date().toISOString();

        const productData: InsertProduct = {
            name: data.name,
            price: data.price,
            description: data.description,
            image: data.image ?? null,
            videoUrl: data.videoUrl ?? null,
            category: data.category ?? null,
            likes: 0,
            createdAt: now,
        };

        return productRepository.createProduct(productData);
    },

    async updateProduct(id: number, data: UpdateProductSchema): Promise<SelectProduct | null> {
        const existing = await productRepository.getProductById(id);
        if (!existing) return null;

        const updated = await productRepository.updateProduct(id, {
            ...(data.name !== undefined && { name: data.name }),
            ...(data.price !== undefined && { price: data.price }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.image !== undefined && { image: data.image }),
            ...(data.videoUrl !== undefined && { videoUrl: data.videoUrl }),
            ...(data.category !== undefined && { category: data.category }),
        });

        return updated ?? null;
    },

    async deleteProduct(id: number): Promise<boolean> {
        const existing = await productRepository.getProductById(id);
        if (!existing) return false;

        await productRepository.deleteProduct(id);
        return true;
    },

    async searchProducts(query: string): Promise<SelectProduct[]> {
        if (!query.trim()) return productRepository.getProducts();
        return productRepository.searchProducts(query);
    },

    async getProductsByCategory(category: string): Promise<SelectProduct[]> {
        return productRepository.getProductsByCategory(category);
    },

    async likeProduct(id: number): Promise<SelectProduct | null> {
        const updated = await productRepository.incrementLikes(id);
        return updated ?? null;
    },

    // ── Categories ─────────────────────────────────────────────────────────

    async getCategories(): Promise<SelectCategory[]> {
        return productRepository.getCategories();
    },

    async getCategoryById(id: number): Promise<SelectCategory | null> {
        const category = await productRepository.getCategoryById(id);
        return category ?? null;
    },

    async createCategory(data: CategorySchema): Promise<SelectCategory | { error: string }> {
        const existing = await productRepository.getCategoryByName(data.name);
        if (existing) {
            return { error: 'Category with this name already exists' };
        }

        const now = new Date().toISOString();
        return productRepository.createCategory({
            name: data.name,
            createdAt: now,
            updatedAt: now,
        });
    },

    async updateCategory(id: number, data: CategorySchema): Promise<SelectCategory | null | { error: string }> {
        const existing = await productRepository.getCategoryById(id);
        if (!existing) return null;

        // Check if name already exists on another category
        const duplicate = await productRepository.getCategoryByName(data.name);
        if (duplicate && duplicate.id !== id) {
            return { error: 'Category with this name already exists' };
        }

        const now = new Date().toISOString();
        const updated = await productRepository.updateCategory(id, {
            name: data.name,
            updatedAt: now,
        });

        return updated ?? null;
    },

    async deleteCategory(id: number): Promise<boolean> {
        const existing = await productRepository.getCategoryById(id);
        if (!existing) return false;

        await productRepository.deleteCategory(id);
        return true;
    },
};
