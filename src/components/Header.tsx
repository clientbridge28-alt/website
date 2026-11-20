import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BrandMonogram } from './BrandMark';

export function Header() {
  const { settings, categories, featuredProducts, cart, setCartOpen, wishlistIds } = useStore();
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const megaRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const announcement =
    settings.announcement_text ||
    'Free Delivery Across Pakistan on Orders Above PKR 12,000 · Cash on Delivery & Bank Transfer';

  useEffect(() => {
    setMegaOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'All Scents', to: '/shop' },
    { label: 'Scent Finder', to: '/discover' },
    { label: 'Our Story', to: '/our-story' },
    { label: 'Journal', to: '/journal' },
    { label: 'Track Order', to: '/track-order' },
  ];

  return (
    <div className="sticky top-0 z-40" ref={megaRef}>
      {/* Slim Warm Gold Announcement Bar */}
      {!bannerDismissed && (
        <div className="relative flex h-[32px] items-center justify-center bg-[#C99C33] px-10 text-center text-[12px] font-medium tracking-wide text-[#10100E]">
          <span className="truncate">{announcement}</span>
          <button
            type="button"
            onClick={() => setBannerDismissed(true)}
            aria-label="Dismiss announcement"
            className="absolute right-3 flex h-6 w-6 items-center justify-center text-[#10100E]/75 hover:text-[#10100E] cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Main Obsidian Black Header */}
      <header className="border-b border-white/10 bg-[#0B0B0B] text-white">
        <div className="mx-auto flex h-[64px] max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="flex h-10 w-10 items-center justify-center text-white lg:hidden cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link
              to="/"
              className="flex items-center gap-2.5 text-white whitespace-nowrap shrink-0"
            >
              <BrandMonogram className="h-7 w-7 text-[#C6A46A]" />
              <div className="flex flex-col leading-none">
                <span className="font-display text-xl font-semibold tracking-[0.16em] uppercase text-white sm:text-[22px]">
                  Al Fajr Scents
                </span>
              </div>
            </Link>
          </div>

          {/* Zone 2: Single-line navigation links + interactive Shop megamenu */}
          <nav
            className="hidden lg:flex items-center gap-7"
            aria-label="Primary Navigation"
          >
            <div
              className="relative"
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <button
                type="button"
                onClick={() => setMegaOpen((v) => !v)}
                aria-expanded={megaOpen}
                className="inline-flex items-center gap-1 py-2 text-[13px] font-medium tracking-wide text-white/90 transition-colors hover:text-[#C6A46A] cursor-pointer whitespace-nowrap shrink-0"
              >
                Shop
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${megaOpen ? 'rotate-180 text-[#C6A46A]' : ''}`} />
              </button>

              {/* Floating White Megamenu Card */}
              {megaOpen && (
                <div className="absolute left-1/2 top-full z-50 w-[680px] -translate-x-1/3 pt-2">
                  <div className="grid grid-cols-3 gap-8 rounded-xl border border-[#10100E]/10 bg-white p-7 text-[#10100E] shadow-2xl">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A6826]">
                        Olfactory Families
                      </p>
                      <ul className="mt-3 space-y-2.5 text-sm">
                        <li>
                          <Link
                            to="/shop"
                            onClick={() => setMegaOpen(false)}
                            className="font-medium text-[#10100E] hover:text-[#8A6826] transition-colors"
                          >
                            All 50ml Creations
                          </Link>
                        </li>
                        {categories.map((cat) => (
                          <li key={cat.id}>
                            <Link
                              to={`/shop?category=${cat.slug}`}
                              onClick={() => setMegaOpen(false)}
                              className="text-[#302018]/80 hover:text-[#10100E] transition-colors"
                            >
                              {cat.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A6826]">
                        Signature Editions
                      </p>
                      <ul className="mt-3 space-y-2.5 text-sm">
                        {(featuredProducts.length > 0
                          ? featuredProducts.slice(0, 6)
                          : [
                              { name: 'Blu Mare', slug: 'blu-mare' },
                              { name: 'Silver Coast', slug: 'silver-coast' },
                              { name: 'Shadow X', slug: 'shadow-x' },
                              { name: 'Midnight Aura', slug: 'midnight-aura' },
                              { name: 'Rose Whisper', slug: 'rose-whisper' },
                            ]
                        ).map((p) => (
                          <li key={p.slug}>
                            <Link
                              to={`/products/${p.slug}`}
                              onClick={() => setMegaOpen(false)}
                              className="text-[#302018]/80 hover:text-[#10100E] transition-colors"
                            >
                              {p.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A6826]">
                        Explore House
                      </p>
                      <ul className="mt-3 space-y-2.5 text-sm">
                        <li>
                          <Link
                            to="/products/qamrah"
                            onClick={() => setMegaOpen(false)}
                            className="text-[#302018]/80 hover:text-[#10100E] transition-colors"
                          >
                            Qamrah Reserve
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/products/gentlemen"
                            onClick={() => setMegaOpen(false)}
                            className="text-[#302018]/80 hover:text-[#10100E] transition-colors"
                          >
                            Gentlemen Tailored
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/products/golden-drop"
                            onClick={() => setMegaOpen(false)}
                            className="text-[#302018]/80 hover:text-[#10100E] transition-colors"
                          >
                            Golden Drop Amber
                          </Link>
                        </li>
                        <li className="pt-2 border-t border-[#10100E]/10">
                          <Link
                            to="/discover"
                            onClick={() => setMegaOpen(false)}
                            className="font-semibold text-[#8A6826] hover:text-[#10100E] transition-colors"
                          >
                            Take the Scent Quiz →
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {navLinks.slice(1).map((link) => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative py-2 text-[13px] font-medium tracking-wide transition-colors whitespace-nowrap shrink-0 ${
                    active ? 'text-[#C6A46A]' : 'text-white/90 hover:text-[#C6A46A]'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute inset-x-0 bottom-0.5 h-[1.5px] bg-[#C6A46A]" aria-hidden="true" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: Search, Wishlist, Shopping Bag */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search fragrances"
              className="flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/10 hover:text-[#C6A46A] cursor-pointer"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/10 hover:text-[#C6A46A]"
            >
              <Heart className="h-[18px] w-[18px]" />
              {wishlistIds.length > 0 && (
                <span className="tabular-nums absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#C6A46A] px-1 text-[10px] font-bold text-[#10100E]">
                  {wishlistIds.length}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Open shopping bag with ${cart.item_count} items`}
              className="relative inline-flex h-10 items-center gap-2 rounded-full bg-white/10 px-3.5 text-xs font-medium tracking-wide text-white transition-colors hover:bg-[#C6A46A] hover:text-[#10100E] cursor-pointer whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="tabular-nums hidden sm:inline">Bag ({cart.item_count})</span>
              <span className="tabular-nums sm:hidden">{cart.item_count}</span>
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {searchOpen && (
          <div className="border-t border-white/10 bg-[#141412] px-4 py-3 sm:px-6 lg:px-8">
            <form onSubmit={handleSearchSubmit} className="mx-auto flex max-w-2xl items-center gap-3">
              <Search className="h-4 w-4 text-[#C6A46A] shrink-0" />
              <input
                type="search"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by fragrance name, note, or mood (e.g., Blu Mare, Oud, Amber)..."
                className="w-full bg-transparent py-1.5 text-sm text-white placeholder:text-white/45 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-md bg-[#C6A46A] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#10100E] hover:bg-white cursor-pointer whitespace-nowrap shrink-0"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
                className="p-2 text-white/60 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/65 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 flex h-full w-80 max-w-[85vw] flex-col justify-between bg-[#0B0B0B] p-6 text-white shadow-2xl">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <BrandMonogram className="h-6 w-6 text-[#C6A46A]" />
                  <span className="font-display text-lg font-semibold tracking-[0.14em] uppercase">
                    Al Fajr Scents
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                  className="flex h-11 w-11 items-center justify-center text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="mt-6 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex min-h-[44px] items-center border-b border-white/10 text-sm tracking-wide text-white/90 hover:text-[#C6A46A]"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-[44px] items-center border-b border-white/10 text-sm tracking-wide text-white/90 hover:text-[#C6A46A]"
                >
                  Wishlist ({wishlistIds.length})
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-[44px] items-center border-b border-white/10 text-sm tracking-wide text-white/90 hover:text-[#C6A46A]"
                >
                  Contact Concierge
                </Link>
              </nav>
            </div>
            <div className="border-t border-white/10 pt-4 text-xs text-white/60">
              <p>Al Fajr Scents · Pakistan</p>
              <p className="mt-1">Nationwide Cash on Delivery &amp; Bank Transfer</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
