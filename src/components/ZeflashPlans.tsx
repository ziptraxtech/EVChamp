import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';

const CheckIcon = ({ color = 'text-blue-500' }: { color?: string }) => (
  <svg className={`w-4 h-4 ${color} flex-shrink-0 mt-0.5`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const BoltIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).Razorpay) { resolve(); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay'));
    document.body.appendChild(script);
  });
}

const ZeflashPlans: React.FC = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { user, isSignedIn } = useUser();

  const [numTests, setNumTests] = useState(8);
  const [validity, setValidity] = useState(12);
  const [paying, setPaying] = useState<string | null>(null);
  const [successPlan, setSuccessPlan] = useState<string | null>(null);

  const pricePerTest = 200;
  const customTotal = numTests * pricePerTest;

  const handlePlanClick = async (planName: string, amount: number, credits: number) => {
    if (!isSignedIn) { navigate('/sign-in'); return; }

    const key = process.env.REACT_APP_RAZORPAY_KEY_ID;
    if (!key) { alert('Payment not configured. Please contact support.'); return; }

    setPaying(planName);
    try {
      await loadRazorpayScript();

      // Try to create a server-side order (enables signature verification)
      let orderId = '';
      try {
        const orderRes = await fetch('/api/zeflash-create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount }),
        });
        if (orderRes.ok) {
          const orderData = await orderRes.json();
          orderId = orderData.id || '';
        }
      } catch { /* proceed without order_id */ }

      const options: any = {
        key,
        amount: Math.round(amount * 100),
        currency: 'INR',
        name: 'Zeflash',
        description: `${planName} — Battery Diagnostic Plan`,
        ...(orderId ? { order_id: orderId } : {}),
        prefill: {
          name: user?.firstName || user?.username || '',
          email: user?.primaryEmailAddress?.emailAddress || '',
        },
        theme: { color: '#2563EB' },
        handler: async (response: any) => {
          try {
            const token = await getToken();
            const creditRes = await fetch('/api/zeflash-add-credits', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                credits,
                planName,
                paymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id || '',
                razorpaySignature: response.razorpay_signature || '',
              }),
            });
            if (!creditRes.ok) throw new Error('Credit update failed');
            setSuccessPlan(planName);
          } catch (err) {
            alert('Payment received but credit update failed. Please contact support with payment ID: ' + response.razorpay_payment_id);
          }
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', () => {
        alert('Payment failed. Please try again.');
      });
      rzp.open();
    } catch (err: any) {
      alert(err.message || 'Failed to open payment. Please try again.');
    } finally {
      setPaying(null);
    }
  };

  // Success screen
  if (successPlan) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border-2 border-green-400 p-8 max-w-sm w-full text-center shadow-lg">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckIcon color="text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-500 text-sm mb-1">Your <span className="font-semibold text-gray-800">{successPlan}</span> credits have been added to ZeVault.</p>
          <p className="text-gray-400 text-xs mb-6">You can now use them for EV battery diagnostics on Zeflash.</p>
          <div className="flex flex-col gap-2">
            <button onClick={() => navigate('/zevault')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">
              View ZeVault Balance
            </button>
            <button onClick={() => setSuccessPlan(null)} className="w-full text-gray-500 hover:text-gray-700 text-sm py-2">
              Buy More Credits
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <BoltIcon />
            </div>
            <span className="font-bold text-gray-900 text-lg">Zeflash</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/zevault')}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors"
            >
              <span className="text-yellow-300"><BoltIcon /></span>
              ZeVault
            </button>
            <button
              onClick={() => { navigate('/'); window.scrollTo({ top: 0 }); }}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
              </svg>
              Back to Home
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Flexible Testing Plans</h1>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            Choose the plan that fits your needs — from one-time diagnostics to regular fleet monitoring.
          </p>
          <div className="inline-flex items-center gap-1.5 mt-4 bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm font-medium px-4 py-1.5 rounded-full">
            <BoltIcon />
            1 battery test = 1 ZeVault credit
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-start">

          {/* One Time — Trial */}
          <div className="relative bg-white rounded-2xl border-2 border-green-400 p-6 shadow-sm flex flex-col">
            <span className="absolute -top-3 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide">TRIAL</span>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900">One Time</h2>
              <p className="text-gray-400 text-sm">Try it once</p>
            </div>
            <div className="mb-1"><span className="text-4xl font-extrabold text-gray-900">₹299</span></div>
            <p className="text-gray-400 text-xs mb-5">₹299/test</p>
            <ul className="space-y-2.5 mb-6 flex-1">
              {['1 complete 20-min diagnostic', 'Instant health report', 'PDF download', 'Basic recommendations'].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-700"><CheckIcon color="text-green-500" />{f}</li>
              ))}
            </ul>
            <button
              onClick={() => handlePlanClick('One Time', 299, 1)}
              disabled={paying === 'One Time'}
              className="w-full bg-gray-900 hover:bg-black disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
            >
              {paying === 'One Time' ? 'Opening…' : 'Start Trial'}
            </button>
          </div>

          {/* Starter Pack */}
          <div className="relative bg-white rounded-2xl border-2 border-blue-400 p-6 shadow-sm flex flex-col">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900">Starter Pack</h2>
              <p className="text-gray-400 text-sm">Regular monitoring</p>
            </div>
            <div className="mb-1"><span className="text-4xl font-extrabold text-gray-900">₹999</span></div>
            <p className="text-gray-400 text-xs mb-5">4 tests • ₹250/test • Valid 1 year</p>
            <ul className="space-y-2.5 mb-6 flex-1">
              {['4 AI diagnostic tests', '1 year validity', 'Trend analysis', 'Email support'].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-700"><CheckIcon />{f}</li>
              ))}
            </ul>
            <button
              onClick={() => handlePlanClick('Starter Pack', 999, 4)}
              disabled={paying === 'Starter Pack'}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
            >
              {paying === 'Starter Pack' ? 'Opening…' : 'Get Started'}
            </button>
          </div>

          {/* Value Pack — Most Popular */}
          <div className="relative bg-white rounded-2xl border-2 border-blue-500 p-6 shadow-sm flex flex-col">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide whitespace-nowrap">MOST POPULAR</span>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900">Value Pack</h2>
              <p className="text-gray-400 text-sm">Best value</p>
            </div>
            <div className="mb-1"><span className="text-4xl font-extrabold text-blue-600">₹1,499</span></div>
            <p className="text-gray-400 text-xs mb-5">8 tests • ₹187/test • Valid 1 year</p>
            <ul className="space-y-2.5 mb-6 flex-1">
              {['8 AI diagnostic tests', '1 year validity', 'Priority scheduling', 'Advanced insights', 'Priority support'].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-700"><CheckIcon />{f}</li>
              ))}
            </ul>
            <button
              onClick={() => handlePlanClick('Value Pack', 1499, 8)}
              disabled={paying === 'Value Pack'}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
            >
              {paying === 'Value Pack' ? 'Opening…' : 'Get Value Pack'}
            </button>
          </div>

          {/* Custom Plan */}
          <div className="relative bg-white rounded-2xl border-2 border-purple-500 p-6 shadow-sm flex flex-col">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900">Custom Plan</h2>
              <p className="text-gray-400 text-sm">Tailored for you</p>
            </div>
            <div className="mb-1"><span className="text-4xl font-extrabold text-gray-900">₹{customTotal.toLocaleString('en-IN')}</span></div>
            <p className="text-gray-400 text-xs mb-4">₹200/test</p>
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-600 block mb-1">Number of tests</label>
              <input type="range" min={1} max={20} value={numTests} onChange={(e) => setNumTests(Number(e.target.value))} className="w-full accent-blue-500 h-1.5 cursor-pointer" />
              <div className="text-center text-green-500 font-bold text-sm mt-1">{numTests} tests</div>
            </div>
            <div className="mb-5">
              <label className="text-xs font-semibold text-gray-600 block mb-1">Validity period</label>
              <input type="range" min={1} max={24} value={validity} onChange={(e) => setValidity(Number(e.target.value))} className="w-full accent-blue-500 h-1.5 cursor-pointer" />
              <div className="text-center text-green-500 font-bold text-sm mt-1">{validity} months</div>
            </div>
            <ul className="space-y-2.5 mb-6 flex-1">
              {['Flexible validity', 'Volume discounts', 'Dedicated support'].map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-700"><CheckIcon color="text-blue-500" />{f}</li>
              ))}
            </ul>
            <button
              onClick={() => handlePlanClick('Custom Plan', customTotal, numTests)}
              disabled={paying === 'Custom Plan'}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
            >
              {paying === 'Custom Plan' ? 'Opening…' : 'Buy Custom Plan'}
            </button>
          </div>

        </div>

        <p className="text-center text-gray-400 text-xs mt-8">
          All plans include secure Razorpay checkout • 90%+ diagnostic accuracy • Instant report generation
        </p>
      </main>
    </div>
  );
};

export default ZeflashPlans;
