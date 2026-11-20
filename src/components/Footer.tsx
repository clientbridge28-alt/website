import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, AlertCircle, Mail, MapPin } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BrandMonogram } from './BrandMark';

export function Footer() {
  const { settings } = useStore();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus({ ok: false, text: 'Please enter a valid email address.' });
      return;
    }

    setSubmitting(true);
    setStatus(null);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({
          ok: true,
          text: data.message || 'You are subscribed to Al Fajr Scents updates.',
        });
        setEmail('');
      } else {
        setStatus({ ok: false, text: data.error || 'Subscription failed.' });
      }
    } catch {
      setStatus({
        ok: false,
        text: 'Unable to connect right now. Please try again in a moment.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer>
      {/* Warm Ivory Newsletter Band — "Stay Informed / Be the First to Know" */}
      <section
        aria-labelledby="footer-newsletter-heading"
        className="border-t border-[#10100E]/10 bg-[#F4EFE6] px-4 py-16 text-center text-[#10100E] sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#8A6826]">
            Stay Informed
          </p>
          <h2
            id="footer-newsletter-heading"
            className="mt-2 font-display text-3xl font-semibold text-[#10100E] sm:text-4xl"
          >
            Be the First to Know
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#4A453E]">
            Be the first to experience new Eau de Parfum releases, exclusive batches, and seasonal layering notes from Al Fajr Scents.
          </p>

          <form
            onSubmit={handleSubscribe}
            noValidate
            className="mx-auto mt-7 flex max-w-md items-center overflow-hidden rounded-lg border border-[#10100E]/15 bg-white shadow-xs focus-within:border-[#8A6826]"
          >
            <label htmlFor="footer-newsletter-email" className="sr-only">
              Email address for updates
            </label>
            <Mail className="ml-4 h-4 w-4 text-[#7A746B] shrink-0" />
            <input
              id="footer-newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              autoComplete="email"
              className="flex-1 bg-transparent px-3 py-3.5 text-sm text-[#10100E] placeholder:text-[#7A746B] focus:outline-none"
            />
            <button
              type="submit"
              disabled={submitting}
              aria-label="Subscribe to newsletter"
              className="flex h-12 w-12 items-center justify-center bg-[#10100E] text-white transition-colors hover:bg-[#8A6826] disabled:opacity-60 cursor-pointer shrink-0"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {status && (
            <div
              role={status.ok ? 'status' : 'alert'}
              className={`mt-3 inline-flex items-center gap-2 text-xs font-medium ${
                status.ok ? 'text-[#153F35]' : 'text-red-700'
              }`}
            >
              {status.ok ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0" />
              )}
              <span>{status.text}</span>
            </div>
          )}

          <p className="mt-3 text-[11px] text-[#7A746B]">
            No spam. Unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </section>

      {/* Main Obsidian Black Footer */}
      <div className="bg-[#0B0B0B] text-[#E6E1D8]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <BrandMonogram className="h-8 w-8 text-[#C6A46A]" />
              <span className="font-display text-2xl font-semibold tracking-[0.14em] uppercase text-white">
                Al Fajr Scents
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
              Fine Eau de Parfum creations crafted in Pakistan. Designed around natural warmth, enduring character, and signature matte-black presentation.
            </p>
            <div className="mt-6 space-y-2 text-xs text-white/75">
              <p className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#C6A46A] shrink-0" />
                <span>{settings.contact_email || 'concierge@alfajrscents.pk'}</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#C6A46A] shrink-0" />
                <span>
                  {settings.business_address && !settings.business_address.startsWith('[')
                    ? settings.business_address
                    : 'Lahore · Karachi · Islamabad · Nationwide Dispatch, Pakistan'}
                </span>
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C6A46A]">Quick Links</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/75">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">All Fragrances</Link></li>
              <li><Link to="/our-story" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/journal" className="hover:text-white transition-colors">Journal</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/discover" className="hover:text-white transition-colors">Scent Finder</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C6A46A]">Customer Service</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/75">
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms and Conditions</Link></li>
              <li><Link to="/returns-policy" className="hover:text-white transition-colors">Returns &amp; Exchange</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-white transition-colors">Shipping Information</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link to="/track-order" className="hover:text-white transition-colors">Track Your Order</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C6A46A]">Our Collection</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/75">
              <li><Link to="/products/blu-mare" className="hover:text-white transition-colors">Blu Mare — 50ml EDP</Link></li>
              <li><Link to="/products/blu-sea" className="hover:text-white transition-colors">Blu Sea — 50ml EDP</Link></li>
              <li><Link to="/products/silver-coast" className="hover:text-white transition-colors">Silver Coast — 50ml EDP</Link></li>
              <li><Link to="/products/shadow-x" className="hover:text-white transition-colors">Shadow X — 50ml EDP</Link></li>
              <li><Link to="/products/midnight-aura" className="hover:text-white transition-colors">Midnight Aura — 50ml EDP</Link></li>
              <li><Link to="/products/rose-whisper" className="hover:text-white transition-colors">Rose Whisper — 50ml EDP</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 py-6 text-xs text-white/55 sm:flex-row sm:items-center sm:px-6 lg:px-8">
            <p>&copy; {new Date().getFullYear()} Al Fajr Scents (alfajrscents.pk). All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-5">
              <Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white">Terms &amp; Conditions</Link>
              <Link to="/admin" className="hover:text-[#C6A46A]">Store Admin</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
