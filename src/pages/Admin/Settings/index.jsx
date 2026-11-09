import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/adminService';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { Settings, Save, Lock, ShieldCheck, Building2, Phone, Mail, MapPin } from 'lucide-react';

export default function AdminSettings() {
  const { changePassword } = useAuth();
  const { addToast } = useToast();

  // Settings State
  const [settings, setSettings] = useState({
    storeName: 'NEXBUY Flagship Store',
    companyName: 'NEXBUY ENTERPRISES PVT LTD',
    storeEmail: 'reach2nexbuy@gmail.com',
    storePhone: '+91 74483 76974',
    secondaryPhone: '+91 97890 33393',
    officePhone: '+91 44 3154 4371',
    gstin: '33AMCN1317Q1Z5',
    registeredOffice: 'Flat No. 2, Plot No. 1051, 35th Street, 18th Main Road, Anna Nagar, Chennai – 600040',
    branchOffice: '1st Floor, Shop No. F49, No. 18/19, UNO Arcade Complex, Meeran Sahib Street, Chennai – 600002',
    taxEnabled: false,
    taxRate: 0,
    shippingCharge: 0,
    freeShippingThreshold: 1999,
    paymentGateway: 'Razorpay',
    allowCOD: true,
  });

  const [savingSettings, setSavingSettings] = useState(false);
  const [loading, setLoading] = useState(true);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await adminService.getSettings();
      if (res) {
        setSettings((prev) => ({ ...prev, ...res }));
      }
    } catch (err) {
      console.error('Failed to load settings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      setSavingSettings(true);
      await adminService.updateSettings(settings);
      addToast('Store configuration, client details & tax rules saved successfully.', 'success');
      fetchSettings();
    } catch (err) {
      addToast(err.message || 'Failed to update settings', 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addToast('New passwords do not match.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      addToast('Password must be at least 6 characters.', 'error');
      return;
    }

    try {
      setUpdatingPassword(true);
      await changePassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      addToast('Administrator password updated successfully.', 'success');
    } catch (err) {
      // Toast handled by AuthContext
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
          Enterprise Control
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Admin Settings & Configuration
        </h1>
      </div>

      {/* Business Details & Tax Settings Form */}
      <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 space-y-6 shadow-xs">
        <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Company & Store Identity</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Official NEXBUY ENTERPRISES PVT LTD business profiles
            </p>
          </div>
          <Building2 className="w-5 h-5 text-emerald-600" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold uppercase tracking-wider text-slate-700">Company Name</label>
            <input
              type="text"
              value={settings.companyName || ''}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold uppercase tracking-wider text-slate-700">GSTIN Identification</label>
            <input
              type="text"
              value={settings.gstin || ''}
              onChange={(e) => setSettings({ ...settings, gstin: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold uppercase tracking-wider text-slate-700">Primary Mobile</label>
            <input
              type="text"
              value={settings.storePhone || ''}
              onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold uppercase tracking-wider text-slate-700">Secondary Mobile</label>
            <input
              type="text"
              value={settings.secondaryPhone || ''}
              onChange={(e) => setSettings({ ...settings, secondaryPhone: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold uppercase tracking-wider text-slate-700">Office Telephone</label>
            <input
              type="text"
              value={settings.officePhone || ''}
              onChange={(e) => setSettings({ ...settings, officePhone: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold uppercase tracking-wider text-slate-700">Official Support Email</label>
            <input
              type="email"
              value={settings.storeEmail || ''}
              onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t border-slate-100 text-xs">
          <div className="space-y-1">
            <label className="font-bold uppercase tracking-wider text-slate-700">Registered Office Address</label>
            <input
              type="text"
              value={settings.registeredOffice || ''}
              onChange={(e) => setSettings({ ...settings, registeredOffice: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold uppercase tracking-wider text-slate-700">Branch / Store Address</label>
            <input
              type="text"
              value={settings.branchOffice || ''}
              onChange={(e) => setSettings({ ...settings, branchOffice: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Tax & GST Rules */}
        <div className="border-t border-slate-100 pt-5 space-y-4 text-xs">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Tax & GST Calculation Rules</h3>
            <p className="text-slate-500 mt-0.5">
              Notice: GST is ₹0 unless explicitly toggled on below.
            </p>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.taxEnabled}
              onChange={(e) => setSettings({ ...settings, taxEnabled: e.target.checked })}
              className="w-4 h-4 rounded text-emerald-600 accent-emerald-600 cursor-pointer"
            />
            <span className="font-bold text-slate-900">Enable Automatic GST / Tax Rule</span>
          </label>

          {settings.taxEnabled && (
            <div className="space-y-1 w-full sm:w-60">
              <label className="font-bold uppercase tracking-wider text-slate-700">Tax Rate (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={settings.taxRate}
                onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}
        </div>

        {/* Shipping Thresholds */}
        <div className="border-t border-slate-100 pt-5 space-y-3 text-xs">
          <h3 className="font-bold text-sm text-slate-900">Shipping Rates</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-slate-700">Base Shipping Charge (₹)</label>
              <input
                type="number"
                min="0"
                value={settings.shippingCharge}
                onChange={(e) => setSettings({ ...settings, shippingCharge: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-slate-700">Free Shipping Threshold (₹)</label>
              <input
                type="number"
                min="0"
                value={settings.freeShippingThreshold}
                onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={savingSettings}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-500/20 disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{savingSettings ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>

      {/* Password Change Card */}
      <form onSubmit={handleChangePassword} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 space-y-5 shadow-xs">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">Change Administrator Password</h2>
          <p className="text-xs text-slate-500 mt-0.5">Secure salted bcrypt hash updated directly on the backend database.</p>
        </div>

        <div className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="font-bold uppercase tracking-wider text-slate-700">Current Password *</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full sm:w-80 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-slate-700">New Password *</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-slate-700">Confirm New Password *</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            type="submit"
            disabled={updatingPassword}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50 transition-colors"
          >
            <Lock className="w-4 h-4" />
            <span>{updatingPassword ? 'Updating...' : 'Update Password'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
