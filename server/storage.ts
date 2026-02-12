import { db } from "./db";
import { 
  products, cartItems, orders, orderItems,
  type Product, type InsertProduct,
  type CartItem, type InsertCartItem,
  type Order, type InsertOrder,
  type OrderItem,
  type OrderWithItems
} from "@shared/schema";
import { eq, desc, like, and } from "drizzle-orm";
import { authStorage } from "./replit_integrations/auth/storage";

export interface IStorage {
  // Products
  getProducts(params?: { category?: string; featured?: boolean; search?: string }): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<void>;

  // Cart
  getCartItems(userId: string): Promise<(CartItem & { product: Product })[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<void>;
  clearCart(userId: string): Promise<void>;

  // Orders
  createOrder(order: InsertOrder, items: { productId: number; quantity: number; price: string; size?: string; color?: string }[]): Promise<Order>;
  getOrders(userId: string): Promise<Order[]>;
  getOrder(id: number): Promise<OrderWithItems | undefined>;
  
  // Auth Storage Access
  auth: typeof authStorage;
}

export class DatabaseStorage implements IStorage {
  public auth = authStorage;

  // Products
  async getProducts(params?: { category?: string; featured?: boolean; search?: string }): Promise<Product[]> {
    let query = db.select().from(products);
    
    // Build where clause
    const conditions = [];
    if (params?.category) conditions.push(eq(products.category, params.category));
    if (params?.featured) conditions.push(eq(products.isFeatured, true));
    if (params?.search) conditions.push(like(products.title, `%${params.search}%`));
    
    if (conditions.length > 0) {
      // @ts-ignore - drizzle type inference tricky with dynamic array
      return await query.where(and(...conditions));
    }
    
    return await query;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updated] = await db.update(products).set(updates).where(eq(products.id, id)).returning();
    return updated;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Cart
  async getCartItems(userId: string): Promise<(CartItem & { product: Product })[]> {
    return await db.select({
      id: cartItems.id,
      userId: cartItems.userId,
      productId: cartItems.productId,
      quantity: cartItems.quantity,
      size: cartItems.size,
      color: cartItems.color,
      product: products,
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.userId, userId));
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    // Check if item exists (same product, size, color)
    const existing = await db.select()
      .from(cartItems)
      .where(and(
        eq(cartItems.userId, item.userId),
        eq(cartItems.productId, item.productId),
        eq(cartItems.size, item.size || null), // Handle nulls if needed, though schema allows null
        eq(cartItems.color, item.color || null)
      ));

    if (existing.length > 0) {
      const [updated] = await db.update(cartItems)
        .set({ quantity: existing[0].quantity + (item.quantity || 1) })
        .where(eq(cartItems.id, existing[0].id))
        .returning();
      return updated;
    }

    const [newItem] = await db.insert(cartItems).values(item).returning();
    return newItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    if (quantity <= 0) {
      await this.removeFromCart(id);
      return undefined;
    }
    const [updated] = await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, id)).returning();
    return updated;
  }

  async removeFromCart(id: number): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  }
  
  async clearCart(userId: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  }

  // Orders
  async createOrder(orderData: InsertOrder, items: { productId: number; quantity: number; price: string; size?: string; color?: string }[]): Promise<Order> {
    // Transaction ideally
    const [order] = await db.insert(orders).values(orderData).returning();
    
    for (const item of items) {
      await db.insert(orderItems).values({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        color: item.color,
      });
    }
    
    return order;
  }

  async getOrders(userId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  }

  async getOrder(id: number): Promise<OrderWithItems | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    if (!order) return undefined;

    const items = await db.select({
      id: orderItems.id,
      orderId: orderItems.orderId,
      productId: orderItems.productId,
      quantity: orderItems.quantity,
      price: orderItems.price,
      size: orderItems.size,
      color: orderItems.color,
      product: products
    })
    .from(orderItems)
    .innerJoin(products, eq(orderItems.productId, products.id))
    .where(eq(orderItems.orderId, id));

    return { ...order, items };
  }
}

export const storage = new DatabaseStorage();
