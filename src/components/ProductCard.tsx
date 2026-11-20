import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import type { Product } from '../types';
import { useStore } from '../context/StoreContext';

export function formatPKR(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, setQuickViewProduct, wishlistIds, toggleWishlist } = useStore();
  const primaryImage = product.images?.[0];
  const isWishlisted = wishlistIds.includes(product.id);
  const outOfStock = product.stock_quantity <= 0;

  return (
    <article className="group flex flex-col rounded-2xl bg-white p-3 border border-[#10100E]/8 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(16,16,14,0.08)]">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#F6F3EE]">
        <Link to={`/products/${product.slug}`} className="block h-full w-full">
          {primaryImage ? (
            <img
              src={primaryImage.image_url}
              alt={primaryImage.alt_text || `${product.name} ${product.concentration} ${product.size_ml}ml`}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-white/90 font-display text-2xl"
              style={{ backgroundColor: product.accent_color || '#173A55' }}
            >
              {product.name}
            </div>
          )}
        </Link>

        {/* Subtle Edition Size Label */}
        <span className="absolute left-2.5 top-2.5 rounded-md bg-[#10100E]/80 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.1em] text-white backdrop-blur-xs">
          {product.size_ml}ml EDP
        </span>

        {/* Functional quick actions */}
        <div className="absolute right-2.5 top-2.5 flex flex-col gap-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#10100E] shadow-sm transition-colors hover:bg-[#10100E] hover:text-white cursor-pointer"
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-[#C6A46A] text-[#C6A46A]' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => setQuickViewProduct(product)}
            aria-label={`Quick view ${product.name}`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#10100E] shadow-sm transition-colors hover:bg-[#10100E] hover:text-white cursor-pointer"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>

        {/* Out of stock badge */}
        {outOfStock && (
          <div className="absolute bottom-2.5 left-2.5 rounded-md bg-[#10100E]/90 px-2.5 py-1 text-[10px] font-semibold tracking-[0.1em] uppercase text-white">
            Sold Out
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between pt-3.5 px-1 pb-1">
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-[#7A746B]">
            {product.fragrance_family}
          </p>
          <Link to={`/products/${product.slug}`} className="mt-1 block">
            <h3 className="font-sans text-[15px] font-semibold leading-snug text-[#10100E] line-clamp-1 group-hover:text-[#8A6826] transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="mt-0.5 text-xs text-[#6B655E] line-clamp-1">{product.subtitle}</p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-[#10100E]/8">
          <div className="flex items-baseline justify-between mb-2.5">
            <span className="tabular-nums text-[15px] font-bold text-[#10100E]">
              {formatPKR(product.price_pkr)}
            </span>
            <span className="text-[11px] text-[#7A746B]">{product.concentration}</span>
          </div>
          <button
            type="button"
            disabled={outOfStock}
            onClick={() => addToCart(product.id, 1, true)}
            className={`flex w-full items-center justify-center gap-2 rounded-md py-2.5 text-xs font-semibold tracking-wide transition-colors cursor-pointer whitespace-nowrap ${
              outOfStock
                ? 'bg-[#8D8984] text-white cursor-not-allowed opacity-80'
                : 'bg-[#8A6826] text-white hover:bg-[#6E511B]'
            }`}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            {outOfStock ? 'Sold out' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </article>
  );
}
