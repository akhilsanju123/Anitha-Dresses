'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../../components/admin/AdminSidebar';
import Image from 'next/image';
import { Category, Brand, Product } from '../../../types';
import { Plus, Edit, Trash2, X, Upload } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('anitha_admin_token') : '';
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
  };

  const fetchInitialData = async () => {
    try {
      const [resProd, resCat, resBrand] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
        fetch('/api/brands'),
      ]);

      const jsonProd = await resProd.json();
      if (jsonProd.success) {
        const prodArray = Array.isArray(jsonProd.data) ? jsonProd.data : (jsonProd.data?.products || []);
        setProducts(prodArray);
      }

      const jsonCat = await resCat.json();
      if (jsonCat.success && Array.isArray(jsonCat.data)) {
        setCategories(jsonCat.data);
      }

      const jsonBrand = await resBrand.json();
      if (jsonBrand.success && Array.isArray(jsonBrand.data)) {
        setBrands(jsonBrand.data);
      }
    } catch (e) {
      console.warn("Failed fetching admin product data:", e);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingImage(true);

    const uploadedUrls: string[] = [...(editingProduct?.images || [])];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      await new Promise<void>((resolve) => {
        reader.onloadend = async () => {
          const base64 = reader.result as string;
          try {
            const res = await fetch('/api/upload', {
              method: 'POST',
              headers: getAuthHeaders(),
              body: JSON.stringify({ image: base64, folder: 'anitha_products' }),
            });
            const json = await res.json();
            if (json.success && json.data?.url) {
              uploadedUrls.push(json.data.url);
            } else {
              uploadedUrls.push(base64);
            }
          } catch (err) {
            uploadedUrls.push(base64);
          }
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }

    setEditingProduct(prev => prev ? { ...prev, images: uploadedUrls } : { images: uploadedUrls });
    setUploadingImage(false);
  };

  const handleRemoveImage = (index: number) => {
    if (!editingProduct?.images) return;
    const updated = editingProduct.images.filter((_, i) => i !== index);
    setEditingProduct({ ...editingProduct, images: updated });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.offerPrice) {
      alert("Please fill Product Name and Selling Price.");
      return;
    }

    const payload = {
      ...editingProduct,
      id: editingProduct.id || `prod-${Date.now()}`,
      name: editingProduct.name,
      slug: editingProduct.slug || editingProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: editingProduct.category || categories[0]?.name || 'MEN',
      subcategory: editingProduct.subcategory || categories[0]?.subcategories[0] || 'Shirts',
      brand: editingProduct.brand || brands[0]?.name || 'Anitha Exclusive',
      price: Number(editingProduct.offerPrice),
      offerPrice: Number(editingProduct.offerPrice),
      mrp: Number(editingProduct.mrp || editingProduct.offerPrice),
      sku: editingProduct.sku || `AD-${Math.floor(100000 + Math.random() * 900000)}`,
      description: editingProduct.description || 'Premium fashion apparel from ANITHA DRESSES.',
      images: editingProduct.images?.length ? editingProduct.images : ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900&auto=format&fit=crop&q=85'],
      sizes: editingProduct.sizes?.length ? editingProduct.sizes : ['M', 'L', 'XL'],
      colors: editingProduct.colors?.length ? editingProduct.colors : [{ name: 'Standard', hex: '#D4AF37' }],
      variants: editingProduct.variants || [{ size: 'L', color: 'Standard', stock: Number(editingProduct.stock || 10) }],
      stock: Number(editingProduct.stock || 10),
      lowStockThreshold: 5,
      labels: editingProduct.labels || ['new'],
      featured: editingProduct.featured !== undefined ? editingProduct.featured : true,
      bestSeller: editingProduct.bestSeller || false,
      newArrival: true,
      rating: 4.8,
      reviewsCount: 1,
    };

    setLoading(true);

    try {
      if (editingProduct.id) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!json.success) alert(json.message || "Failed to update product.");
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!json.success) alert(json.message || "Failed to create product.");
      }
      await fetchInitialData();
    } catch (err: any) {
      alert("Error saving product to MongoDB. Please try again.");
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Are you sure you want to delete this product from MongoDB?")) {
      try {
        const res = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });
        const json = await res.json();
        if (json.success) {
          await fetchInitialData();
        } else {
          alert(json.message || "Failed to delete product.");
        }
      } catch (err) {
        alert("Error deleting product.");
      }
    }
  };

  const selectedCatObj = categories.find(c => c.name.toLowerCase() === (editingProduct?.category || '').toLowerCase()) || categories[0];

  return (
    <div className="flex min-h-screen bg-maroon-950 text-gold-100">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-amber-500/20 pb-4 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white font-serif">Product Management (MongoDB CRUD)</h1>
            <p className="text-xs text-amber-200/70">Add, edit, and delete products directly in MongoDB.</p>
          </div>

          <button
            onClick={() => {
              const defaultCat = categories[0]?.name || 'MEN';
              const defaultSub = categories[0]?.subcategories[0] || 'Shirts';
              const defaultBrand = brands[0]?.name || 'Anitha Exclusive';
              setEditingProduct({
                category: defaultCat,
                subcategory: defaultSub,
                brand: defaultBrand,
                images: [],
                stock: 15,
                offerPrice: 1299,
                mrp: 1899,
              });
              setIsModalOpen(true);
            }}
            className="bg-gradient-to-r from-amber-400 to-amber-600 text-maroon-950 font-bold px-4 py-2.5 rounded-xl hover:brightness-110 transition flex items-center gap-2 text-xs shadow-lg self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-maroon-900/60 rounded-2xl border border-amber-500/30 overflow-x-auto shadow-luxury">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-maroon-950 text-amber-300 border-b border-amber-500/20 font-bold">
                <th className="p-3.5">Image</th>
                <th className="p-3.5">Product Name</th>
                <th className="p-3.5">Category / Subcategory</th>
                <th className="p-3.5">Price</th>
                <th className="p-3.5">SKU / Stock</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-500/10 text-gold-200">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-amber-300 font-serif">
                    No products in MongoDB database. Click "Add New Product" to create one.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-amber-500/5 transition">
                    <td className="p-3.5">
                      <div className="relative w-12 h-14 rounded-lg overflow-hidden border border-amber-500/20 bg-maroon-950">
                        <Image src={p.images[0] || 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80'} alt={p.name} fill className="object-cover" />
                      </div>
                    </td>
                    <td className="p-3.5">
                      <p className="font-bold text-white">{p.name}</p>
                      <p className="text-[10px] text-gray-400">{p.brand}</p>
                    </td>
                    <td className="p-3.5">
                      <span className="bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20 inline-block font-semibold">
                        {p.category}
                      </span>
                      <p className="text-[10px] text-gray-300 mt-0.5">{p.subcategory || 'General'}</p>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-amber-300">
                      ₹{p.offerPrice} <span className="text-[10px] text-gray-400 line-through">₹{p.mrp}</span>
                    </td>
                    <td className="p-3.5 font-mono">
                      <p className="text-gray-300">{p.sku}</p>
                      <span className={`text-[10px] font-bold ${p.stock <= 5 ? 'text-red-400' : 'text-emerald-400'}`}>
                        Stock: {p.stock}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingProduct(p);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 bg-maroon-950 hover:bg-amber-500/20 text-amber-300 rounded-lg border border-amber-500/30"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 bg-maroon-950 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/30"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Product Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>

            <form onSubmit={handleSaveProduct} className="relative w-full max-w-3xl bg-maroon-950 text-gold-100 rounded-3xl border border-amber-500/40 p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto z-10">
              <div className="flex justify-between items-center border-b border-amber-500/20 pb-3">
                <h3 className="font-bold text-base text-amber-300">
                  {editingProduct?.id ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-gold-300 hover:text-amber-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block text-amber-200 font-semibold mb-1">Product Title: <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Silk Anarkali Long Dress"
                    value={editingProduct?.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full bg-maroon-900 border border-amber-500/30 rounded-xl p-3 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-amber-200 font-semibold mb-1">Main Category:</label>
                  <select
                    value={editingProduct?.category || categories[0]?.name || 'MEN'}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      const catObj = categories.find(c => c.name === newCat);
                      setEditingProduct({
                        ...editingProduct,
                        category: newCat,
                        subcategory: catObj?.subcategories[0] || 'General'
                      });
                    }}
                    className="w-full bg-maroon-900 border border-amber-500/30 rounded-xl p-3 text-amber-300 font-bold focus:outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id || c.slug} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-amber-200 font-semibold mb-1">Subcategory:</label>
                  <select
                    value={editingProduct?.subcategory || (selectedCatObj?.subcategories[0] || 'General')}
                    onChange={(e) => setEditingProduct({ ...editingProduct, subcategory: e.target.value })}
                    className="w-full bg-maroon-900 border border-amber-500/30 rounded-xl p-3 text-amber-300 font-bold focus:outline-none"
                  >
                    {(selectedCatObj?.subcategories || ['General']).map((sub, sIdx) => (
                      <option key={sIdx} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-amber-200 font-semibold mb-1">Brand:</label>
                  <select
                    value={editingProduct?.brand || (brands[0]?.name || 'Anitha Exclusive')}
                    onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                    className="w-full bg-maroon-900 border border-amber-500/30 rounded-xl p-3 text-amber-300 font-bold focus:outline-none"
                  >
                    {brands.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-amber-200 font-semibold mb-1">SKU Code:</label>
                  <input
                    type="text"
                    placeholder="e.g. AD-MEN-01"
                    value={editingProduct?.sku || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full bg-maroon-900 border border-amber-500/30 rounded-xl p-3 text-white font-mono uppercase focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-amber-200 font-semibold mb-1">Selling Price (₹): <span className="text-red-400">*</span></label>
                  <input
                    type="number"
                    required
                    value={editingProduct?.offerPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, offerPrice: Number(e.target.value), price: Number(e.target.value) })}
                    className="w-full bg-maroon-900 border border-amber-500/30 rounded-xl p-3 text-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-amber-200 font-semibold mb-1">MRP Price (₹):</label>
                  <input
                    type="number"
                    value={editingProduct?.mrp || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, mrp: Number(e.target.value) })}
                    className="w-full bg-maroon-900 border border-amber-500/30 rounded-xl p-3 text-white font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-amber-200 font-semibold mb-1">Stock Quantity: <span className="text-red-400">*</span></label>
                  <input
                    type="number"
                    required
                    value={editingProduct?.stock || 10}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full bg-maroon-900 border border-amber-500/30 rounded-xl p-3 text-white font-mono focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-amber-200 font-semibold mb-1">Description:</label>
                  <textarea
                    rows={3}
                    value={editingProduct?.description || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full bg-maroon-900 border border-amber-500/30 rounded-xl p-3 text-white focus:outline-none"
                  ></textarea>
                </div>
              </div>

              {/* Product Images Upload Box */}
              <div className="space-y-3 pt-2 border-t border-amber-500/20">
                <label className="block text-xs font-bold text-amber-300">Product Images (Cloudinary Upload):</label>
                
                <div className="grid grid-cols-4 gap-3">
                  {editingProduct?.images?.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-amber-500/30 group">
                      <Image src={url} alt={`Image ${i}`} fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-90 hover:opacity-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  <label className="border-2 border-dashed border-amber-500/40 hover:border-amber-400 rounded-xl aspect-square flex flex-col items-center justify-center cursor-pointer bg-maroon-900/50 transition">
                    <Upload className="w-6 h-6 text-amber-400" />
                    <span className="text-[10px] text-amber-200 font-bold mt-1">
                      {uploadingImage ? 'Uploading...' : 'Upload Image'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-amber-500/20 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-maroon-900 text-gold-200 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || uploadingImage}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-600 text-maroon-950 font-bold rounded-xl text-xs shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Saving to MongoDB...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
