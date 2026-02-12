import { Link, useLocation } from "wouter";
import { ShoppingBag, Search, User, Menu, X } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export function Navbar() {
  const [location] = useLocation();
  const { data: cart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const cartCount = cart?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const links = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/shop?category=New", label: "New Arrivals" },
    { href: "/about", label: "About" },
  ];

  const handleLinkClick = () => setIsOpen(false);

  return (
    <>
      <div className="bg-primary text-primary-foreground text-xs text-center py-2 tracking-widest uppercase">
        Free Shipping on orders over $150
      </div>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          
          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] pt-12">
                <nav className="flex flex-col gap-6">
                  {links.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <div 
                        className="text-lg font-serif cursor-pointer hover:text-accent transition-colors"
                        onClick={handleLinkClick}
                      >
                        {link.label}
                      </div>
                    </Link>
                  ))}
                  {isAuthenticated && (
                    <Link href="/profile">
                       <div className="text-lg font-serif cursor-pointer hover:text-accent transition-colors" onClick={handleLinkClick}>
                         My Account
                       </div>
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className={location === link.href ? "text-accent" : "hover:text-accent transition-colors"}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <h1 className="text-2xl font-serif font-bold tracking-tight cursor-pointer uppercase">The Beige.in</h1>
          </Link>

          {/* Icons */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="h-5 w-5" />
            </Button>
            
            {isAuthenticated ? (
              <Link href="/profile">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <a href="/api/login">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </a>
            )}

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
