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
  const productsList = await storage.getProducts();
  if (productsList.length > 0) {
    // Clear existing products to re-seed with jewelry theme
    for (const p of productsList) {
      await storage.deleteProduct(p.id);
    }
  }

  console.log("Seeding jewelry products...");
  const jewelryProducts = [
    {
      title: "Handcrafted Gold Signet Ring",
      description: "A timeless 18k gold plated signet ring with a polished finish. Perfect for everyday luxury.",
      price: "199.00",
      category: "Rings",
      images: ["https://images.unsplash.com/photo-1611085583191-a3b158466d0b?q=80&w=2787&auto=format&fit=crop"],
      sizes: ["6", "7", "8"],
      colors: ["Gold"],
      stock: 50,
      isFeatured: true,
      tags: ["gold", "minimal", "luxury"],
    },
    {
      title: "Sculptural Cuff Bracelet",
      description: "Elegant and bold, this sculptural gold cuff adds a statement to any ensemble.",
      price: "145.00",
      category: "Bracelets",
      images: ["https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=2862&auto=format&fit=crop"],
      sizes: ["One Size"],
      colors: ["Gold"],
      stock: 30,
      isFeatured: true,
      tags: ["bracelet", "gold"],
    },
    {
      title: "Minimalist Gold Necklace",
      description: "A delicate gold chain with a single pearl accent. Pure elegance in simplicity.",
      price: "120.00",
      category: "Necklaces",
      images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=2787&auto=format&fit=crop"],
      sizes: ["16\"", "18\""],
      colors: ["Gold"],
      stock: 45,
      isFeatured: true,
      tags: ["necklace", "gold", "pearl"],
    },
    {
      title: "Gold Hand Chain",
      description: "Exquisite hand chain connecting the wrist to a delicate ring, featuring minimalist accents.",
      price: "160.00",
      category: "Hand Chain",
      images: ["https://images.unsplash.com/photo-1630019017590-54774358826d?q=80&w=2864&auto=format&fit=crop"],
      sizes: ["One Size"],
      colors: ["Gold"],
      stock: 20,
      isFeatured: true,
      tags: ["hand-chain", "gold"],
    },
    {
      title: "Hoop Earring Collection",
      description: "A set of gold hoop earrings in various sizes and textures.",
      price: "85.00",
      category: "Earrings",
      images: ["https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=2864&auto=format&fit=crop"],
      sizes: ["Set"],
      colors: ["Gold"],
      stock: 60,
      isFeatured: true,
      tags: ["earrings", "gold"],
    },
    {
      title: "Vintage Gold Watch",
      description: "Sophisticated gold watch with a slim profile and elegant mesh strap.",
      price: "299.00",
      category: "Watches",
      images: ["https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=2788&auto=format&fit=crop"],
      sizes: ["One Size"],
      colors: ["Gold"],
      stock: 15,
      isFeatured: true,
      tags: ["watch", "gold", "vintage"],
    }
  ];

  for (const product of jewelryProducts) {
    await storage.createProduct(product);
  }
}
