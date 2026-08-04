'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useShopStore } from '../../../lib/store';
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  Share2, 
  MessageCircle, 
  Truck, 
  ShieldCheck, 
  Ban, 
  Check
} from 'lucide-react';
import ProductCard from '../../../components/product/ProductCard';
import ShareModal from '../../../components/common/ShareModal';
import ProductReviews from '../../../components/product/ProductReviews';
import { generateProductWhatsAppEnquiry } from '../../../lib/notifications';
import { Product, SizeOption } from '../../../types';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { addToCart, wishlist, toggleWishlist } = useShopStore();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<SizeOption>('M');
  const [selectedColor, setSelectedColor] = useState<string>('Standard');
  const [quantity, setQuantity] = useState(1);
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const resSingle = await fetch(`/api/products/${id}`, { cache: 'no-store' });
        const jsonSingle = await resSingle.json();
        if (jsonSingle.success && jsonSingle.data) {
          const prodData: Product = jsonSingle.data;
          setProduct(prodData);
          if (prodData.sizes && prodData.sizes.length > 0) {
            setSelectedSize(prodData.sizes[0]);
          }
          if (prodData.colors && prodData.colors.length > 0) {
            setSelectedColor(prodData.colors[0].name);
          }
        }

        const resAll = await fetch('/api/products', { cache: 'no-store' });
        const jsonAll = await resAll.json();
        if (jsonAll.success) {
          const list = Array.isArray(jsonAll.data) ? jsonAll.data : (jsonAll.data?.products || []);
          setAllProducts(list);
        }
      } catch (err) {
        console.warn("Failed fetching product details", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadData();
  }, [id]);

  if (loading || !product) {
    return (
      <div className="py-24 bg-maroon-950 text-gold-100 min-h-screen text-center flex items-center justify-center font-serif text-sm">
        {loading ? 'Loading product details...' : 'Product not found.'}
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);
  const discountPercent = Math.round(((product.mrp - product.offerPrice) / product.mrp) * 100);

  const currentVariant = product.variants?.find(
    v => v.size === selectedSize && v.color === selectedColor
  );
  const availableStock = currentVariant ? currentVariant.stock : product.stock;

  const whatsappEnquiryUrl = generateProductWhatsAppEnquiry(
    product,
    selectedSize,
    selectedColor
  );

  const relatedProducts = allProducts.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="py-12 bg-maroon-950 text-gold-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Links */}
        <nav className="flex items-center space-x-2 text-xs text-amber-200/70 mb-8 font-serif">
          <Link href="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-white">Shop</Link>
          <span>/</span>
          <span className="text-amber-400 font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Details Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-maroon-900/60 p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-2xl">
          
          {/* Left: Multi-Image Gallery */}
          <div className="space-y-4">
            {/* Main Active Image with Zoom effect */}
            <div className="relative h-[450px] sm:h-[550px] w-full rounded-2xl overflow-hidden border-2 border-amber-500/30 shadow-luxury bg-maroon-950 group">
              <Image
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                fill
                priority
                className="object-cover group-hover:scale-125 transition-transform duration-500 cursor-zoom-in"
              />
              {discountPercent > 0 && (
                <span className="absolute top-4 left-4 bg-amber-400 text-maroon-950 font-black text-xs uppercase px-3 py-1 rounded-full shadow">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Row */}
            <div className="grid grid-cols-6 gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition ${
                    selectedImageIndex === idx ? 'border-amber-400 ring-2 ring-amber-400/50 scale-105' : 'border-amber-500/20 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt="Thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Specifications & Purchasing Controls */}
          <div className="space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  {product.category} {product.subcategory ? `• ${product.subcategory}` : ''}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="p-2 rounded-full bg-maroon-950 border border-amber-500/30 text-gold-200 hover:text-amber-400 transition"
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>

                  <button
                    onClick={() => setIsShareOpen(true)}
                    className="p-2 rounded-full bg-maroon-950 border border-amber-500/30 text-gold-200 hover:text-amber-400 transition"
                    aria-label="Share Product"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white font-serif mt-3">{product.name}</h1>

              {/* Rating & Brand */}
              <div className="flex items-center gap-4 text-xs mt-3 pt-3 border-t border-amber-500/10">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-bold text-gold-100">{product.rating}</span>
                  <span className="text-gray-400">({product.reviewsCount} reviews)</span>
                </div>
                {product.brand && (
                  <span className="text-amber-200">Brand: <strong>{product.brand}</strong></span>
                )}
                <span className="text-gray-400 font-mono">SKU: {product.sku}</span>
              </div>

              {/* Pricing Box */}
              <div className="flex items-baseline gap-4 mt-4 bg-maroon-950/80 p-4 rounded-2xl border border-amber-500/20">
                <span className="text-3xl font-black text-amber-300">₹{product.offerPrice}</span>
                <span className="text-base text-gray-400 line-through">₹{product.mrp}</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  You Save ₹{product.mrp - product.offerPrice}!
                </span>
              </div>

              {/* Stock Status Badge */}
              <div className="mt-4">
                {availableStock > 0 ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                    <Check className="w-4 h-4" /> In Stock ({availableStock} units left)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/30">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-6">
                  <label className="block text-xs font-bold text-gold-200 mb-2">Select Size:</label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
                          selectedSize === sz
                            ? 'bg-amber-400 text-maroon-950 border-amber-400 shadow-md'
                            : 'bg-maroon-950 text-gold-200 border-amber-500/30 hover:border-amber-400'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-4">
                  <label className="block text-xs font-bold text-gold-200 mb-2">Select Color:</label>
                  <div className="flex gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${
                          selectedColor === c.name ? 'border-amber-400 bg-amber-500/20 text-amber-300' : 'border-amber-500/20 text-gold-200'
                        }`}
                      >
                        <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: c.hex }}></span>
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mt-4 flex items-center gap-3">
                <label className="text-xs font-bold text-gold-200">Quantity:</label>
                <div className="flex items-center border border-amber-500/30 rounded-xl overflow-hidden bg-maroon-950">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-sm text-gold-200 hover:bg-amber-500/20"
                  >
                    -
                  </button>
                  <span className="px-4 text-xs font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-sm text-gold-200 hover:bg-amber-500/20"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* CTA Buttons Row */}
            <div className="space-y-3 pt-6 border-t border-amber-500/20">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  disabled={availableStock <= 0}
                  onClick={() => addToCart(product, selectedSize, selectedColor, quantity)}
                  className="w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-maroon-950 font-extrabold py-3.5 rounded-xl hover:brightness-110 transition flex items-center justify-center gap-2 shadow-xl text-sm disabled:opacity-50"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>

                <a
                  href={whatsappEnquiryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-500 transition flex items-center justify-center gap-2 shadow-xl text-sm border border-emerald-400/30"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp Inquiry</span>
                </a>
              </div>
            </div>

            {/* Delivery & Value Badges */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-amber-500/10 text-[11px] text-center text-amber-200/80 font-serif">
              <div className="p-2 bg-maroon-950/60 rounded-xl border border-amber-500/10">
                <Truck className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <span>Express Delivery</span>
              </div>
              <div className="p-2 bg-maroon-950/60 rounded-xl border border-amber-500/10">
                <ShieldCheck className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <span>100% Pure Fabric</span>
              </div>
              <div className="p-2 bg-maroon-950/60 rounded-xl border border-amber-500/10">
                <Ban className="w-4 h-4 text-red-400 mx-auto mb-1" />
                <span>No Exchange</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Reviews */}
        <div className="mt-12">
          <ProductReviews productId={product.id} />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-white font-serif mb-6">Related Products</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Share Modal Popup */}
      <ShareModal
        product={product}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
    </div>
  );
}
