import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { InsertCartItem } from "@shared/schema";

export function useCart() {
  return useQuery({
    queryKey: [api.cart.get.path],
    queryFn: async () => {
      const res = await fetch(api.cart.get.path, { credentials: "include" });
      if (res.status === 401) return null; // Not logged in
      if (!res.ok) throw new Error("Failed to fetch cart");
      return api.cart.get.responses[200].parse(await res.json());
    },
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (item: Omit<InsertCartItem, "userId">) => {
      const res = await fetch(api.cart.addItem.path, {
        method: api.cart.addItem.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
        credentials: "include",
      });
      
      if (res.status === 401) {
        throw new Error("Please log in to add items to cart");
      }
      if (!res.ok) throw new Error("Failed to add to cart");
      
      return api.cart.addItem.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.cart.get.path] });
      toast({ title: "Added to cart", description: "Item successfully added to your bag." });
    },
    onError: (err) => {
      toast({ 
        title: "Error", 
        description: err.message, 
        variant: "destructive" 
      });
      if (err.message.includes("log in")) {
        window.location.href = "/api/login";
      }
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      const url = buildUrl(api.cart.updateItem.path, { id });
      const res = await fetch(url, {
        method: api.cart.updateItem.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update cart item");
      return api.cart.updateItem.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.cart.get.path] });
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.cart.removeItem.path, { id });
      const res = await fetch(url, { 
        method: api.cart.removeItem.method,
        credentials: "include" 
      });
      if (!res.ok) throw new Error("Failed to remove item");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.cart.get.path] });
      toast({ title: "Removed", description: "Item removed from cart." });
    },
  });
}
