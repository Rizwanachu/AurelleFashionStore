import { z } from 'zod';
import { insertProductSchema, insertCartItemSchema, insertOrderSchema, products, cartItems, orders, orderItems } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  products: {
    list: {
      method: 'GET' as const,
      path: '/api/products' as const,
      input: z.object({
        category: z.string().optional(),
        featured: z.string().optional(), // "true" or "false"
        search: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof products.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/products/:id' as const,
      responses: {
        200: z.custom<typeof products.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/products' as const,
      input: insertProductSchema,
      responses: {
        201: z.custom<typeof products.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.internal, // Unauthorized
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/products/:id' as const,
      input: insertProductSchema.partial(),
      responses: {
        200: z.custom<typeof products.$inferSelect>(),
        404: errorSchemas.notFound,
        401: errorSchemas.internal,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/products/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
        401: errorSchemas.internal,
      },
    },
  },
  cart: {
    get: {
      method: 'GET' as const,
      path: '/api/cart' as const,
      responses: {
        200: z.array(z.custom<typeof cartItems.$inferSelect & { product: typeof products.$inferSelect }>()),
        401: errorSchemas.internal,
      },
    },
    addItem: {
      method: 'POST' as const,
      path: '/api/cart' as const,
      input: insertCartItemSchema.omit({ userId: true }),
      responses: {
        200: z.custom<typeof cartItems.$inferSelect>(), // Returns updated item
        401: errorSchemas.internal,
      },
    },
    removeItem: {
      method: 'DELETE' as const,
      path: '/api/cart/:id' as const,
      responses: {
        200: z.void(),
        404: errorSchemas.notFound,
      },
    },
    updateItem: {
      method: 'PATCH' as const,
      path: '/api/cart/:id' as const,
      input: z.object({ quantity: z.number() }),
      responses: {
        200: z.custom<typeof cartItems.$inferSelect>(),
      },
    },
  },
  orders: {
    create: {
      method: 'POST' as const,
      path: '/api/orders' as const,
      input: insertOrderSchema.omit({ userId: true }),
      responses: {
        201: z.custom<typeof orders.$inferSelect>(),
        401: errorSchemas.internal,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/orders' as const,
      responses: {
        200: z.array(z.custom<typeof orders.$inferSelect>()),
        401: errorSchemas.internal,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/orders/:id' as const,
      responses: {
        200: z.custom<typeof orders.$inferSelect & { items: (typeof orderItems.$inferSelect & { product: typeof products.$inferSelect })[] }>(),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
