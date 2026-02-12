import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useProduct, useProducts } from "@/hooks/use-products";
import { useAddToCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { useRoute } from "wouter";
import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Loader2, Star, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProductDetail() {
  const [match, params] = useRoute("/product/:id");
  const id = parseInt(params?.id || "0");
  const { data: product, isLoading } = useProduct(id);
  const { data: relatedProducts } = useProducts({ category: product?.category });
  
  const { mutate: addToCart, isPending } = useAddToCart();
  
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!product) return <div>Product not found</div>;

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return;
    addToCart({
      productId: product.id,
      quantity,
      size: selectedSize,
      color: selectedColor,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-12 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-secondary/20 overflow-hidden w-full">
              <img 
                src={product.images[activeImage]} 
                alt={product.title} 
                className="w-full h-full object-cover animate-fade-in"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "aspect-[3/4] cursor-pointer border-2 transition-colors",
                    activeImage === idx ? "border-black" : "border-transparent hover:border-black/20"
                  )}
                  onClick={() => setActiveImage(idx)}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4 border-b border-border pb-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex text-accent">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <span>(12 Reviews)</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-serif font-medium">{product.title}</h1>
              
              <div className="text-2xl font-medium">
                ${Number(product.price).toFixed(2)}
              </div>
              
              <p className="text-muted-foreground leading-relaxed max-w-lg">
                {product.description}
              </p>
            </div>

            <div className="space-y-6">
              {/* Colors */}
              <div className="space-y-3">
                <span className="text-sm font-bold uppercase tracking-wider">Color: {selectedColor || 'Select'}</span>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "w-10 h-10 rounded-full border border-border shadow-sm focus:outline-none flex items-center justify-center transition-all",
                        selectedColor === color ? "ring-2 ring-offset-2 ring-black scale-110" : "hover:scale-105"
                      )}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    >
                      {selectedColor === color && <div className="w-1.5 h-1.5 rounded-full bg-white mix-blend-difference" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="space-y-3">
                <span className="text-sm font-bold uppercase tracking-wider">Size: {selectedSize || 'Select'}</span>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        "min-w-[3rem] h-10 px-3 border border-border text-sm flex items-center justify-center transition-all",
                        selectedSize === size 
                          ? "bg-black text-white border-black" 
                          : "hover:border-black text-foreground"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center border border-border h-12 w-32">
                  <button 
                    className="flex-1 h-full flex items-center justify-center hover:bg-secondary/50"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="flex-1 text-center font-medium">{quantity}</span>
                  <button 
                    className="flex-1 h-full flex items-center justify-center hover:bg-secondary/50"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <Button 
                  size="lg" 
                  className="flex-1 h-12 text-base uppercase tracking-wider"
                  onClick={handleAddToCart}
                  disabled={!selectedSize || !selectedColor || isPending}
                >
                  {isPending ? "Adding..." : "Add to Cart"}
                </Button>
              </div>
            </div>
            
            <div className="pt-6 text-xs text-muted-foreground space-y-2">
              <p>SKU: {product.sku || 'N/A'}</p>
              <p>Category: {product.category}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="container mx-auto px-4 mb-24">
        <h2 className="text-2xl font-serif font-bold mb-8">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedProducts?.filter(p => p.id !== product.id).slice(0, 4).map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
