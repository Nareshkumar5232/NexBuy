import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Lock, Mail, ChevronLeft, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/common/Logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || location.state?.redirect || '/account';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch {
      // Toast handled by AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex items-center justify-center">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-xl">
        {/* Left Column: Tech Visuals & Brand Details */}
        <div className="hidden lg:flex lg:col-span-6 relative bg-[#0B0F17] text-white p-12 flex-col justify-between overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1751200065687-a126e7c304da?auto=format&fit=crop&w=1200&q=80"
            alt="NEXBUY Tech Workspace"
            className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/70 to-transparent" />

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-emerald-400 hover:text-white transition-colors mb-6 font-bold">
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </Link>
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-400 block">
              Customer Portal
            </span>
            <h2 className="text-3xl font-black text-white mt-2 leading-tight">
              Welcome back to NEXBUY.
            </h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Sign in to manage your orders, track shipments, and access personalized tech recommendations.
            </p>
          </div>

          <div className="relative z-10 space-y-3 border-t border-slate-800 pt-6">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Genuine Consumer Electronics</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              NEXBUY ENTERPRISES PVT LTD • Chennai, India
            </span>
          </div>
        </div>

        {/* Right Column: Clean Login Form */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center space-y-6 bg-white">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Logo />
              <Link to="/register" state={{ from: location.state?.from || location.state?.redirect }} className="text-xs text-emerald-600 hover:text-emerald-700 font-bold uppercase tracking-wider">
                Create Account →
              </Link>
            </div>
            <h1 className="text-2xl font-black text-slate-900 pt-2">
              Sign In to Your Account
            </h1>
            <p className="text-xs text-slate-500">
              Enter your credentials to access your NEXBUY profile.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">
                  Password
                </label>
                <Link to="/forgot-password" className="text-[11px] font-semibold text-emerald-600 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500 cursor-pointer"
              />
              <label htmlFor="rememberMe" className="ml-2 text-xs text-slate-600 cursor-pointer">
                Keep me signed in on this device
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-[#0B0F17] hover:bg-emerald-600 active:scale-[0.99] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500">
            <span>Are you a store manager? </span>
            <Link to="/admin/login" className="font-bold text-emerald-600 hover:underline">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
