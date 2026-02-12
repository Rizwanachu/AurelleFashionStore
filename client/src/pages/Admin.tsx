import { Navbar } from "@/components/Navbar";
import { useProducts, useCreateProduct, useDeleteProduct } from "@/hooks/use-products";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProductSchema, InsertProduct } from "@shared/schema";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export default function Admin() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: products, isLoading: productsLoading } = useProducts();
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();
  const [isOpen, setIsOpen] = useState(false);

  // Extend schema to handle strings for numbers/arrays from form
  const formSchema = insertProductSchema.extend({
    price:  z.coerce.string(), // Input is string, backend wants numeric(string)
    stock: z.coerce.number(),
    sizes: z.string().transform(str => str.split(',').map(s => s.trim())),
    colors: z.string().transform(str => str.split(',').map(s => s.trim())),
    images: z.string().transform(str => str.split(',').map(s => s.trim())),
  });

  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: any) => {
    // Manually ensure arrays for submit if transform didn't fire correctly on some edge case
    // But zod transform should handle it. 
    // We just pass it through.
    createProduct(data, {
      onSuccess: () => {
        setIsOpen(false);
        reset();
      }
    });
  };

  if (authLoading) return null;
  if (!user) {
    window.location.href = "/api/login";
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold">Product Management</h1>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" /> Add Product</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input {...register("title")} placeholder="Silk Dress" />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Input {...register("category")} placeholder="Dresses" />
                  </div>
                  <div className="space-y-2">
                    <Label>Price</Label>
                    <Input {...register("price")} placeholder="129.99" />
                  </div>
                  <div className="space-y-2">
                    <Label>Stock</Label>
                    <Input {...register("stock")} placeholder="10" />
                  </div>
                </div>
                
                <div className="space-y-2">
                   <Label>Description</Label>
                   <Input {...register("description")} placeholder="Product details..." />
                </div>

                <div className="space-y-2">
                   <Label>Images (comma separated URLs)</Label>
                   <Input {...register("images")} placeholder="https://..., https://..." />
                </div>

                <div className="space-y-2">
                   <Label>Sizes (comma separated)</Label>
                   <Input {...register("sizes")} placeholder="S, M, L" />
                </div>

                <div className="space-y-2">
                   <Label>Colors (comma separated)</Label>
                   <Input {...register("colors")} placeholder="Red, Blue, Black" />
                </div>

                <Button type="submit" className="w-full" disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create Product"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {productsLoading ? (
          <div className="flex justify-center"><Loader2 className="animate-spin" /></div>
        ) : (
          <div className="border border-border rounded-sm overflow-hidden">
             <table className="w-full text-sm text-left">
               <thead className="bg-secondary/20 text-xs uppercase font-bold">
                 <tr>
                   <th className="p-4">ID</th>
                   <th className="p-4">Product</th>
                   <th className="p-4">Category</th>
                   <th className="p-4">Price</th>
                   <th className="p-4">Stock</th>
                   <th className="p-4 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody>
                 {products?.map(product => (
                   <tr key={product.id} className="border-t border-border hover:bg-secondary/5">
                     <td className="p-4">{product.id}</td>
                     <td className="p-4 font-medium">{product.title}</td>
                     <td className="p-4">{product.category}</td>
                     <td className="p-4">${Number(product.price).toFixed(2)}</td>
                     <td className="p-4">{product.stock}</td>
                     <td className="p-4 text-right">
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         className="text-destructive hover:text-destructive/80"
                         onClick={() => {
                           if (confirm("Delete this product?")) deleteProduct(product.id);
                         }}
                       >
                         <Trash2 className="w-4 h-4" />
                       </Button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        )}
      </div>
    </div>
  );
}
