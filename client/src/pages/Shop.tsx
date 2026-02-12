import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

export default function Shop() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const category = searchParams.get("category") || undefined;
  const search = searchParams.get("search") || undefined;

  const { data: products, isLoading } = useProducts({ category, search });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-secondary/30 py-12 mb-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-serif font-bold mb-3">
            {category ? category : "All Products"}
          </h1>
          <div className="text-sm breadcrumbs text-muted-foreground">
            Home / Shop {category && `/ ${category}`}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mb-24 flex-1">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 space-y-8 sticky top-24 self-start h-fit hidden md:block">
            <div>
              <h3 className="font-serif font-bold mb-4">Categories</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="cursor-pointer hover:text-primary transition-colors">All Products</li>
                <li className="cursor-pointer hover:text-primary transition-colors">Dresses</li>
                <li className="cursor-pointer hover:text-primary transition-colors">Tops</li>
                <li className="cursor-pointer hover:text-primary transition-colors">Bottoms</li>
                <li className="cursor-pointer hover:text-primary transition-colors">Accessories</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-serif font-bold mb-4">Price</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="cursor-pointer hover:text-primary transition-colors">Under $50</li>
                <li className="cursor-pointer hover:text-primary transition-colors">$50 - $100</li>
                <li className="cursor-pointer hover:text-primary transition-colors">$100 - $200</li>
                <li className="cursor-pointer hover:text-primary transition-colors">$200+</li>
              </ul>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin w-8 h-8 text-muted-foreground" />
              </div>
            ) : products?.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                No products found.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {products?.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
