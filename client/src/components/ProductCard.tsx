import { Product } from "@shared/schema";
import { Link } from "wouter";
import { Button } from "./ui/button";
import { useAddToCart } from "@/hooks/use-cart";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { mutate: addToCart, isPending } = useAddToCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Default to first size/color if quick adding
    addToCart({
      productId: product.id,
      quantity: 1,
      size: product.sizes[0],
      color: product.colors[0],
    });
  };

  return (
    <Link href={`/product/${product.id}`} className="group block cursor-pointer">
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary/20 mb-4">
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
          src={product.images[0]}
          alt={product.title}
          className="h-full w-full object-cover object-center"
        />
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Sold Out
            </span>
          </div>
        )}
        
        {/* Quick Add Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <Button 
            className="w-full bg-white text-black hover:bg-black hover:text-white shadow-lg transition-colors"
            onClick={handleQuickAdd}
            disabled={isPending || product.stock <= 0}
          >
            {isPending ? "Adding..." : <><Plus className="w-4 h-4 mr-2" /> Quick Add</>}
          </Button>
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="font-serif text-lg font-medium group-hover:underline decoration-1 underline-offset-4">
          {product.title}
        </h3>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">${Number(product.price).toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-muted-foreground line-through text-xs">
              ${Number(product.originalPrice).toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
