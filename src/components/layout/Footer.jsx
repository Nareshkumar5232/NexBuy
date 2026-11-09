import React from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  FileText
} from 'lucide-react';
import Logo from '../common/Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const categories = [
    { label: 'Headphones', href: '/products?category=headphones' },
    { label: 'Earbuds', href: '/products?category=earbuds' },
    { label: 'Smartwatches', href: '/products?category=smartwatches' },
    { label: 'Speakers', href: '/products?category=speakers' },
    { label: 'Computer Accessories', href: '/products?category=computer-accessories' },
    { label: 'Keyboards & Mouse', href: '/products?category=keyboards-mouse' },
    { label: 'Storage Devices', href: '/products?category=storage-devices' },
    { label: 'Networking', href: '/products?category=networking' },
  ];

  const quickLinks = [
    { label: 'Shop All Products', href: '/products' },
    { label: 'New Arrivals', href: '/products?filter=new' },
    { label: 'Best Sellers', href: '/products?filter=bestseller' },
    { label: 'Product Categories', href: '/categories' },
    { label: 'About NEXBUY', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Admin Portal', href: '/admin/login' },
  ];

  const customerService = [
    { label: 'Order Tracking', href: '/my-orders' },
    { label: 'Shipping Policy', href: '/contact?subject=Shipping%20Policy' },
    { label: 'Return & Refund Policy', href: '/contact?subject=Return%20Policy' },
    { label: 'Warranty Claims', href: '/contact?subject=Warranty%20Claim' },
    { label: 'Enterprise Procurement', href: '/contact?subject=Corporate%20Procurement' },
    { label: 'Customer Support', href: '/contact' },
  ];

  return (
    <footer className="relative bg-[#06090E] text-zinc-300 border-t border-zinc-800/80 pt-16 pb-12 mt-20">
      {/* Ambient Radial Tech Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-40 pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(16, 185, 129, 0.4) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* =========================================================
            TOP SECTION: BRAND & MULTI-COLUMN NAVIGATION
            ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand Presentation (Col 4) */}
          <div className="lg:col-span-4 space-y-5">
            <Logo light={true} size="large" />

            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm font-light">
              NEXBUY ENTERPRISES PVT LTD delivers top-tier technology gear, high-fidelity acoustics, smart wearables, and computer accessories with authentic manufacturer warranties and Pan-India delivery.
            </p>

            {/* Business Verification Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>GST Registered: <strong className="text-white font-mono">33AMCN1317Q1Z5</strong></span>
            </div>

            {/* Quick Contact Points */}
            <div className="space-y-2 pt-2 text-xs">
              <a
                href="mailto:reach2nexbuy@gmail.com"
                className="flex items-center gap-2.5 text-zinc-300 hover:text-emerald-400 transition-colors group"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>reach2nexbuy@gmail.com</span>
              </a>
              <div className="flex flex-col gap-1 text-zinc-300">
                <a
                  href="tel:+917448376974"
                  className="flex items-center gap-2.5 hover:text-emerald-400 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>+91 74483 76974 (Mobile)</span>
                </a>
                <a
                  href="tel:+919789033393"
                  className="flex items-center gap-2.5 hover:text-emerald-400 transition-colors pl-6 text-zinc-400"
                >
                  <span>+91 97890 33393 (Mobile)</span>
                </a>
                <a
                  href="tel:+914431544371"
                  className="flex items-center gap-2.5 hover:text-emerald-400 transition-colors pl-6 text-zinc-400"
                >
                  <span>+91 44 3154 4371 (Office)</span>
                </a>
              </div>
            </div>
          </div>

          {/* Technology Categories (Col 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Tech Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="text-zinc-400 hover:text-white transition-colors duration-200 inline-flex items-center gap-1 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-zinc-700 group-hover:bg-emerald-400 transition-colors" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links (Col 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="text-zinc-400 hover:text-white transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service & Support (Col 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Customer Support
            </h4>
            <ul className="space-y-2 text-xs">
              {customerService.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="text-zinc-400 hover:text-white transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="pt-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-zinc-900 hover:bg-emerald-500 hover:text-zinc-950 text-xs font-bold uppercase tracking-wider border border-zinc-700/80 transition-all duration-300 text-white"
              >
                <span>Help Desk & Inquiry</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* =========================================================
            BOTH CHENNAI ADDRESSES — MANDATORY CLIENT DETAILS
            ========================================================= */}
        <div className="border-t border-zinc-800/80 pt-8 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Registered / Office Address */}
            <div className="p-5 rounded-2xl bg-[#0B0F17] border border-zinc-800/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Registered / Office Address</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Flat No. 2, Plot No. 1051, 35th Street, 18th Main Road, Anna Nagar, Chennai – 600040, Tamil Nadu, India.
              </p>
            </div>

            {/* Branch / Store Address */}
            <div className="p-5 rounded-2xl bg-[#0B0F17] border border-zinc-800/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Branch / Store Address</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                1st Floor, Shop No. F49, No. 18/19, UNO Arcade Complex, Meeran Sahib Street, Chennai – 600002, Tamil Nadu, India.
              </p>
            </div>
          </div>
        </div>

        {/* =========================================================
            BOTTOM LEGAL & COPYRIGHT
            ========================================================= */}
        <div className="border-t border-zinc-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>
            © {currentYear} <strong className="text-zinc-400 font-semibold">NEXBUY ENTERPRISES PVT LTD</strong>. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-zinc-300 transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="hover:text-zinc-300 transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/contact" className="hover:text-zinc-300 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-zinc-600">GST: 33AMCN1317Q1Z5</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
