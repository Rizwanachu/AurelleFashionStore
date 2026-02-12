import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/hooks/use-cart";
import { useCreateOrder } from "@/hooks/use-orders";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

// Schema for shipping form
const checkoutSchema = z.object({
  fullName: z.string().min(2, "Name required"),
  email: z.string().email(),
  street: z.string().min(5, "Address required"),
  city: z.string().min(2, "City required"),
  state: z.string().min(2, "State required"),
  zip: z.string().min(5, "ZIP required"),
  paymentMethod: z.enum(["card", "cod"]),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { data: cartItems } = useCart();
  const { mutate: createOrder, isPending } = useCreateOrder();

  const { register, handleSubmit, formState: { errors }, watch } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "card"
    }
  });

  const subtotal = cartItems?.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0) || 0;
  const shipping = subtotal > 150 ? 0 : 15;
  const total = subtotal + shipping;

  const onSubmit = (data: CheckoutForm) => {
    createOrder({
      total: total.toString(),
      status: "pending",
      shippingAddress: {
        name: data.fullName,
        street: data.street,
        city: data.city,
        state: data.state,
        zip: data.zip
      },
      paymentMethod: data.paymentMethod,
      items: cartItems?.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
        size: item.size,
        color: item.color
      })) || [],
    }, {
      onSuccess: () => {
        setLocation("/profile");
      }
    });
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
         Redirecting to cart... {setTimeout(() => setLocation("/cart"), 1000) && ""}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif font-bold mb-8 text-center">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Shipping Form */}
          <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            <div className="space-y-4">
              <h2 className="text-xl font-serif font-bold pb-2 border-b border-border">Shipping Address</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" {...register("fullName")} className="mt-1" />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register("email")} className="mt-1" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div className="col-span-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input id="street" {...register("street")} className="mt-1" />
                  {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>}
                </div>

                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" {...register("city")} className="mt-1" />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input id="state" {...register("state")} className="mt-1" />
                    {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input id="zip" {...register("zip")} className="mt-1" />
                    {errors.zip && <p className="text-red-500 text-xs mt-1">{errors.zip.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-serif font-bold pb-2 border-b border-border">Payment Method</h2>
              
              <RadioGroup defaultValue="card" onValueChange={(val) => {
                 // Manual handling if needed, or rely on form hook if integrated well.
                 // RadioGroup from shadcn might need Controller from react-hook-form to work perfectly,
                 // but for simplicity we'll just let native inputs bubble up or use a hidden input.
                 // Actually standard shadcn RadioGroup works best with Controller.
              }} >
                {/* Simplified for generation without complex Controller wiring */}
                <div className="flex items-center space-x-2 border p-4 rounded-sm border-border">
                  <input type="radio" value="card" id="card" {...register("paymentMethod")} className="accent-black" />
                  <Label htmlFor="card" className="flex-1 cursor-pointer">Credit Card (Razorpay Mock)</Label>
                </div>
                <div className="flex items-center space-x-2 border p-4 rounded-sm border-border">
                  <input type="radio" value="cod" id="cod" {...register("paymentMethod")} className="accent-black" />
                  <Label htmlFor="cod" className="flex-1 cursor-pointer">Cash on Delivery</Label>
                </div>
              </RadioGroup>
            </div>
          </form>

          {/* Summary */}
          <div className="bg-secondary/20 p-8 h-fit">
             <h2 className="text-xl font-serif font-bold mb-6">Your Order</h2>
             <div className="space-y-4 mb-6">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.product.title} x {item.quantity}</span>
                    <span>${(Number(item.product.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
             </div>
             
             <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
             </div>

             <Button 
               className="w-full mt-8" 
               size="lg" 
               type="submit" 
               form="checkout-form"
               disabled={isPending}
             >
               {isPending ? <><Loader2 className="animate-spin mr-2" /> Processing...</> : "Place Order"}
             </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
