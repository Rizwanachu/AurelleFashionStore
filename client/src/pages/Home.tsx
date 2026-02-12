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
  const { data: allProducts } = useProducts();

  const collections = [
    { title: "Necklaces", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=2787&auto=format&fit=crop" },
    { title: "Rings", image: "https://images.unsplash.com/photo-1611085583191-a3b158466d0b?q=80&w=2787&auto=format&fit=crop" },
    { title: "Earrings", image: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=2864&auto=format&fit=crop" },
    { title: "Bracelets", image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=2862&auto=format&fit=crop" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full flex items-center overflow-hidden">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-foreground leading-tight uppercase tracking-tighter">
              STYLED IN OUR<br />
              <span className="text-primary italic">TEAR DROP EARRING</span>
            </h1>
            <div className="flex gap-4">
              <Link href="/shop">
                <Button size="lg" className="rounded-full px-8 hover-elevate">
                  Shop All Collections
                </Button>
              </Link>
            </div>
          </motion.div>
          <div className="relative">
             <motion.img 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2850&auto=format&fit=crop"
              alt="Model wearing jewelry"
              className="w-full h-auto rounded-3xl object-cover"
            />
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary/30 -z-10" />
      </section>

      {/* Collections Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-sm font-sans tracking-[0.3em] uppercase text-muted-foreground mb-4">Collections</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {collections.map((item, i) => (
            <Link key={i} href={`/shop?category=${item.title}`}>
              <div className="group cursor-pointer">
                <div className="aspect-square overflow-hidden rounded-2xl bg-secondary mb-4 relative">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-center font-serif text-sm tracking-widest uppercase">{item.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-20 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-sm font-sans tracking-[0.3em] uppercase text-muted-foreground mb-4">New Arrivals</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {allProducts?.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/shop">
              <Button variant="link" className="text-xs uppercase tracking-widest border-b border-foreground rounded-none px-0 h-auto pb-1">
                Shop All →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative aspect-square md:aspect-video rounded-3xl overflow-hidden group cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1611085583191-a3b158466d0b?q=80&w=2787&auto=format&fit=crop" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              alt="Promo 1" 
            />
            <div className="absolute inset-0 bg-black/10 flex flex-col justify-center p-12">
              <h3 className="text-white text-4xl font-serif mb-4">PRODUCTS ON<br />DISCOUNT ✦</h3>
            </div>
          </div>
          <div className="relative aspect-square md:aspect-video rounded-3xl overflow-hidden group cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=2862&auto=format&fit=crop" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              alt="Promo 2" 
            />
            <div className="absolute inset-0 bg-black/10 flex flex-col justify-center p-12">
              <h3 className="text-white text-4xl font-serif mb-4">UNDER<br /><span className="text-6xl">199</span></h3>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-sm font-sans tracking-[0.3em] uppercase text-muted-foreground mb-4">Best Sellers</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {allProducts?.slice(2, 5).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/shop">
              <Button variant="link" className="text-xs uppercase tracking-widest border-b border-foreground rounded-none px-0 h-auto pb-1">
                Shop All →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
