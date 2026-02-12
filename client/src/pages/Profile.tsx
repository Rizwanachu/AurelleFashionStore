import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/use-auth";
import { useOrders } from "@/hooks/use-orders";
import { Button } from "@/components/ui/button";
import { Loader2, Package, User } from "lucide-react";
import { Link } from "wouter";

export default function Profile() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const { data: orders, isLoading: ordersLoading } = useOrders();

  if (authLoading || ordersLoading) return <div className="min-h-screen flex justify-center items-center"><Loader2 className="animate-spin" /></div>;
  if (!user) {
    window.location.href = "/api/login";
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-6">
            <div className="flex items-center gap-4 p-4 bg-secondary/20 rounded-sm">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-xl font-bold">
                {user.firstName?.[0] || user.email?.[0] || 'U'}
              </div>
              <div>
                <p className="font-bold">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            
            <nav className="space-y-1">
              <Button variant="ghost" className="w-full justify-start font-medium bg-secondary/10">
                <Package className="w-4 h-4 mr-2" /> My Orders
              </Button>
              <Button variant="ghost" className="w-full justify-start font-medium">
                <User className="w-4 h-4 mr-2" /> Account Details
              </Button>
              <Link href="/admin">
                 <Button variant="ghost" className="w-full justify-start font-medium text-muted-foreground">
                   Admin Dashboard
                 </Button>
              </Link>
            </nav>

            <Button variant="outline" className="w-full" onClick={() => logout()}>
              Log Out
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h1 className="text-2xl font-serif font-bold mb-6">Order History</h1>
            
            <div className="space-y-6">
              {!orders || orders.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-border rounded-sm">
                  <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                  <Link href="/shop">
                    <Button>Start Shopping</Button>
                  </Link>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="border border-border p-6 rounded-sm">
                    <div className="flex flex-wrap justify-between items-center mb-4 pb-4 border-b border-border">
                      <div>
                        <p className="font-bold">Order #{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt!).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${Number(order.total).toFixed(2)}</p>
                        <span className="inline-block px-2 py-1 bg-secondary/30 text-xs uppercase tracking-wider rounded-sm">
                          {order.status}
                        </span>
                      </div>
                    </div>
                    {/* Add logic to show items if backend provided them, currently list only returns order summaries usually */}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
