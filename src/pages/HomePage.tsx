import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ShoppingBag,
  Check,
  Package,
  Truck,
  Headphones,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { BrandMonogram } from '../components/BrandMark';
import { SEOHead } from '../components/SEOHead';
import qamrahHeroImg from '../assets/images/qamrah_navy_hero_1794808311079.jpg';
import shadowXHeroImg from '../assets/images/shadowx_branches_hero_1794808312897.jpg';
import type { JournalArticle, Product } from '../types';

const HERO_SLIDES = [
  { id: 'signature-house', label: 'Signature Collection', isLight: false },
  { id: 'qamrah-launch', label: 'Qamrah', isLight: false },
  { id: 'shadow-x-silence', label: 'Shadow X', isLight: true },
  { id: 'rose-whisper-coast', label: 'Rose Whisper', isLight: false },
] as const;

const MARQUEE_ITEMS = [
  "Pakistan's Fine Fragrance House",
  '50ml Concentrated Eau de Parfum',
  'Long-Lasting Trail · 8–12+ Hours',
  'Signature Gilded Calligraphy Presentation',
  'Free Nationwide Delivery Above Rs. 12,000',
  'Cash on Delivery & Bank Transfer',
];

const COLLECTION_MATCHES = [
  {
    title: 'Oceanic & Fresh',
    subtitle: 'Crisp marine clarity, sea salt & sunlit citrus.',
    categorySlug: 'oceanic-fresh',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-12_at_7.44.28_AM_a80b65ec.jpeg',
    alt: 'Blu Mare 50ml Eau de Parfum poolside overlooking coastal horizon',
  },
  {
    title: 'Woody & Smoky',
    subtitle: 'Smoked agarwood, charred cedar & dark resin.',
    categorySlug: 'woody-smoky',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-12_at_7.44.29_AM__1__ad1ae54e.jpeg',
    alt: 'Shadow X 50ml Eau de Parfum beside dark oud wood and brass lantern',
  },
  {
    title: 'Amber & Spiced',
    subtitle: 'Golden amber glow, cardamom & warm sandalwood.',
    categorySlug: 'amber-spiced',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-12_at_7.44.27_AM__1__92fc8aa5.jpeg',
    alt: 'Silver Coast 50ml emerald and amber bottle on stone by waterfall',
  },
  {
    title: 'Floral & Velvet',
    subtitle: 'Midnight Damascus rose, saffron & soft cashmere.',
    categorySlug: 'floral-velvet',
    image: '/assets/aistudio/WhatsApp_Image_2026-11-12_at_7.44.26_AM_c6d54422.jpeg',
    alt: 'Rose Whisper 50ml frosted blue bottle beside midnight roses',
  },
];

const SLIDE_DURATION_MS = 5000;

