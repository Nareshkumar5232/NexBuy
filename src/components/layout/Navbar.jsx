import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Package,
  MapPin,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Phone,
  Mail,
  Flame,
  Sparkles
} from 'lucide-react';
import Logo from '../common/Logo';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useSearch } from '../../context/SearchContext';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { name: 'Shop', path: '/products' },
  { name: 'New Arrivals', path: '/products?filter=new', badge: 'New' },
  { name: 'Best Sellers', path: '/products?filter=bestseller', badge: 'Hot' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { totalItemsCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { openSearch } = useSearch();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setAccountDropdownOpen(false);
  }, [location.pathname, location.search]);

  // Click outside to close account dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAccountDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setAccountDropdownOpen(false);
    navigate('/');
  };

  const isCurrentActive = (linkPath) => {
    if (linkPath.includes('?')) {
      return location.pathname + location.search === linkPath;
    }
    return location.pathname === linkPath && !location.search;
  };

  return (
    <>
      {/* Top Notification Strip */}
      <div className="bg-black text-zinc-400 text-[11px] py-1.5 px-4 border-b border-zinc-800/80 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              NEXBUY ENTERPRISES PVT LTD
            </span>
            <span className="text-zinc-500">|</span>
            <span className="text-zinc-300">Free Express Delivery on orders over ₹1,999</span>
          </div>
          <div className="flex items-center gap-5 text-zinc-400">
            <a href="tel:+917448376974" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
              <Phone className="w-3 h-3 text-emerald-400" /> +91 74483 76974
            </a>
            <span className="text-zinc-600">•</span>
            <Link to="/contact" className="hover:text-zinc-200 transition-colors">
              Chennai Stores & Support
            </Link>
          </div>
        </div>
      </div>

      {/* Main Dark Navigation Bar — TechNest Inspired */}
      <header
        className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 bg-[#0B0F17]/95 backdrop-blur-md border-b border-zinc-800/80 ${
          scrolled ? 'py-3 shadow-lg shadow-black/20' : 'py-3.5 sm:py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Brand Logo */}
            <div className="flex items-center shrink-0">
              <Logo light={true} />
            </div>

            {/* Center: Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-7 lg:gap-9">
              {NAV_LINKS.map((link) => {
                const active = isCurrentActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-xs font-semibold tracking-wider uppercase transition-all duration-200 relative py-1.5 flex items-center gap-1.5 ${
                      active
                        ? 'text-emerald-400 font-bold'
                        : 'text-zinc-300 hover:text-white'
                    }`}
                  >
                    <span>{link.name}</span>
                    {link.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-tight ${
                          link.badge === 'Hot'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {link.badge}
                      </span>
                    )}
                    {active && (
                      <motion.div
                        layoutId="nav-active-pill"
                        className="absolute -bottom-1 left-0 right-0 h-[2px] bg-emerald-500 rounded-full"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right: Actions (Search, Wishlist, Cart, Account) */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* Search Trigger */}
              <button
                onClick={openSearch}
                className="flex items-center justify-center w-9 h-9 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer"
                title="Search gadgets & gear (⌘K)"
                aria-label="Search"
              >
                <Search className="w-4 h-4 stroke-[2]" />
              </button>

              {/* Wishlist Link */}
              <Link
                to="/wishlist"
                className="relative flex items-center justify-center w-9 h-9 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-colors"
                aria-label="Wishlist"
                title="Wishlist"
              >
                <Heart className="w-4 h-4 stroke-[2]" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 text-black text-[9px] font-black rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Cart Button */}
              <button
                onClick={openCart}
                className="relative flex items-center justify-center w-9 h-9 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer"
                aria-label="Shopping Cart"
                title="Cart"
              >
                <ShoppingBag className="w-4 h-4 stroke-[2]" />
                {totalItemsCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 text-zinc-950 text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-[#0B0F17]">
                    {totalItemsCount}
                  </span>
                )}
              </button>

              {/* Account Dropdown or Sign In */}
              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800/80 hover:bg-zinc-800 text-zinc-100 text-xs font-semibold uppercase tracking-wider border border-zinc-700/60 transition-colors cursor-pointer"
                    aria-label="User Account"
                  >
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden sm:inline max-w-[90px] truncate">{user?.name?.split(' ')[0]}</span>
                    <ChevronDown className="w-3 h-3 text-zinc-400" />
                  </button>

                  <AnimatePresence>
                    {accountDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-60 bg-[#121824] rounded-2xl shadow-2xl border border-zinc-800 py-2 z-50 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-zinc-800/80 bg-zinc-900/60">
                          <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                          <p className="text-[11px] text-zinc-400 truncate">{user?.email}</p>
                        </div>

                        <div className="py-1">
                          {isAdmin && (
                            <Link
                              to="/admin"
                              className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-emerald-400 hover:bg-zinc-800/60 transition-colors"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Admin Console</span>
                            </Link>
                          )}
                          <Link
                            to="/account"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-colors"
                          >
                            <User className="w-3.5 h-3.5 text-zinc-400" />
                            <span>My Account</span>
                          </Link>
                          <Link
                            to="/my-orders"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-colors"
                          >
                            <Package className="w-3.5 h-3.5 text-zinc-400" />
                            <span>My Orders</span>
                          </Link>
                          <Link
                            to="/wishlist"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-colors"
                          >
                            <Heart className="w-3.5 h-3.5 text-zinc-400" />
                            <span>Wishlist</span>
                          </Link>
                          <Link
                            to="/account/addresses"
                            className="flex items-center gap-2.5 px-4 py-2 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-colors"
                          >
                            <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                            <span>Saved Addresses</span>
                          </Link>
                        </div>

                        <div className="border-t border-zinc-800 pt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer text-left"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-zinc-950 text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden flex items-center justify-center w-9 h-9 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
                aria-label="Open mobile navigation menu"
              >
                <Menu className="w-5 h-5 stroke-[2]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide-in Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Content Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 right-0 w-full max-w-xs bg-[#0B0F17] shadow-2xl flex flex-col justify-between p-6 z-10 border-l border-zinc-800"
            >
              <div className="space-y-6">
                {/* Header inside drawer */}
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                  <Logo light={true} size="small" />
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation links */}
                <nav className="flex flex-col space-y-1">
                  {NAV_LINKS.map((link) => {
                    const active = isCurrentActive(link.path);
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                          active
                            ? 'bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30'
                            : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
                        }`}
                      >
                        <span>{link.name}</span>
                        {link.badge && (
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              link.badge === 'Hot'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            {link.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>

                {/* Quick Account Links for Mobile */}
                <div className="pt-4 border-t border-zinc-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-3 block">
                    Account & Orders
                  </span>
                  <Link
                    to="/my-orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-zinc-300 hover:text-white hover:bg-zinc-900"
                  >
                    <Package className="w-4 h-4 text-emerald-400" />
                    <span>My Orders</span>
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-zinc-300 hover:text-white hover:bg-zinc-900"
                  >
                    <Heart className="w-4 h-4 text-emerald-400" />
                    <span>Wishlist ({wishlistCount})</span>
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-400 bg-emerald-500/10"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Admin Management</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Bottom Support Info */}
              <div className="pt-4 border-t border-zinc-800 space-y-2 text-xs text-zinc-400">
                <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                  Chennai Headquarters
                </p>
                <div className="flex items-center gap-2 text-zinc-300 text-[11px]">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>+91 74483 76974</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300 text-[11px]">
                  <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>reach2nexbuy@gmail.com</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
