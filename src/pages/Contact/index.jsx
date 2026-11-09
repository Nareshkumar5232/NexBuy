import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, Phone, MapPin, CheckCircle2, ArrowRight, Clock, ShieldCheck, Send } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { feedbackService } from '../../services/feedbackService';

export default function Contact() {
  const [searchParams] = useSearchParams();
  const initialSubject = searchParams.get('subject') || 'General Inquiry';
  const skuParam = searchParams.get('sku') || '';

  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: initialSubject,
    message: skuParam ? `Inquiry regarding tech product SKU (${skuParam}). Please provide pricing, bulk availability, and delivery timeline.` : '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (searchParams.get('subject')) {
      setFormData((prev) => ({
        ...prev,
        subject: searchParams.get('subject'),
      }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await feedbackService.submitFeedback({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        category: formData.subject,
        message: formData.message,
      });
      setSubmitted(true);
      addToast('Thank you. Your inquiry has been logged in the NEXBUY support desk.', 'success', 5000);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: '',
      });
    } catch (err) {
      addToast(err.message || 'Failed to submit inquiry. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-6 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-3 border-b border-slate-200 pb-8 pt-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600">
          <span>Customer Desk & Business Locations</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Contact NEXBUY Support
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
          Whether you need product consultation, order tracking, corporate hardware procurement, or warranty assistance, our Chennai team is ready to help.
        </p>
      </div>

      {/* Main Grid: Details + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Both Addresses & Full Contact Information */}
        <div className="lg:col-span-5 space-y-6">
          {/* Registered / Office Address Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <MapPin className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                  Corporate Headquarters
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Registered / Office Address
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Flat No. 2, Plot No. 1051, 35th Street, 18th Main Road, Anna Nagar, Chennai – 600040, Tamil Nadu, India.
            </p>
          </div>

          {/* Branch / Store Address Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <MapPin className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                  Retail Showroom & Counter
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Branch / Store Address
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              1st Floor, Shop No. F49, No. 18/19, UNO Arcade Complex, Meeran Sahib Street, Chennai – 600002, Tamil Nadu, India.
            </p>
          </div>

          {/* Direct Communication Channels */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3">
              Direct Contact Lines
            </h4>

            <div className="space-y-3 text-xs">
              {/* Phone Numbers */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Telephone & Mobile
                </span>
                <div className="space-y-1 font-semibold text-slate-800">
                  <a href="tel:+917448376974" className="flex items-center gap-2 hover:text-emerald-600 transition-colors">
                    <Phone className="w-3.5 h-3.5 text-emerald-500" />
                    <span>+91 74483 76974 (Mobile)</span>
                  </a>
                  <a href="tel:+919789033393" className="flex items-center gap-2 hover:text-emerald-600 transition-colors">
                    <Phone className="w-3.5 h-3.5 text-emerald-500" />
                    <span>+91 97890 33393 (Mobile)</span>
                  </a>
                  <a href="tel:+914431544371" className="flex items-center gap-2 hover:text-emerald-600 transition-colors">
                    <Phone className="w-3.5 h-3.5 text-emerald-500" />
                    <span>+91 44 3154 4371 (Office)</span>
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1 pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Official Email
                </span>
                <a
                  href="mailto:reach2nexbuy@gmail.com"
                  className="flex items-center gap-2 font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-emerald-500" />
                  <span>reach2nexbuy@gmail.com</span>
                </a>
              </div>

              {/* GSTIN */}
              <div className="space-y-1 pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  GST Identification Number
                </span>
                <p className="font-mono font-bold text-slate-900">
                  33AMCN1317Q1Z5
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Real Backend Consultation & Support Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Send an Inquiry
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Our team responds to customer and enterprise hardware requests within 24 hours.
              </p>
            </div>

            {submitted && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-900">
                  <p className="font-bold">Inquiry Logged</p>
                  <p className="text-slate-600 mt-0.5">
                    Thank you. Your message has been received by NEXBUY support desk.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    Your Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Maya Ramesh"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    Contact Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98400 12345"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                    Category of Inquiry
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 transition-all cursor-pointer font-medium"
                  >
                    <option value="General Inquiry">General Product Inquiry</option>
                    <option value="Headphones & Audio">Headphones & True Wireless Audio</option>
                    <option value="Smartwatches & Wearables">Smartwatches & Wearables</option>
                    <option value="Keyboards & Peripherals">Keyboards, Mouse & Peripherals</option>
                    <option value="Corporate & Bulk Procurement">Corporate & Bulk Procurement</option>
                    <option value="Shipping & Order Tracking">Shipping & Order Status</option>
                    <option value="Warranty & Returns">Warranty Claim & Returns</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Message / Hardware Requirements *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your tech requirements, quantities, or question..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 transition-all resize-y"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow-[0_4px_16px_rgba(16,185,129,0.3)]"
              >
                {submitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Submit Inquiry</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
