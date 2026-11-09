import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Zap,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Headphones,
  Truck,
  ArrowRight
} from 'lucide-react';
import Logo from '../../components/common/Logo';

export default function About() {
  return (
    <div className="pt-6 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      {/* 1. Large Brand Statement */}
      <div className="max-w-3xl space-y-4 pt-4 border-b border-slate-200 pb-10">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600">
          <span>About NEXBUY ENTERPRISES PVT LTD</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
          Engineered for <br />
          <span className="text-emerald-500">modern technology enthusiasts.</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          <strong className="text-slate-900 font-semibold">NEXBUY ENTERPRISES PVT LTD</strong> is a premier technology and consumer electronics company based in Chennai. We curate and deliver world-class headphones, earbuds, smartwatches, speakers, computer accessories, storage, and productivity hardware.
        </p>
      </div>

      {/* 2. Full-Width Tech Imagery */}
      <div className="relative aspect-16/9 sm:aspect-21/9 rounded-3xl overflow-hidden bg-slate-900 shadow-xl border border-slate-200/80">
        <img
          src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1600&q=80"
          alt="NEXBUY Technology Engineering"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6 sm:p-10">
          <p className="text-white text-sm sm:text-base font-semibold max-w-xl">
            From audiophile headphones to enterprise-grade networking and daily workspace ergonomics, our inventory represents cutting-edge performance.
          </p>
        </div>
      </div>

      {/* 3. Three Core Brand Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-slate-200 pt-14">
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
            01
          </div>
          <h3 className="text-xl font-bold text-slate-900">100% Genuine Tech</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            Every product in our store is sourced directly through sanctioned distributor channels, backed by manufacturer warranties and GST tax invoices.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
            02
          </div>
          <h3 className="text-xl font-bold text-slate-900">Curated Performance</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            We don't sell random gadgets. We thoroughly select devices renowned for their acoustic reproduction, build materials, battery longevity, and real-world durability.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
            03
          </div>
          <h3 className="text-xl font-bold text-slate-900">Direct Chennai Support</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            With both our registered office in Anna Nagar and retail store at Meeran Sahib Street, you have direct, real humans handling your orders, questions, and warranties.
          </p>
        </div>
      </div>

      {/* 4. Company & Registered Business Details */}
      <div className="bg-[#0B0F17] text-white rounded-3xl p-8 sm:p-12 border border-zinc-800 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-8 space-y-6">
          <Logo light={true} size="large" />

          <div>
            <h3 className="text-2xl font-black text-white">
              Official Corporate Information
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Registered with the Ministry of Corporate Affairs (MCA), India.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-zinc-300">
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                Entity Legal Name
              </span>
              <p className="font-semibold text-white">NEXBUY ENTERPRISES PVT LTD</p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                GSTIN Identification
              </span>
              <p className="font-mono font-bold text-white">33AMCN1317Q1Z5</p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                Registered / Office Address
              </span>
              <p className="leading-relaxed">
                Flat No. 2, Plot No. 1051, 35th Street, 18th Main Road, Anna Nagar, Chennai – 600040.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                Branch / Store Address
              </span>
              <p className="leading-relaxed">
                1st Floor, Shop No. F49, No. 18/19, UNO Arcade Complex, Meeran Sahib Street, Chennai – 600002.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                Phone Contact Numbers
              </span>
              <p>Mobile: +91 74483 76974 / +91 97890 33393</p>
              <p>Office: +91 44 3154 4371</p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                Official Email
              </span>
              <p className="text-emerald-400 font-medium">reach2nexbuy@gmail.com</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-3">
          <Link
            to="/products"
            className="w-full py-4 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-zinc-950 font-extrabold text-xs uppercase tracking-wider text-center transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/contact"
            className="w-full py-3.5 px-6 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-bold text-xs uppercase tracking-wider text-center transition-colors"
          >
            Contact Chennai Desk
          </Link>
        </div>
      </div>
    </div>
  );
}
