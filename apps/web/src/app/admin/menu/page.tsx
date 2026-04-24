"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { 
  Search, 
  Filter, 
  DollarSign, 
  Box, 
  Eye, 
  EyeOff,
  AlertCircle,
  MoreVertical,
  Check,
  LayoutGrid,
  List
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function MenuManagementPage() {
  const products = useQuery(api.admin_products.getAdminProducts);
  const categories = useQuery(api.products.getCategories);
  const toggleStock = useMutation(api.admin_products.toggleStockStatus);
  const createProduct = useMutation(api.admin_products.createProduct);
  const updateProduct = useMutation(api.admin_products.updateProduct);
  const deleteProduct = useMutation(api.admin_products.deleteProduct);
  const generateUploadUrl = useMutation(api.admin_products.generateUploadUrl);
  const updateProductImage = useMutation(api.admin_products.updateProductImage);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [isUploading, setIsUploading] = useState(false);

  const filteredProducts = products?.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || p.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!products || !categories) return <div className="p-8 animate-pulse space-y-4">{[1,2,3,4].map(i => <div key={i} className="h-20 bg-[#111] rounded-lg" />)}</div>;

  return (
    <>
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white">MENU CONTROL</h1>
          <p className="text-gray-500 font-bold text-xs tracking-widest uppercase mt-2">
            Manage Inventory & Live Pricing
          </p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-[#FFA500] text-black px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-orange-400 transition-colors"
        >
          Add Product
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
         <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
            <input 
              type="text" 
              placeholder="SEARCH PRODUCTS..."
              className="w-full bg-[#0f0f11] border border-[#1a1a1a] rounded-xl py-4 pl-12 pr-4 text-white text-xs font-bold tracking-widest uppercase focus:outline-none focus:border-[#FFA500] transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
          <select 
           className="bg-[#0f0f11] border border-[#1a1a1a] rounded-xl px-6 text-white text-xs font-bold tracking-widest uppercase focus:outline-none"
           value={selectedCategory}
           onChange={(e) => setSelectedCategory(e.target.value)}
          >
             <option value="all">ALL CATEGORIES</option>
             {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>

          <div className="flex bg-[#0f0f11] border border-[#1a1a1a] rounded-xl p-1">
             <button 
              onClick={() => setViewMode("table")}
              className={cn("p-2 rounded-lg transition-all", viewMode === "table" ? "bg-[#161618] text-[#FFA500]" : "text-gray-600 hover:text-gray-400")}
             >
                <List size={20} />
             </button>
             <button 
              onClick={() => setViewMode("grid")}
              className={cn("p-2 rounded-lg transition-all", viewMode === "grid" ? "bg-[#161618] text-[#FFA500]" : "text-gray-600 hover:text-gray-400")}
             >
                <LayoutGrid size={20} />
             </button>
          </div>
      </div>

      {viewMode === "table" ? (
        <div className="bg-[#0f0f11] border border-[#1a1a1a] rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0a0a0a] border-b border-[#1a1a1a]">
                  <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Product</th>
                  <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Category</th>
                  <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Price</th>
                  <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Stock Status</th>
                  <th className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#161618]">
                {filteredProducts?.map((p) => (
                  <tr key={p._id} className="hover:bg-[#111] transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-[#161618] rounded border border-[#222] flex items-center justify-center overflow-hidden">
                            {p.image ? <img src={p.image} className="w-full h-full object-cover" /> : <Box size={16} className="text-gray-700" />}
                         </div>
                         <div>
                            <p className="text-white font-bold text-sm tracking-tight">{p.name}</p>
                            <p className="text-gray-600 text-[10px] font-bold uppercase truncate max-w-[200px]">{p.description || "No description"}</p>
                         </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                         {categories.find(c => c._id === p.categoryId)?.name}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                       <button 
                        onClick={() => {
                          const newPrice = prompt("Enter new price:", p.price.toString());
                          if (newPrice) updatePrice({ productId: p._id, newPrice: parseFloat(newPrice) });
                        }}
                        className="text-white font-black text-sm tracking-tighter hover:text-[#FFA500] transition-colors"
                       >
                         ${p.price.toFixed(2)}
                       </button>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => toggleStock({ productId: p._id, isOutOfStock: !p.isOutOfStock })}
                        className={cn(
                          "px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest border transition-all",
                          p.isOutOfStock 
                            ? "bg-red-900/10 text-red-500 border-red-500/30 hover:bg-red-900/20" 
                            : "bg-green-900/10 text-green-500 border-green-500/30 hover:bg-green-900/20"
                        )}
                      >
                        {p.isOutOfStock ? "Out of Stock" : "In Stock"}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                       <div className="flex items-center justify-end gap-3 text-gray-600">
                          <button 
                            onClick={() => setEditingProduct(p)}
                            className="hover:text-white transition-colors"
                          >
                            <MoreVertical size={16} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {filteredProducts?.map((p) => (
             <div key={p._id} className="group bg-[#0f0f11] border border-[#1a1a1a] rounded-2xl overflow-hidden hover:border-[#FFA500]/30 transition-all flex flex-col">
                <div className="aspect-video bg-[#161618] relative overflow-hidden">
                   {p.image ? (
                     <img src={p.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-gray-700">
                        <Box size={40} />
                     </div>
                   )}
                   <button 
                    onClick={() => setEditingProduct(p)}
                    className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-md rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity"
                   >
                      <MoreVertical size={16} />
                   </button>
                   <div className="absolute bottom-3 left-3">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border",
                        p.isOutOfStock ? "bg-red-900/40 text-red-400 border-red-500/30" : "bg-green-900/40 text-green-400 border-green-500/30"
                      )}>
                        {p.isOutOfStock ? "SOLD OUT" : "AVAILABLE"}
                      </span>
                   </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                   <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-white font-black text-lg tracking-tight leading-tight">{p.name}</h4>
                        <span className="text-[#FFA500] font-black text-lg tracking-tighter">${p.price.toFixed(2)}</span>
                      </div>
                      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                        {categories.find(c => c._id === p.categoryId)?.name}
                      </p>
                      <p className="text-gray-600 text-xs font-medium mt-3 line-clamp-2">{p.description || "No description provided."}</p>
                   </div>
                   
                   <button 
                    onClick={() => toggleStock({ productId: p._id, isOutOfStock: !p.isOutOfStock })}
                    className={cn(
                      "w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                      p.isOutOfStock ? "border-[#222] text-gray-600 hover:text-white" : "border-[#FFA500]/20 text-[#FFA500] hover:bg-[#FFA500]/5"
                    )}
                   >
                      {p.isOutOfStock ? "MARK AS IN STOCK" : "MARK AS OUT OF STOCK"}
                   </button>
                </div>
             </div>
           ))}
        </div>
      )}

      {/* MODALS */}
      {(isAdding || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => { setIsAdding(false); setEditingProduct(null); }} />
          <div className="relative bg-[#0f0f11] border border-[#222] w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-[#1a1a1a]">
               <h3 className="text-white font-black uppercase tracking-widest">{isAdding ? 'Create New Product' : 'Edit Product'}</h3>
            </div>
            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get('name') as string;
                const price = parseFloat(formData.get('price') as string);
                const description = formData.get('description') as string;
                const categoryId = formData.get('categoryId') as any;
                const imageFile = (e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement)?.files?.[0];

                let finalImageUrl = editingProduct?.image || "";

                if (imageFile) {
                  setIsUploading(true);
                  const uploadUrl = await generateUploadUrl();
                  const result = await fetch(uploadUrl, {
                    method: "POST",
                    headers: { "Content-Type": imageFile.type },
                    body: imageFile,
                  });
                  const { storageId } = await result.json();
                  // For new products, we'll need to set the image after creation if we don't have a productId yet
                  // Or we can just use the storageId and get the URL
                }

                const data = {
                  name,
                  price,
                  description,
                  categoryId,
                  image: formData.get('image') as string || finalImageUrl,
                };

                if (isAdding) {
                  await createProduct(data);
                } else {
                  await updateProduct({ productId: editingProduct._id, updates: data });
                }
                setIsAdding(false);
                setEditingProduct(null);
              }}
              className="p-6 space-y-4"
            >
              <div className="space-y-2">
                <label className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Name</label>
                <input name="name" defaultValue={editingProduct?.name} required className="w-full bg-[#161618] border border-[#222] rounded-lg p-3 text-white text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Price ($)</label>
                  <input name="price" type="number" step="0.01" defaultValue={editingProduct?.price} required className="w-full bg-[#161618] border border-[#222] rounded-lg p-3 text-white text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Category</label>
                  <select name="categoryId" defaultValue={editingProduct?.categoryId} className="w-full bg-[#161618] border border-[#222] rounded-lg p-3 text-white text-sm">
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Image</label>
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-[#161618] border border-[#222] rounded-lg overflow-hidden flex items-center justify-center">
                     {(editingProduct?.image) ? <img src={editingProduct.image} className="w-full h-full object-cover" /> : <Box size={24} className="text-gray-700" />}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input 
                      type="file" 
                      accept="image/*"
                      className="hidden" 
                      id="product-image-upload"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file || !editingProduct) return;
                        
                        setIsUploading(true);
                        try {
                          const uploadUrl = await generateUploadUrl();
                          const result = await fetch(uploadUrl, {
                            method: "POST",
                            headers: { "Content-Type": file.type },
                            body: file,
                          });
                          const { storageId } = await result.json();
                          await updateProductImage({ productId: editingProduct._id, storageId });
                        } finally {
                          setIsUploading(false);
                        }
                      }}
                    />
                    <label 
                      htmlFor="product-image-upload"
                      className="inline-block bg-[#161618] border border-[#222] px-4 py-2 rounded-lg text-white text-[10px] font-bold cursor-pointer hover:border-[#FFA500]/50 transition-colors"
                    >
                      {isUploading ? "UPLOADING..." : "UPLOAD NEW PHOTO"}
                    </label>
                    <input name="image" defaultValue={editingProduct?.image} placeholder="Or paste URL here..." className="w-full bg-[#161618] border border-[#222] rounded-lg p-2 text-white text-[10px]" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Description</label>
                <textarea name="description" defaultValue={editingProduct?.description} rows={3} className="w-full bg-[#161618] border border-[#222] rounded-lg p-3 text-white text-sm" />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => { setIsAdding(false); setEditingProduct(null); }}
                  className="flex-1 bg-[#161618] text-gray-400 font-bold p-3 rounded-xl hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-[#FFA500] text-black font-black p-3 rounded-xl hover:bg-orange-400 transition-colors uppercase text-xs tracking-widest"
                >
                  {isAdding ? 'Create' : 'Save Changes'}
                </button>
              </div>

              {!isAdding && (
                <button 
                  type="button"
                  onClick={async () => {
                    if (confirm("Are you sure you want to delete this product?")) {
                      await deleteProduct({ productId: editingProduct._id });
                      setEditingProduct(null);
                    }
                  }}
                  className="w-full mt-2 text-red-500 text-[10px] font-black uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity"
                >
                  Delete Product
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
