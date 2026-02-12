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
      <section className="relative h-[85vh] w-full bg-[#f4f2ed] overflow-hidden">
        {/* Abstract/Fashion Hero Image */}
        {/* Unsplash: Aesthetic minimal fashion shot with neutral tones */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
            alt="Hero Fashion"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-start">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl space-y-6"
          >
            <span className="text-white font-medium tracking-[0.2em] text-sm uppercase">New Collection 2024</span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight">
              Quiet Luxury <br /> Redefined
            </h1>
            <p className="text-white/90 text-lg font-light max-w-md">
              Discover our latest curation of timeless essentials crafted for the modern individual.
            </p>
            <Link href="/shop">
              <Button size="lg" className="bg-white text-black hover:bg-white/90 mt-4 border-0">
                Shop Collection
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
