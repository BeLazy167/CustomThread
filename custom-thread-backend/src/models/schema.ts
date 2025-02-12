import {
    integer,
    pgTable,
    serial,
    timestamp,
    varchar,
    boolean,
    jsonb,
    pgEnum,
} from "drizzle-orm/pg-core";
const STATUS_ENUMS = pgEnum("status", [
    "pending",
    "processing",
    "completed",
    "cancelled",
]);

export const products = pgTable("products", {
    mongoId: varchar("design_id").primaryKey(),
    userId: varchar("user_id")
        .notNull()
        .references(() => users.clerkId),
});
// PostgreSQL schemas using Drizzle
export const users = pgTable("users", {
    clerkId: varchar("clerk_id").primaryKey(),
    isDesigner: boolean("is_designer").notNull().default(false),
    commissionRate: integer("commission_rate").notNull().default(0),
});

export const orders = pgTable("orders", {
    id: serial("id").primaryKey(),
    userId: varchar("user_id")
        .notNull()
        .references(() => users.clerkId),
    // productList is an array of product ids
    productList: jsonb("product_list").notNull(),
    status: STATUS_ENUMS("status").notNull().default("pending"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// MongoDB schemas (TypeScript interfaces)
export interface Designs {
    //clerkId of the designer
    designerId: string;
    //auto generated id
    _id: string;
    url: string;
    mockupUrl: string;
    name: string;
    description: string;
    price: number;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

export const designs = pgTable("designs", {
    id: serial("id").primaryKey(),
    designerId: varchar("designer_id")
        .notNull()
        .references(() => users.clerkId),
});

export const designImages = pgTable("design_images", {
    id: serial("id").primaryKey(),
    designId: varchar("design_id")
        .notNull()
        .references(() => designs.id),
    imageUrl: varchar("image_url").notNull(),
});

export const designTags = pgTable("design_tags", {
    id: serial("id").primaryKey(),
    designId: varchar("design_id")
        .notNull()
        .references(() => designs.id),
    tag: varchar("tag").notNull(),
});
