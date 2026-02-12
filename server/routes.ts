import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Auth Setup
  await setupAuth(app);
  registerAuthRoutes(app);

  // --- Products ---
  app.get(api.products.list.path, async (req, res) => {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const featured = req.query.featured === 'true';
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    
    const products = await storage.getProducts({ category, featured, search });
    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  });

  app.post(api.products.create.path, isAuthenticated, async (req, res) => {
    // Basic admin check - for now just check if authenticated
    try {
      const input = api.products.create.input.parse(req.body);
      const product = await storage.createProduct(input);
      res.status(201).json(product);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
  app.put(api.products.update.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.products.update.input.parse(req.body);
      const product = await storage.updateProduct(Number(req.params.id), input);
      if (!product) return res.status(404).json({ message: "Product not found" });
      res.json(product);
    } catch (err) {
      res.status(400).json({ message: "Invalid Input" });
    }
  });
  
  app.delete(api.products.delete.path, isAuthenticated, async (req, res) => {
    await storage.deleteProduct(Number(req.params.id));
    res.status(204).send();
  });

  // --- Cart ---
  app.get(api.cart.get.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const items = await storage.getCartItems(userId);
    res.json(items);
  });

  app.post(api.cart.addItem.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    try {
      const input = api.cart.addItem.input.parse(req.body);
      const item = await storage.addToCart({ ...input, userId });
      res.json(item);
    } catch (err) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.delete(api.cart.removeItem.path, isAuthenticated, async (req, res) => {
    await storage.removeFromCart(Number(req.params.id));
    res.json({ success: true });
  });
  
  app.patch(api.cart.updateItem.path, isAuthenticated, async (req, res) => {
     const quantity = req.body.quantity;
     if (typeof quantity !== 'number') return res.status(400).json({ message: "Quantity required" });
     
     const item = await storage.updateCartItem(Number(req.params.id), quantity);
     res.json(item);
  });

  // --- Orders ---
  app.post(api.orders.create.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    try {
      const input = api.orders.create.input.parse(req.body);
      
      // Get cart items to convert to order items
      const cartItems = await storage.getCartItems(userId);
      if (cartItems.length === 0) return res.status(400).json({ message: "Cart is empty" });
      
      const orderItems = cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price, // Lock in price
        size: item.size || undefined,
        color: item.color || undefined
      }));
      
      const order = await storage.createOrder({ ...input, userId }, orderItems);
      
      // Clear cart
      await storage.clearCart(userId);
      
      res.status(201).json(order);
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Order creation failed" });
    }
  });

  app.get(api.orders.list.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const orders = await storage.getOrders(userId);
    res.json(orders);
  });
  
  app.get(api.orders.get.path, isAuthenticated, async (req, res) => {
    const order = await storage.getOrder(Number(req.params.id));
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const products = await storage.getProducts();
  if (products.length === 0) {
    console.log("Seeding products...");
    await storage.createProduct({
      title: "Linen Blend Midi Dress",
      description: "A breezy linen blend dress perfect for summer days. Features a fitted bodice and flowy skirt.",
      price: "129.00",
      category: "Dresses",
      images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=2883&auto=format&fit=crop"],
      sizes: ["XS", "S", "M", "L"],
      colors: ["Beige", "White"],
      stock: 50,
      isFeatured: true,
      tags: ["summer", "linen", "new"],
    });
    
    await storage.createProduct({
      title: "Silk Blouse",
      description: "Luxurious silk blouse with a relaxed fit. A wardrobe staple.",
      price: "89.00",
      category: "Tops",
      images: ["https://images.unsplash.com/photo-1551163943-3f6a29e3965e?q=80&w=2788&auto=format&fit=crop"],
      sizes: ["S", "M", "L"],
      colors: ["Cream", "Black"],
      stock: 30,
      isFeatured: true,
      tags: ["silk", "office"],
    });
    
    await storage.createProduct({
      title: "Gold Hoops",
      description: "Classic gold plated hoop earrings. Tarnish resistant.",
      price: "45.00",
      category: "Accessories",
      images: ["https://images.unsplash.com/photo-1630019852942-f89202989a51?q=80&w=2862&auto=format&fit=crop"],
      sizes: ["One Size"],
      colors: ["Gold"],
      stock: 100,
      isFeatured: false,
      tags: ["jewelry", "gold"],
    });
     await storage.createProduct({
      title: "Tailored Trousers",
      description: "High-waisted tailored trousers in a premium wool blend.",
      price: "110.00",
      category: "Bottoms",
      images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=2787&auto=format&fit=crop"],
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Black", "Grey"],
      stock: 40,
      isFeatured: true,
      tags: ["workwear", "pants"],
    });
  }
}
