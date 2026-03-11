import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

export const productsTable = pgTable('products', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    price: integer('price').notNull(),
    description: text('description').notNull(),
    image: text('image'),
    videoUrl: text('video_url'),
    category: text('category'),
    likes: integer('likes').default(0),
    createdAt: text('created_at').notNull(),
});

export const productCategoryTable = pgTable('product_categories', {
    id: serial('id').primaryKey(),
    name: text('name').notNull().unique(),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
});

export type InsertProduct = typeof productsTable.$inferInsert;
export type SelectProduct = typeof productsTable.$inferSelect;