export function HomePage() {
  const { categories, featuredProducts, bestSellers, recentReviews } = useStore();
  const [slideIdx, setSlideIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [articles, setArticles] = useState<JournalArticle[]>([]);
  const featuredTrackRef = useRef<HTMLDivElement>(null);
  const matchTrackRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    fetch('/api/products?sort=featured')
      .then((r) => (r.ok ? r.json() : { products: [] }))
      .then((d) => setAllProducts(d.products || []))
      .catch(() => {});

    fetch('/api/journal')
      .then((r) => (r.ok ? r.json() : { articles: [] }))
      .then((d) => setArticles((d.articles || []).slice(0, 3)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (prefersReduced || paused) return;
    const timer = window.setInterval(() => {
      setSlideIdx((prev) => (prev + 1) % HERO_SLIDES.length);
    }, SLIDE_DURATION_MS);
    return () => window.clearInterval(timer);
  }, [prefersReduced, paused, slideIdx]);

  const activeSlide = HERO_SLIDES[slideIdx];
  const isLightSlide = activeSlide.isLight;

  const catalogSource = allProducts.length > 0 ? allProducts : featuredProducts;
  const filteredCollection =
    activeCategory === 'all'
      ? catalogSource
      : catalogSource.filter((p) => p.category_slug === activeCategory);

  const collectorReserve =
    bestSellers.length > 0
      ? bestSellers
      : catalogSource.filter((p) => ['qamrah', 'gentlemen', 'golden-drop', 'blu-sea'].includes(p.slug));

  const scrollTrack = (ref: React.RefObject<HTMLDivElement | null>, dir: 'left' | 'right') => {
    if (!ref.current) return;
    const step = Math.max(300, Math.round(ref.current.clientWidth * 0.75));
    ref.current.scrollBy({ left: dir === 'left' ? -step : step, behavior: 'smooth' });
  };

  const handleCategoryTab = (slug: string) => {
    setActiveCategory(slug);
    if (featuredTrackRef.current) {
      featuredTrackRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white text-[#10100E]">
      <SEOHead
        title="Al Fajr Scents — Luxury Eau de Parfum House | Pakistan"
        description="Discover Al Fajr Scents, a Pakistani fine fragrance house crafting distinctive 50ml Eau de Parfum creations including Blu Mare, Silver Coast, Shadow X, Midnight Aura, Qamrah, and Rose Whisper."
        canonicalPath="/"
        ogImage="/assets/aistudio/Perfume_bottle_on_coastal_rocks_e51ea41c_2K_65088449.jpg"
      />

      {/* 01 — FULL-WIDTH CAMPAIGN HERO CAROUSEL */}
      <section
        aria-label="Featured Fragrance Campaigns"
        aria-roledescription="carousel"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        className="relative w-full overflow-hidden bg-[#180709]"
      >
        <div className="relative h-[480px] w-full sm:h-[540px] lg:h-[600px]">
          <div
            className="flex h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: `translate3d(-${slideIdx * 100}%, 0, 0)` }}
          >
            {/* SLIDE 1: SIGNATURE COLLECTION SPOTLIGHT SHOWCASE */}
            <div className="relative h-full w-full shrink-0 overflow-hidden bg-[radial-gradient(ellipse_at_52%_22%,#6E1119_0%,#2C070B_52%,#0D0909_100%)] text-white">
              {/* Soft podium stage glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/75 via-black/35 to-transparent"
              />
              <div className="relative z-10 mx-auto grid h-full max-w-7xl items-center gap-6 px-12 py-8 sm:px-16 lg:grid-cols-12 lg:px-20">
                {/* Left Headline Block */}
                <div className="lg:col-span-4 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 text-[#C6A46A]">
                    <BrandMonogram className="h-6 w-6 text-[#C6A46A]" />
                    <span className="text-xs font-semibold uppercase tracking-[0.22em]">
                      Al Fajr Scents
                    </span>
                  </div>
                  <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-[0.98] tracking-[0.04em] text-white sm:text-5xl lg:text-6xl">
                    Signature
                    <br />
                    <span className="text-[#F3DFB8]">Collection</span>
                  </h1>
                  <p className="mt-3 max-w-sm mx-auto lg:mx-0 text-xs leading-relaxed text-white/80 sm:text-sm">
                    Fine 50ml Eau de Parfum crafted in small batches for enduring trail and understated luxury.
                  </p>
                  <div className="mt-5 flex justify-center lg:justify-start">
                    <Link
                      to="/shop"
                      className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#10100E] shadow-lg transition-colors hover:bg-[#C6A46A]"
                    >
                      Shop Collection
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Center Bottle Trio Display */}
                <div className="hidden sm:grid lg:col-span-5 grid-cols-3 items-end gap-3.5 pt-4">
                  <Link
                    to="/products/blu-mare"
                    className="group relative aspect-[3/4] overflow-hidden rounded-t-xl border border-[#C6A46A]/35 bg-[#10100E] shadow-2xl transition-transform duration-300 hover:-translate-y-1.5"
                  >
                    <img
                      src="/assets/aistudio/WhatsApp_Image_2026-11-12_at_7.44.28_AM_a80b65ec.jpeg"
                      alt="Blu Mare 50ml Eau de Parfum"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-2.5 py-2 text-[11px] font-medium tracking-wider text-white">
                      Blu Mare
                    </span>
                  </Link>

                  <Link
                    to="/products/silver-coast"
                    className="group relative -translate-y-4 aspect-[3/4] overflow-hidden rounded-t-xl border border-[#C6A46A]/55 bg-[#10100E] shadow-2xl transition-transform duration-300 hover:-translate-y-6"
                  >
                    <img
                      src="/assets/aistudio/WhatsApp_Image_2026-11-12_at_7.44.27_AM__1__92fc8aa5.jpeg"
                      alt="Silver Coast 50ml Eau de Parfum"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-2.5 py-2 text-[11px] font-medium tracking-wider text-[#F3DFB8]">
                      Silver Coast
                    </span>
                  </Link>

                  <Link
                    to="/products/shadow-x"
                    className="group relative aspect-[3/4] overflow-hidden rounded-t-xl border border-[#C6A46A]/35 bg-[#10100E] shadow-2xl transition-transform duration-300 hover:-translate-y-1.5"
                  >
                    <img
                      src="/assets/aistudio/WhatsApp_Image_2026-11-12_at_7.44.29_AM__1__ad1ae54e.jpeg"
                      alt="Shadow X 50ml Eau de Parfum"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-2.5 py-2 text-[11px] font-medium tracking-wider text-white">
                      Shadow X
                    </span>
                  </Link>
                </div>

                {/* Right Callout Block */}
                <div className="hidden lg:flex lg:col-span-3 flex-col items-end text-right">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C6A46A]">
                    Direct From The House
                  </p>
                  <p className="mt-2 font-display text-5xl font-bold leading-none text-white">
                    50ML
                  </p>
                  <p className="mt-1 text-sm font-semibold uppercase tracking-[0.16em] text-white/90">
                    Eau de Parfum
                  </p>
                  <p className="mt-3 text-xs text-white/75">
                    Complimentary nationwide shipping on orders above Rs. 12,000
                  </p>
                </div>
              </div>
            </div>

            {/* SLIDE 2: QAMRAH — LAUNCHING SOON */}
            <div className="relative h-full w-full shrink-0 overflow-hidden bg-[#071238] text-[#FAF8F5]">
              <img
                src={qamrahHeroImg}
                alt="Al Fajr Scents Qamrah Eau de Parfum 50ml resting on dark basalt stone against deep midnight navy"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover object-right sm:object-center"
              />
              <div className="absolute inset-0 z-10 mx-auto flex max-w-7xl flex-col justify-center px-12 sm:px-16 lg:px-20">
                <div className="max-w-lg">
                  <div className="flex items-center gap-2.5 text-white">
                    <BrandMonogram className="h-7 w-7 text-white sm:h-9 sm:w-9" />
                    <span className="font-display text-xs tracking-[0.22em] uppercase text-white/95 sm:text-sm">
                      Al Fajr Scents
                    </span>
                  </div>
                  <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.95] tracking-[0.02em] text-white sm:mt-6 sm:text-6xl lg:text-7xl">
                    Launching
                    <br />
                    Soon
                  </h2>
                  <p className="mt-3 max-w-md text-xs leading-relaxed text-[#F3E9DE]/95 sm:mt-4 sm:text-base">
                    A timeless fragrance crafted with elegance and tradition, arriving soon.
                  </p>
                  <div className="mt-5 sm:mt-7">
                    <Link
                      to="/products/qamrah"
                      className="inline-flex min-h-[42px] items-center gap-2.5 rounded-md border border-white/55 bg-white/10 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-xs transition-colors hover:bg-white hover:text-[#071238]"
                    >
                      Explore Qamrah
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* SLIDE 3: SHADOW X — CARVED FROM SILENCE */}
            <div className="relative h-full w-full shrink-0 overflow-hidden bg-[#F6F5F0] text-[#141412]">
              <img
                src={shadowXHeroImg}
                alt="Al Fajr Scents Shadow X 50ml Eau de Parfum resting on sculpted dark branches against warm ivory"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover object-bottom"
              />
              <div className="absolute inset-x-0 top-0 z-10 flex flex-col items-center px-4 pt-8 text-center sm:pt-12 lg:pt-14">
                <h2 className="font-display text-4xl font-normal uppercase tracking-[0.14em] leading-none text-[#141412] sm:text-5xl lg:text-[62px]">
                  Shadow X
                </h2>
                <p className="mt-2.5 text-xs tracking-[0.04em] text-[#282824] sm:mt-3 sm:text-base">
                  An eau de parfum carved from silence.
                </p>
                <Link
                  to="/products/shadow-x"
                  className="mt-4 inline-flex min-h-[40px] items-center justify-center rounded-md bg-[#222220] px-7 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#FAF8F5] transition-colors hover:bg-[#10100E] sm:mt-5"
                >
                  Discover Now
                </Link>
              </div>
            </div>

            {/* SLIDE 4: ROSE WHISPER — COASTAL ROCKS */}
            <div className="relative h-full w-full shrink-0 overflow-hidden bg-[#10100E]">
              <img
                src="/assets/aistudio/Perfume_bottle_on_coastal_rocks_e51ea41c_2K_65088449.jpg"
                alt="Al Fajr Scents Rose Whisper 50ml Eau de Parfum on sunlit coastal rocks with ocean waves"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute bottom-12 left-12 z-10 sm:bottom-12 sm:left-16 lg:left-20">
                <Link
                  to="/products/rose-whisper"
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-md border border-white/65 bg-[#10100E]/45 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-xs transition-colors hover:bg-white hover:text-[#10100E]"
                >
                  Discover Rose Whisper
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Video-Style Circular White Prev / Next Buttons */}
          <button
            type="button"
            onClick={() => setSlideIdx((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
            aria-label="Previous campaign slide"
            className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#10100E] shadow-lg transition-transform hover:scale-105 cursor-pointer sm:left-5"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setSlideIdx((prev) => (prev + 1) % HERO_SLIDES.length)}
            aria-label="Next campaign slide"
            className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#10100E] shadow-lg transition-transform hover:scale-105 cursor-pointer sm:right-5"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Clean Slide Dots */}
          <div
            role="tablist"
            aria-label="Select campaign slide"
            className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2"
          >
            {HERO_SLIDES.map((slide, idx) => {
              const active = idx === slideIdx;
              return (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`Show ${slide.label}`}
                  onClick={() => setSlideIdx(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    active
                      ? isLightSlide
                        ? 'w-7 bg-[#10100E]'
                        : 'w-7 bg-white'
                      : isLightSlide
                        ? 'w-2 bg-[#10100E]/30 hover:bg-[#10100E]/60'
                        : 'w-2 bg-white/45 hover:bg-white/80'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* 02 — CONTINUOUS BLACK MARQUEE BAR */}
      <div className="overflow-hidden bg-[#0B0B0B] py-3 text-white border-y border-white/10">
        <div className="animate-af-marquee items-center">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center gap-10 pr-10 shrink-0" aria-hidden={dup === 1}>
              {MARQUEE_ITEMS.map((item) => (
                <div key={`${dup}-${item}`} className="flex items-center gap-3 whitespace-nowrap text-xs font-medium tracking-[0.08em] uppercase text-white/90 sm:text-[13px]">
                  <span className="text-[#C6A46A]" aria-hidden="true">✦</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 03 — FEATURED COLLECTION (CATEGORY TABS + HORIZONTAL PRODUCT CAROUSEL) */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-3xl font-semibold text-[#10100E] sm:text-4xl">
            Featured Collection
          </h2>

          {/* Interactive Filter Tabs */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={() => handleCategoryTab('all')}
              className={`rounded-lg px-4 py-2 text-xs font-semibold tracking-wide transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === 'all'
                  ? 'bg-[#0B0B0B] text-white'
                  : 'border border-[#10100E]/15 bg-white text-[#302018] hover:border-[#10100E]'
              }`}
            >
              All Creations
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryTab(cat.slug)}
                className={`rounded-lg px-4 py-2 text-xs font-semibold tracking-wide transition-colors cursor-pointer whitespace-nowrap ${
                  activeCategory === cat.slug
                    ? 'bg-[#0B0B0B] text-white'
                    : 'border border-[#10100E]/15 bg-white text-[#302018] hover:border-[#10100E]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Horizontal Carousel Wrapper with Circular Side Arrows */}
        <div className="relative mt-10">
          <button
            type="button"
            onClick={() => scrollTrack(featuredTrackRef, 'left')}
            aria-label="Scroll featured collection left"
            className="hidden sm:flex absolute -left-3 top-1/2 z-10 h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#10100E]/10 bg-white text-[#10100E] shadow-md transition-transform hover:scale-105 cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div
            ref={featuredTrackRef}
            className="no-scrollbar flex gap-5 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory"
          >
            {filteredCollection.map((product) => (
              <div
                key={product.id}
                className="w-[76vw] max-w-[260px] shrink-0 snap-start sm:w-[238px] lg:w-[235px]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollTrack(featuredTrackRef, 'right')}
            aria-label="Scroll featured collection right"
            className="hidden sm:flex absolute -right-3 top-1/2 z-10 h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#10100E]/10 bg-white text-[#10100E] shadow-md transition-transform hover:scale-105 cursor-pointer"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* 04 — FULL-WIDTH LIFESTYLE SOCIAL PROOF BANNER */}
      <section className="relative overflow-hidden bg-[#12324A] text-white">
        <div className="relative mx-auto flex min-h-[360px] max-w-7xl items-center px-4 py-16 sm:min-h-[420px] sm:px-6 lg:px-8">
          <img
            src="/assets/aistudio/WhatsApp_Image_2026-11-12_at_7.44.28_AM_a80b65ec.jpeg"
            alt="Al Fajr Scents Blu Mare bottle on coastal stone"
            loading="lazy"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover object-center sm:object-right opacity-85"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#0C263B] via-[#0C263B]/88 to-[#0C263B]/20"
          />

          <div className="relative z-10 max-w-xl">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#F3DFB8]">
              Real fragrances. Lasting trail.
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-white sm:text-5xl">
              Crafted for Quiet Confidence Across Pakistan
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/85 sm:text-base">
              Join discerning collectors across Karachi, Lahore, Islamabad, and nationwide who choose Al Fajr Scents for fine 50ml Eau de Parfum extracts, authentic ingredients, and consistent quality.
            </p>
            <div className="mt-7">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2.5 rounded-md bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#10100E] shadow-md transition-colors hover:bg-[#C6A46A]"
              >
                Shop Now
                <ShoppingBag className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 05 — FIND YOUR PERFECT MATCH (CATEGORY SHOWCASE CARDS) */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold text-[#10100E] sm:text-4xl">
            Find Your Perfect Match
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#5C5750]">
            Explore our curated olfactory families — from crisp oceanic citrus and warm golden amber to deep nocturnal woods and Damascus rose.
          </p>
        </div>

        <div className="relative mt-10">
          <button
            type="button"
            onClick={() => scrollTrack(matchTrackRef, 'left')}
            aria-label="Scroll fragrance families left"
            className="hidden sm:flex absolute -left-3 top-1/2 z-10 h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#10100E]/10 bg-white text-[#10100E] shadow-md transition-transform hover:scale-105 cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div
            ref={matchTrackRef}
            className="no-scrollbar grid grid-flow-col auto-cols-[80%] gap-5 overflow-x-auto scroll-smooth pb-2 sm:auto-cols-[46%] lg:grid-flow-row lg:grid-cols-4 lg:overflow-visible"
          >
            {COLLECTION_MATCHES.map((item) => (
              <Link
                key={item.categorySlug}
                to={`/shop?category=${item.categorySlug}`}
                className="group relative aspect-[4/4.8] overflow-hidden rounded-2xl bg-[#10100E] shadow-sm"
              >
                <img
                  src={item.image}
                  alt={item.alt}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/45"
                />

                <div className="absolute inset-x-0 top-0 p-5 text-white">
                  <h3 className="font-display text-2xl font-semibold leading-tight text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/85">
                    {item.subtitle}
                  </p>
                </div>

                <div className="absolute bottom-5 left-5 flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#10100E] transition-transform group-hover:translate-x-0.5">
                    <ChevronRight className="h-4 w-4" />
                  </span>
                  <span>Discover</span>
                </div>
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollTrack(matchTrackRef, 'right')}
            aria-label="Scroll fragrance families right"
            className="hidden sm:flex lg:hidden absolute -right-3 top-1/2 z-10 h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#10100E]/10 bg-white text-[#10100E] shadow-md transition-transform hover:scale-105 cursor-pointer"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* 06 — WHAT SETS AL FAJR SCENTS APART (2-COLUMN EDITORIAL SPLIT) */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h2 className="font-display text-3xl font-semibold text-[#10100E] sm:text-4xl">
              What Sets Al Fajr Scents Apart
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#4A453E] sm:text-base">
              Every Al Fajr Scents fragrance is crafted using concentrated, internationally sourced perfume oils balanced in small batches for Pakistan&apos;s warmth and evening occasions.
            </p>

            <ul className="mt-6 space-y-2.5 text-sm text-[#302018]">
              {[
                '9 Signature 50ml Eau de Parfum Creations',
                'Concentrated Oil Blending · 8–12+ Hours Longevity',
                'Signature Matte-Black Gilded Calligraphy Box',
                'Carefully Macerated for Smooth Dry-Down',
                'Crafted & Bottled with Pride in Pakistan',
                'Nationwide Cash on Delivery & Direct Order Tracking',
              ].map((point) => (
                <li key={point} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#8A6826]" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <Link
                to="/our-story"
                className="inline-flex items-center gap-2 rounded-md bg-[#0B0B0B] px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#8A6826]"
              >
                Read More
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-[#191816] shadow-lg">
              <img
                src="/assets/aistudio/WhatsApp_Image_2026-11-12_at_7.44.30_AM_49eda978.jpeg"
                alt="Al Fajr Scents luxury matte-black calligraphy presentation box with Rose Whisper 50ml bottle and brass lantern"
                loading="lazy"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 07 — 4-PILLAR HOUSE STANDARDS STRIP */}
      <section className="border-y border-[#10100E]/8 bg-[#FAF8F5] py-12">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-2 lg:grid-cols-4 sm:px-6 lg:px-8">
          {[
            {
              icon: Package,
              title: 'Heirloom Presentation',
              desc: 'Every 50ml bottle arrives inside our gold-embossed black calligraphy presentation box.',
            },
            {
              icon: Truck,
              title: 'Fast & Free Shipping',
              desc: 'Complimentary nationwide courier delivery on all orders above Rs. 12,000.',
            },
            {
              icon: Headphones,
              title: 'Dedicated Client Care',
              desc: 'Personal fragrance consultation & responsive order assistance across Pakistan.',
            },
            {
              icon: ShieldCheck,
              title: 'Promising Quality',
              desc: 'High-concentration Eau de Parfum formulations crafted in small batches.',
            },
          ].map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.title} className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#10100E]/15 bg-white text-[#8A6826]">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#10100E]">{pillar.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#5C5750]">{pillar.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 08 — COLLECTOR RESERVE / MOST ORDERED EDITIONS */}
      {collectorReserve.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 border-b border-[#10100E]/10 pb-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8A6826]">
                {bestSellers.length > 0 ? 'Client Favorites' : 'The Reserve'}
              </p>
              <h2 className="mt-1.5 font-display text-3xl font-semibold text-[#10100E] sm:text-4xl">
                {bestSellers.length > 0 ? 'Most Ordered Creations' : 'Collector Signature Editions'}
              </h2>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#10100E] hover:text-[#8A6826] whitespace-nowrap"
            >
              View All Fragrances
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {collectorReserve.slice(0, 4).map((product) => (
              <ProductCard key={`res-${product.id}`} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 09 — VERIFIED CUSTOMER REVIEWS & FRAGRANCE JOURNAL */}
      <section className="border-t border-[#10100E]/8 bg-[#FAF8F5] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Verified Reviews */}
          <div className="mb-20">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8A6826]">
                  Client Impressions
                </p>
                <h2 className="mt-1.5 font-display text-3xl font-semibold text-[#10100E] sm:text-4xl">
                  Verified Customer Experiences
                </h2>
              </div>
              <Link
                to="/shop"
                className="text-xs font-semibold uppercase tracking-[0.14em] text-[#302018] underline underline-offset-4 hover:text-[#8A6826]"
              >
                Review a Fragrance
              </Link>
            </div>

            {recentReviews.length > 0 ? (
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {recentReviews.slice(0, 3).map((rev) => (
                  <blockquote
                    key={rev.id}
                    className="flex flex-col justify-between rounded-2xl border border-[#10100E]/8 bg-white p-6 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center gap-1 text-[#C6A46A]" aria-label={`${rev.rating} out of 5 stars`}>
                        {Array.from({ length: rev.rating }).map((_, idx) => (
                          <Star key={idx} className="h-3.5 w-3.5 fill-current" />
                        ))}
                      </div>
                      {rev.title && (
                        <p className="mt-3 font-display text-xl font-semibold text-[#10100E]">
                          {rev.title}
                        </p>
                      )}
                      <p className="mt-2 text-sm leading-relaxed text-[#4A453E]">
                        &ldquo;{rev.comment}&rdquo;
                      </p>
                    </div>
                    <footer className="mt-5 border-t border-[#10100E]/8 pt-3 text-xs text-[#6B655E]">
                      <span className="font-semibold text-[#10100E]">{rev.reviewer_name}</span>
                      {rev.reviewer_city && <span> · {rev.reviewer_city}</span>}
                      {rev.product_name && <span> · {rev.product_name}</span>}
                    </footer>
                  </blockquote>
                ))}
              </div>
            ) : (
              <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#10100E]/10 bg-white p-8 sm:flex-row sm:items-center">
                <div>
                  <p className="font-display text-2xl font-semibold text-[#10100E]">
                    Authentic Verified Customer Reviews
                  </p>
                  <p className="mt-1 text-sm text-[#5C5750]">
                    Every review on Al Fajr Scents is submitted directly on product pages by our clients across Pakistan.
                  </p>
                </div>
                <Link
                  to="/shop"
                  className="rounded-md bg-[#0B0B0B] px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#8A6826] whitespace-nowrap shrink-0"
                >
                  Explore Fragrances
                </Link>
              </div>
            )}
          </div>

          {/* Guides & Scent Journal */}
          {articles.length > 0 && (
            <div>
              <div className="flex flex-col justify-between gap-4 border-b border-[#10100E]/10 pb-6 sm:flex-row sm:items-end">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8A6826]">
                    The Journal
                  </p>
                  <h2 className="mt-1.5 font-display text-3xl font-semibold text-[#10100E]">
                    Guides &amp; Scent Education
                  </h2>
                </div>
                <Link
                  to="/journal"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#10100E] hover:text-[#8A6826]"
                >
                  Read All Guides
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-8 grid gap-8 md:grid-cols-3">
                {articles.map((art) => (
                  <article key={art.id} className="group flex flex-col">
                    <Link
                      to={`/journal/${art.slug}`}
                      className="aspect-[4/3] overflow-hidden rounded-2xl bg-[#E9DFD3]"
                    >
                      <img
                        src={art.cover_image}
                        alt={art.title}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </Link>
                    <p className="mt-4 text-xs text-[#6B655E]">
                      {art.category} · {art.read_time}
                    </p>
                    <Link to={`/journal/${art.slug}`} className="mt-1.5">
                      <h3 className="font-display text-2xl font-semibold text-[#10100E] group-hover:text-[#8A6826] transition-colors">
                        {art.title}
                      </h3>
                    </Link>
                    <p className="mt-2 text-sm text-[#4A453E] line-clamp-2">{art.excerpt}</p>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
