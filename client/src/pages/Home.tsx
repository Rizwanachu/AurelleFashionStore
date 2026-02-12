import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/ProductCard";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const { data: featuredProducts } = useProducts({ featured: "true" });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[90vh] w-full bg-[#f4f2ed] overflow-hidden">
        <div className="absolute inset-0 z-0 flex">
          <div className="w-1/2 h-full relative border-r border-border">
             <img 
              src="https://images.unsplash.com/photo-1611085583191-a3b158466d0b?q=80&w=2787&auto=format&fit=crop"
              alt="Luxury Jewelry"
              className="w-full h-full object-cover grayscale-[20%]"
            />
            <div className="absolute top-12 left-12 z-20">
               <h2 className="text-4xl md:text-5xl font-serif text-white drop-shadow-sm leading-tight">
                PRODUCTS ON<br />DISCOUNT <span className="text-3xl">✦</span>
              </h2>
            </div>
          </div>
          <div className="w-1/2 h-full relative">
             <img 
              src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=2862&auto=format&fit=crop"
              alt="Curated Collection"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-12 left-12 z-20">
               <h2 className="text-4xl md:text-5xl font-serif text-white drop-shadow-sm leading-tight">
                UNDER<br /><span className="text-6xl">199</span>
              </h2>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="bg-background/80 backdrop-blur-md p-10 md:p-16 border border-border text-center pointer-events-auto"
          >
            <span className="text-muted-foreground font-medium tracking-[0.3em] text-xs uppercase mb-4 block">Collection 2026</span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground leading-tight mb-8">
              Aurelle
            </h1>
            <Link href="/shop">
              <Button size="lg" className="bg-primary text-primary-foreground hover-elevate active-elevate-2 min-w-[200px]">
                Explore Collection
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold mb-3">Shop by Category</h2>
          <p className="text-muted-foreground">Curated styles for every occasion</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Dresses', 'Tops', 'Accessories'].map((cat, i) => (
            <Link key={cat} href={`/shop?category=${cat}`}>
              <motion.div 
                whileHover={{ y: -5 }}
                className="relative aspect-[4/5] overflow-hidden cursor-pointer group bg-secondary/20"
              >
                {/* Placeholder images for categories */}
                {i === 0 && <img src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Dresses" />}
                {i === 1 && <img src="https://pixabay.com/get/g9145ff7429231791be3c062fe0c49624c221db23f07c8a9fcdfa0b50a9662694538bc779fce97c744e4c3c1f792fda53b6cc181a6a08ee107a9c33d96fc4e93c_1280.jpg" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Tops" />}
                {i === 2 && <img src="https://pixabay.com/get/g9145ff7429231791be3c062fe0c49624c221db23f07c8a9fcdfa0b50a9662694538bc779fce97c744e4c3c1f792fda53b6cc181a6a08ee107a9c33d96fc4e93c_1280.jpg" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="Accessories" />}
                
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white text-3xl font-serif font-bold tracking-wide border-b-2 border-transparent group-hover:border-white transition-all pb-1">
                    {cat}
                  </h3>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-secondary/20 py-24">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-2">Editor's Picks</h2>
              <p className="text-muted-foreground">Hand-selected favorites just for you.</p>
            </div>
            <Link href="/shop">
              <Button variant="link" className="text-black group">
                View All <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts?.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {!featuredProducts?.length && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                Loading collection...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Brand Values / Trust */}
      <section className="py-24 border-t border-border">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-secondary rounded-full mx-auto flex items-center justify-center text-xl">✨</div>
            <h3 className="font-serif font-bold text-lg">Premium Quality</h3>
            <p className="text-muted-foreground text-sm">Finest materials sourced responsibly from around the globe.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-secondary rounded-full mx-auto flex items-center justify-center text-xl">🌿</div>
            <h3 className="font-serif font-bold text-lg">Sustainable</h3>
            <p className="text-muted-foreground text-sm">Eco-friendly production processes that respect the planet.</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-secondary rounded-full mx-auto flex items-center justify-center text-xl">🚚</div>
            <h3 className="font-serif font-bold text-lg">Fast Shipping</h3>
            <p className="text-muted-foreground text-sm">Complimentary shipping on all international orders over $150.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
