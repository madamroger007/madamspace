import { eq, ilike, desc } from 'drizzle-orm';
import { db } from '@/src/server/db';
import {
    productsTable,
    productCategoryTable,
    InsertProduct,
    SelectProduct,
} from '@/src/server/db/schema/products';

// ─── Product Types ───────────────────────────────────────────────────────────

export type InsertCategory = typeof productCategoryTable.$inferInsert;
export type SelectCategory = typeof productCategoryTable.$inferSelect;

// ─── Products Repository ─────────────────────────────────────────────────────

export const productRepository = {
    // ── Products CRUD ──────────────────────────────────────────────────────

    async getProducts(): Promise<SelectProduct[]> {
        return db.select().from(productsTable).orderBy(desc(productsTable.createdAt));
    },

    async getProductById(id: number): Promise<SelectProduct | undefined> {
        const [product] = await db
            .select()
            .from(productsTable)
            .where(eq(productsTable.id, id));
        return product;
    },

    async createProduct(data: InsertProduct): Promise<SelectProduct> {
        const [product] = await db.insert(productsTable).values(data).returning();
        return product;
    },

    async updateProduct(
        id: number,
        data: Partial<Omit<InsertProduct, 'id'>>
    ): Promise<SelectProduct | undefined> {
        const [product] = await db
            .update(productsTable)
            .set(data)
            .where(eq(productsTable.id, id))
            .returning();
        return product;
    },

    async deleteProduct(id: number): Promise<void> {
        await db.delete(productsTable).where(eq(productsTable.id, id));
    },

    async searchProducts(query: string): Promise<SelectProduct[]> {
        return db
            .select()
            .from(productsTable)
            .where(ilike(productsTable.name, `%${query}%`))
            .orderBy(desc(productsTable.createdAt));
    },

    async getProductsByCategory(category: string): Promise<SelectProduct[]> {
        return db
            .select()
            .from(productsTable)
            .where(eq(productsTable.category, category))
            .orderBy(desc(productsTable.createdAt));
    },

    async incrementLikes(id: number): Promise<SelectProduct | undefined> {
        const product = await this.getProductById(id);
        if (!product) return undefined;

        const [updated] = await db
            .update(productsTable)
            .set({ likes: (product.likes ?? 0) + 1 })
            .where(eq(productsTable.id, id))
            .returning();
        return updated;
    },

    // ── Categories CRUD ────────────────────────────────────────────────────

    async getCategories(): Promise<SelectCategory[]> {
        return db
            .select()
            .from(productCategoryTable)
            .orderBy(productCategoryTable.name);
    },

    async getCategoryById(id: number): Promise<SelectCategory | undefined> {
        const [category] = await db
            .select()
            .from(productCategoryTable)
            .where(eq(productCategoryTable.id, id));
        return category;
    },

    async getCategoryByName(name: string): Promise<SelectCategory | undefined> {
        const [category] = await db
            .select()
            .from(productCategoryTable)
            .where(eq(productCategoryTable.name, name));
        return category;
    },

    async createCategory(data: InsertCategory): Promise<SelectCategory> {
        const [category] = await db
            .insert(productCategoryTable)
            .values(data)
            .returning();
        return category;
    },

    async updateCategory(
        id: number,
        data: Partial<Omit<InsertCategory, 'id'>>
    ): Promise<SelectCategory | undefined> {
        const [category] = await db
            .update(productCategoryTable)
            .set(data)
            .where(eq(productCategoryTable.id, id))
            .returning();
        return category;
    },

    async deleteCategory(id: number): Promise<void> {
        await db.delete(productCategoryTable).where(eq(productCategoryTable.id, id));
    },
};
