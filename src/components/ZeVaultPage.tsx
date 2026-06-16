import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';

const ZeVaultPage: React.FC = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { isSignedIn } = useUser();
  const [balancePaise, setBalancePaise] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSignedIn) { setBalancePaise(null); return; }

    const fetchBalance = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        if (!token) return;
        const response = await fetch('/api/zevault-credits', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Unable to load your wallet balance right now.');
        const data = await response.json();
        setBalancePaise(data.balance_paise ?? 0);
      } catch (err: any) {
        setError(err.message || 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    };

    void fetchBalance();
  }, [isSignedIn, getToken]);

  const balanceInr = balancePaise !== null ? balancePaise / 100 : null;
  const formatInr = (n: number) => `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl p-6 text-center text-slate-100">
          <span className="mx-auto mb-3 flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-300">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </span>
          <h1 className="text-xl font-semibold mb-2">Sign in to view ZeVault</h1>
          <p className="text-sm text-slate-300 mb-4">ZeVault is your unified wallet for all EVChamp services. Sign in to see your balance.</p>
          <button onClick={() => navigate('/')} className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:from-cyan-600 hover:to-blue-700">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
              Back
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-300"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                </span>
                ZeVault
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">Your unified wallet for all EVChamp services.</p>
            </div>
          </div>
          <button onClick={() => {
            const pricingSection = document.getElementById('pricing-section');
            pricingSection?.scrollIntoView({ behavior: 'smooth' });
          }} className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold px-4 py-3 hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/40">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Add Money
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Balance Card */}
        <section className="rounded-3xl border border-violet-700/50 bg-gradient-to-br from-violet-900/60 via-slate-950 to-indigo-900/60 p-6 sm:p-8 shadow-lg shadow-violet-900/40">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p className="text-sm font-semibold text-violet-200 uppercase tracking-[0.2em] mb-2">Wallet Balance</p>
              <div className="flex items-baseline gap-3">
                {loading ? (
                  <svg className="animate-spin text-yellow-300" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                ) : (
                  <span className="text-5xl sm:text-6xl font-extrabold text-yellow-300 drop-shadow-[0_0_25px_rgba(250,204,21,0.35)]">
                    {balanceInr !== null ? formatInr(balanceInr) : '—'}
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm text-violet-100/80 max-w-xl">
                Your ZeVault balance can be used for any EVChamp service — battery diagnostics, RSA, rentals, and more.
              </p>
            </div>
            <div className="space-y-3 w-full sm:w-auto sm:max-w-xs">
              <button onClick={() => {
                const pricingSection = document.getElementById('pricing-section');
                pricingSection?.scrollIntoView({ behavior: 'smooth' });
              }} className="w-full inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold px-4 py-3 hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/40">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                Add Money
              </button>
              <button onClick={() => navigate('/zeflash')} className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-violet-400/70 bg-slate-950/40 text-violet-100 text-sm font-semibold px-4 py-3 hover:bg-violet-900/50">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                Use for Diagnostic
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-red-500/60 bg-red-950/40 px-3 py-2 text-xs text-red-100 flex items-start gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              <span>{error}</span>
            </div>
          )}
        </section>

        {/* How it works */}
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-300"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
              <h2 className="text-base sm:text-lg font-semibold text-white">How ZeVault works</h2>
            </div>
            <ul className="mt-2 space-y-2 text-sm text-slate-200">
              <li>• Add money via Razorpay — your balance appears instantly.</li>
              <li>• Use balance for any EVChamp service without re-entering payment details.</li>
              <li>• One wallet, every service — diagnostics, RSA, rentals, and more.</li>
              <li>• All transactions are tracked and visible in your Razorpay receipt.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              <h2 className="text-base sm:text-lg font-semibold text-white">Service pricing</h2>
            </div>
            <ul className="mt-2 space-y-2 text-sm text-slate-200">
              <li>• EV Battery Diagnostic — <span className="text-yellow-300 font-semibold">₹299</span></li>
              <li>• RSA (Roadside Assistance) — <span className="text-yellow-300 font-semibold">₹199</span></li>
              <li>• Rental EV — <span className="text-yellow-300 font-semibold">per booking</span></li>
              <li>• More services coming soon.</li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-white mb-1">Top up and start using services</h2>
            <p className="text-sm text-slate-400">Add money to ZeVault once and pay seamlessly across all EVChamp services.</p>
          </div>
          <button onClick={() => {
            const pricingSection = document.getElementById('pricing-section');
            pricingSection?.scrollIntoView({ behavior: 'smooth' });
          }} className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold px-4 py-3 hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/40">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Add Money Now
          </button>
        </section>
          
        {/* Pricing Section */}
        <section id="pricing-section" className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl font-bold text-white-900">Flexible Testing Plans</h1>
              <p className="mt-3 text-white-700 max-w-2xl mx-auto text-lg">
                Choose the plan that fits your needs — from one-time diagnostics to regular fleet monitoring.
              </p>
              <div className="mt-3 inline-flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-full px-4 py-1.5 text-sm font-semibold text-violet-700">
                <span>⚡</span> 1 battery test = 1 ZeVault credit
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {/* First Time Trial */}
              <div className="relative rounded-2xl border-2 border-emerald-400 bg-gradient-to-br from-emerald-50 to-white p-6 hover:shadow-lg transition-all">
                <div className="absolute -top-3 right-4">
                  <span className="inline-block rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-md">
                    TRIAL
                  </span>
                </div>
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900">One Time</h3>
                  <p className="text-sm text-gray-600 mt-1">Try it once</p>
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-emerald-700">₹299</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">₹199/test</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="text-emerald-600 mt-0.5 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                    <span>1 complete 20-min diagnostic</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="text-emerald-600 mt-0.5 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                    <span>Instant health report</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="text-emerald-600 mt-0.5 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                    <span>PDF download</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="text-emerald-600 mt-0.5 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                    <span>Basic recommendations</span>
                  </li>
                </ul>
                <button
                  onClick={() => navigate('/checkout?plan=trial&tests=1&months=0&price=99')}
                  className="block w-full text-center rounded-lg bg-emerald-600 text-white font-semibold px-4 py-2.5 hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  Start Trial
                </button>
              </div>

              {/* 4 Tests Pack */}
              <div className="relative rounded-2xl border-2 border-indigo-400 bg-gradient-to-br from-indigo-50 to-white p-6 hover:shadow-lg hover:border-indigo-500 transition-all">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Starter Pack</h3>
                  <p className="text-sm text-gray-600 mt-1">Regular monitoring</p>
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-gray-900">₹1499</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">4 tests • ₹375/test • Valid 1 year</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="text-blue-600 mt-0.5 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                    <span>4 AI diagnostic tests</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="text-blue-600 mt-0.5 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                    <span>1 year validity</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="text-blue-600 mt-0.5 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                    <span>Trend analysis</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="text-blue-600 mt-0.5 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                    <span>Email support</span>
                  </li>
                </ul>
                <button
                  onClick={() => navigate('/checkout?plan=starter&tests=4&months=12&price=999')}
                  className="block w-full text-center rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold px-4 py-2.5 hover:from-blue-700 hover:to-cyan-700 shadow-md transition-all"
                >
                  Get Started
                </button>
              </div>

              {/* 8 Tests Pack - Popular */}
              <div className="relative rounded-2xl border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-white p-6 shadow-xl hover:shadow-2xl transition-all">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-block rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-1 text-xs font-bold text-white shadow-md">
                    MOST POPULAR
                  </span>
                </div>
                <div className="mb-4 mt-2">
                  <h3 className="text-xl font-bold text-gray-900">Value Pack</h3>
                  <p className="text-sm text-gray-600 mt-1">Best value</p>
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-blue-700">₹2,499</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">8 tests • ₹312/test • Valid 1 year</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="text-blue-600 mt-0.5 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                    <span>8 AI diagnostic tests</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="text-blue-600 mt-0.5 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                    <span>1 year validity</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="text-blue-600 mt-0.5 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                    <span>Priority scheduling</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="text-blue-600 mt-0.5 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                    <span>Advanced insights</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="text-blue-600 mt-0.5 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                    <span>Priority support</span>
                  </li>
                </ul>
                <button
                  onClick={() => navigate('/checkout?plan=value&tests=8&months=12&price=1499')}
                  className="block w-full text-center rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold px-4 py-2.5 hover:from-blue-700 hover:to-cyan-700 shadow-md transition-all"
                >
                  Get Value Pack
                </button>
              </div>

              {/* Custom Plan */}
              <div className="relative rounded-2xl border-2 border-purple-600 bg-white p-6 hover:shadow-lg hover:border-pink-500 transition-all">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Custom Plan</h3>
                  <p className="text-sm text-gray-600 mt-1">Tailored for you</p>
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="custom-total-price text-4xl font-extrabold text-gray-900">₹1,600</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    <span className="custom-per-test">₹199</span>/test
                  </p>
                </div>
                
                <div className="mb-6 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Number of tests</label>
                    <input
                      type="range"
                      min="6"
                      max="24"
                      defaultValue="8"
                      className="w-full h-2 bg-gradient-to-r from-blue-200 to-blue-400 rounded-lg appearance-none cursor-pointer custom-test-slider"
                      style={{
                        background: 'linear-gradient(to right, #93c5fd 0%, #3b82f6 100%)'
                      }}
                    />
                    <div className="mt-2 text-center">
                      <span className="custom-test-count text-2xl font-bold text-blue-600">8</span>
                      <span className="text-sm text-gray-600 ml-1">tests</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Validity period</label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="1"
                      defaultValue="0"
                      className="w-full h-2 bg-gradient-to-r from-emerald-200 to-emerald-400 rounded-lg appearance-none cursor-pointer custom-month-slider"
                      style={{
                        background: 'linear-gradient(to right, #6ee7b7 0%, #10b981 100%)'
                      }}
                    />
                    <div className="mt-2 text-center">
                      <span className="custom-month-count text-2xl font-bold text-emerald-600">12</span>
                      <span className="text-sm text-gray-600 ml-1">months</span>
                    </div>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="text-purple-600 mt-0.5 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                    <span>Flexible validity</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="text-purple-600 mt-0.5 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                    <span>Volume discounts</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="text-purple-600 mt-0.5 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                    <span>Dedicated support</span>
                  </li>
                </ul>
                <button
                  onClick={() => {
                    const testSlider = document.querySelector('.custom-test-slider') as HTMLInputElement;
                    const monthSlider = document.querySelector('.custom-month-slider') as HTMLInputElement;
                    if (testSlider && monthSlider) {
                      const tests = testSlider.value;
                      const monthStep = monthSlider.value;
                      const monthOptions = [12, 18, 24];
                      const months = monthOptions[parseInt(monthStep)];
                      const priceMap: { [key: number]: number } = { 12: 200, 18: 190, 24: 180 };
                      const pricePerTest = priceMap[months];
                      const totalPrice = parseInt(tests) * pricePerTest;
                      window.location.href = `/checkout?plan=custom&tests=${tests}&months=${months}&price=${totalPrice}`;
                    }
                  }}
                  className="block w-full text-center rounded-lg bg-purple-600 text-white font-semibold px-4 py-2.5 hover:bg-purple-700 transition-colors shadow-sm"
                >
                  Buy Custom Plan
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default ZeVaultPage;
