import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary/30 pt-16 pb-8 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold uppercase">The Beige.in</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Curated luxury jewelry for the modern minimalist.
            </p>
          </div>
          
          <div>
            <h4 className="font-serif font-bold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary cursor-pointer transition-colors">New Arrivals</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Dresses</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Accessories</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Sale</li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold mb-4">Help</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary cursor-pointer transition-colors">Shipping & Returns</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Size Guide</li>
              <li className="hover:text-primary cursor-pointer transition-colors">FAQ</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Contact Us</li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold mb-4">Stay in touch</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to our newsletter for exclusive offers and style updates.
            </p>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-background border border-border px-3 py-2 text-sm w-full focus:outline-none focus:border-accent"
              />
              <button className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors">
                Join
              </button>
            </form>
            <div className="flex gap-4 mt-6">
              <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
              <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
            </div>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground">
          <p>© 2024 Aurelle Fashion. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
