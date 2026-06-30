'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    slug: string;
    thumbnail: string;
    price: number;
    salePrice: number;
    discountPercentage: number;
    isBestSeller?: boolean;
    isNewArrival?: boolean;
    isOnSale?: boolean;
    stock: number;
    variants?: any[];
  };
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, isInWishlist, addToCart } = useCart();
  const favorite = isInWishlist(product._id);

  const displayPrice = product.salePrice > 0 ? product.salePrice : product.price;
  const originalPrice = product.price;
  const hasDiscount = product.salePrice > 0 && product.salePrice < product.price;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Default variant if exists, otherwise normal item
    const defaultVariant = product.variants && product.variants.length > 0
      ? {
          size: product.variants[0].size,
          colorName: product.variants[0].colorName,
          colorHex: product.variants[0].colorHex,
          sku: product.variants[0].sku,
          priceAdjustment: product.variants[0].priceAdjustment || 0
        }
      : undefined;

    addToCart({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      thumbnail: product.thumbnail,
      quantity: 1,
      price: product.price,
      salePrice: product.salePrice,
      selectedVariant: defaultVariant
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product._id);
  };

  return (
    <div className="group relative bg-slate-900/60 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10 hover:border-purple-500/35 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300 flex flex-col h-full">
      {/* Image and Badges */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-[4/5] bg-purple-950/20 overflow-hidden">
        <Image
          src={product.thumbnail || '/placeholder-dress.jpg'}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          priority={false}
        />

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center shadow-md border transition-all duration-300 hover:scale-110 ${
            favorite
              ? 'bg-[#a855f7] border-[#a855f7] text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]'
              : 'bg-slate-950/80 backdrop-blur-sm border-white/10 text-white hover:bg-slate-900'
          }`}
        >
          <Heart className="w-4.5 h-4.5" fill={favorite ? "currentColor" : "none"} />
        </button>

        {/* Product Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
          {product.isNewArrival && (
            <span className="bg-emerald-500 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full">
              New
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-indigo-650 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full">
              Best
            </span>
          )}
          {hasDiscount && (
            <span className="bg-[#a855f7] text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full">
              -{product.discountPercentage || Math.round(((originalPrice - displayPrice) / originalPrice) * 100)}%
            </span>
          )}
        </div>

        {/* Stock warning */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-[#a855f7] text-white text-xs font-semibold px-4 py-2 rounded-full uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-[11px] text-slate-400 font-semibold">(5.0)</span>
          </div>

          {/* Title */}
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="font-playfair text-base font-bold text-white group-hover:text-[#a855f7] transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-white">৳{displayPrice}</span>
            {hasDiscount && (
              <span className="text-sm text-slate-500 line-through">৳{originalPrice}</span>
            )}
          </div>

          {product.stock > 0 && (
            <button
              onClick={handleQuickAdd}
              className="bg-purple-950/60 text-[#a855f7] hover:bg-[#a855f7] hover:text-white w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-sm border border-purple-500/20"
              title="Quick Add to Cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProductCard;
