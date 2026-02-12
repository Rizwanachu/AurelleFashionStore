import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart, useRemoveCartItem, useUpdateCartItem } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Loader2, Trash2, Minus, Plus, ArrowRight } from "lucide-react";

export default function Cart() {
  const { data: cartItems, isLoading } = useCart();
  const { mutate: removeItem } = useRemoveCartItem();
  const { mutate: updateItem } = useUpdateCartItem();

  const subtotal = cartItems?.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0) || 0;
  const shipping = subtotal > 150 ? 0 : 15;
  const total = subtotal + shipping;

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-12 flex-1">
        <h1 className="text-4xl font-serif font-bold mb-8 text-center">Your Bag</h1>

        {!cartItems || cartItems.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <p className="text-muted-foreground text-lg">Your shopping bag is empty.</p>
            <Link href="/shop">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Cart Items List */}
            <div className="flex-1 space-y-8">
              <div className="hidden md:grid grid-cols-12 text-sm text-muted-foreground border-b border-border pb-4 uppercase tracking-wider">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {cartItems.map((item) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-b border-border pb-8">
                  <div className="col-span-6 flex gap-4">
                    <div className="w-24 h-32 bg-secondary/20 flex-shrink-0">
                      <img src={item.product.images[0]} alt={item.product.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col justify-between py-1">
                      <div>
                        <Link href={`/product/${item.product.id}`} className="font-serif font-medium text-lg hover:underline">
                          {item.product.title}
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.color} / {item.size}
                        </p>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-sm text-muted-foreground hover:text-destructive flex items-center gap-1 w-fit transition-colors"
                      >
                        <Trash2 className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  </div>

                  <div className="col-span-2 text-center hidden md:block">
                    ${Number(item.product.price).toFixed(2)}
                  </div>

                  <div className="col-span-2 flex justify-center">
                    <div className="flex items-center border border-border h-10 w-24">
                      <button 
                        className="flex-1 h-full flex items-center justify-center hover:bg-secondary/50"
                        onClick={() => updateItem({ id: item.id, quantity: Math.max(1, item.quantity - 1) })}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm w-6 text-center">{item.quantity}</span>
                      <button 
                        className="flex-1 h-full flex items-center justify-center hover:bg-secondary/50"
                        onClick={() => updateItem({ id: item.id, quantity: item.quantity + 1 })}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="col-span-2 text-right font-medium hidden md:block">
                    ${(Number(item.product.price) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-96 bg-secondary/20 p-8 h-fit">
              <h2 className="font-serif text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                {shipping === 0 && (
                  <div className="text-xs text-accent italic">Free shipping applied</div>
                )}
                <div className="border-t border-border pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Link href="/checkout">
                <Button className="w-full h-12 text-base" size="lg">
                  Proceed to Checkout <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
