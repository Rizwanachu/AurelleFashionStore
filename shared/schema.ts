import { pgTable, text, serial, integer, boolean, timestamp, numeric, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";
export * from "./models/auth";

// Products Table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: numeric("price").notNull(),
  originalPrice: numeric("original_price"), // For discounts
  category: text("category").notNull(),
  images: text("images").array().notNull(), // Array of image URLs
  sizes: text("sizes").array().notNull(), // ["S", "M", "L"]
  colors: text("colors").array().notNull(), // ["Red", "Blue"]
  stock: integer("stock").notNull().default(0),
  isFeatured: boolean("is_featured").default(false),
  sku: text("sku"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Cart Items Table
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // references users.id (varchar)
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  size: text("size"),
  color: text("color"),
});

// Orders Table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // references users.id (varchar)
  status: text("status").notNull().default("pending"), // pending, paid, shipped, delivered, cancelled
  total: numeric("total").notNull(),
  shippingAddress: jsonb("shipping_address").notNull(), // { street, city, zip, etc. }
  paymentMethod: text("payment_method").notNull().default("card"), // razorpay, cod
  paymentId: text("payment_id"), // Razorpay payment ID
  trackingNumber: text("tracking_number"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Order Items Table
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: numeric("price").notNull(), // Price at time of purchase
  size: text("size"),
  color: text("color"),
});

// Zod Schemas
export const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true });
export const insertCartItemSchema = createInsertSchema(cartItems).omit({ id: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true, status: true, trackingNumber: true });

// Types
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderItem = typeof orderItems.$inferSelect;

export type OrderWithItems = Order & { items: (OrderItem & { product: Product })[] };

// Admin check helper (simple email check for MVP, or role column if added to users)
// For now, we'll assume any user can see products, but only specific users can edit.
