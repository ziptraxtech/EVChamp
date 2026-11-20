import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import { Phone, Mail, MapPin, Zap, CheckCircle2, Send, Building2, ArrowRight } from 'lucide-react';
import Footer from '../Footer';

const inquiryTypes = [
  'EV Marketplace Support',
  'Battery Diagnostics & Vehicle Inquiry',
  'IoT Hardware & Software Plans',
  'Charging Station Partnership',
  'Roadside Assistance',
  'Franchise Partnership',
  'ZipAsset Investment Inquiry',
  'EVTruLife & AI Assistance',
  'General Inquiry',
];

const helpTopics = [
  'EV marketplace support',
  'Battery diagnostics & vehicle inquiries',
  'IoT hardware & software plans',
  'Charging station partnerships',
  'Roadside assistance',
  'Franchise partnership requests',
  'ZipAsset investment inquiries',
  'EVTruLife & AI assistance support',
];

const PHONE_DISPLAY = '+91 83686 81769';
const PHONE_HREF = 'tel:+918368681769';
const EMAIL = 'contact@zipsureai.com';
const ADDRESS = 'MGF Metropolis Mall, MG Road, Gurgaon, Haryana – 122002';
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;

const BRAND_GRADIENT = 'linear-gradient(120deg, #0a8a52, #1257c4)';

const inputClass =
  'w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent';

const Field: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({ label, required, children }) => (
  <label className="block">
    <span className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}
      {required && <span className="text-green-600"> *</span>}
    </span>
    {children}
  </label>
);

const emptyForm = { name: '', email: '', phone: '', state: '', company: '', inquiryType: '', message: '' };

const ContactUs: React.FC = () => {
  const [searchParams] = useSearchParams();

  // Deep links such as /contact?type=Franchise%20Partnership&plan=Plan%20A pre-fill the form.
  const [formData, setFormData] = useState(() => {
    const type = searchParams.get('type') ?? '';
    const plan = searchParams.get('plan');
    return {
      ...emptyForm,
      inquiryType: inquiryTypes.includes(type) ? type : '',
      message: plan ? `I'm interested in the EVChamp franchise ${plan}. Please share the next steps.` : '',
    };
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to send');
      setSubmitted(true);
      setFormData(emptyForm);
    } catch {
      setError('Something went wrong. Please try again or email us directly.');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { icon: Phone, title: 'Call us', value: PHONE_DISPLAY, href: PHONE_HREF, external: false },
    { icon: Mail, title: 'Email us', value: EMAIL, href: `mailto:${EMAIL}`, external: false },
    { icon: MapPin, title: 'Visit us', value: 'MG Road, Gurgaon', href: MAPS_URL, external: true },
  ];

  return (
    <div className="bg-white min-h-screen">
      <Helmet>
        <title>Contact EVChamp | EV Marketplace, Charging, Fleet Solutions &amp; Partnerships</title>
        <meta name="description" content="Contact EVChamp for EV marketplace support, charging network inquiries, IoT plans, software subscriptions, roadside assistance, franchise partnerships, and ZipAsset plans." />
        <meta name="keywords" content="contact EVChamp, EV support India, EV partnership contact, EV fleet solutions, EV business inquiry" />
      </Helmet>

      {/* Hero */}
      <section
        className="relative overflow-hidden text-white"
        style={{ backgroundImage: "url('/investyz.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-slate-950/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-900/50 to-slate-900/30" />
        <div className="relative container mx-auto px-4 sm:px-6 pt-16 pb-28 sm:pt-20 sm:pb-32 text-center max-w-3xl">
          <span className="inline-block rounded-full bg-white/10 border border-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-green-300 mb-4">
            Contact EVChamp
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Let's Connect</h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            Questions about EVChamp services, franchise plans, marketplace listings, charging access, or ZipAsset? Our team will guide you to the right place.
          </p>
        </div>
      </section>

      {/* Quick actions — overlap the hero */}
      <section className="relative -mt-16 sm:-mt-20 z-10">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map(({ icon: Icon, title, value, href, external }) => (
              <a
                key={title}
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group flex items-center gap-4 rounded-2xl bg-white p-5 border border-gray-100 shadow-lg hover:-translate-y-0.5 hover:shadow-xl hover:border-green-200 transition-all"
              >
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600 group-hover:bg-green-100 transition-colors">
                  <Icon size={20} strokeWidth={2.2} />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold uppercase tracking-wide text-gray-500">{title}</span>
                  <span className="block text-sm font-bold text-gray-900 truncate">{value}</span>
                </span>
              </a>
            ))}
            <Link
              to="/franchise"
              className="group flex items-center gap-4 rounded-2xl p-5 text-white shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all"
              style={{ background: BRAND_GRADIENT }}
            >
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white/15">
                <Zap size={20} strokeWidth={2.2} />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-semibold uppercase tracking-wide text-white/80">Franchise plans</span>
                <span className="flex items-center gap-1 text-sm font-bold">
                  View plans <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Form + Info */}
      <section className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
                {submitted ? (
                  <div className="py-10 text-center">
                    <CheckCircle2 size={48} className="mx-auto mb-4 text-green-600" strokeWidth={1.8} />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Thank you!</h2>
                    <p className="text-sm text-gray-600 max-w-sm mx-auto">
                      Your message has been received. Our team will get back to you as soon as possible.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-6 text-sm font-semibold text-green-700 hover:text-green-800 underline underline-offset-2"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Send us a message</h2>
                    <p className="text-sm text-gray-500 mt-1 mb-6">Fields marked * are required.</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Name" required>
                          <input type="text" name="name" value={formData.name} onChange={handleChange} required autoComplete="name" className={inputClass} placeholder="Your name" />
                        </Field>
                        <Field label="Email" required>
                          <input type="email" name="email" value={formData.email} onChange={handleChange} required autoComplete="email" className={inputClass} placeholder="your@email.com" />
                        </Field>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Contact Number" required>
                          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required autoComplete="tel" className={inputClass} placeholder="+91 98765 43210" />
                        </Field>
                        <Field label="State">
                          <input type="text" name="state" value={formData.state} onChange={handleChange} autoComplete="address-level1" className={inputClass} placeholder="e.g. Haryana (optional)" />
                        </Field>
                      </div>
                      <Field label="Company">
                        <input type="text" name="company" value={formData.company} onChange={handleChange} autoComplete="organization" className={inputClass} placeholder="Company name (optional)" />
                      </Field>
                      <Field label="Inquiry Type" required>
                        <select name="inquiryType" value={formData.inquiryType} onChange={handleChange} required className={inputClass}>
                          <option value="">Select inquiry type</option>
                          {inquiryTypes.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Message" required>
                        <textarea name="message" value={formData.message} onChange={handleChange} required rows={5} className={`${inputClass} resize-y`} placeholder="Tell us how we can help..." />
                      </Field>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full inline-flex items-center justify-center gap-2 text-white font-semibold py-3.5 rounded-xl shadow-md transition-all text-sm disabled:opacity-60"
                        style={{ background: BRAND_GRADIENT }}
                        onMouseEnter={(e) => !loading && (e.currentTarget.style.filter = 'brightness(1.1)')}
                        onMouseLeave={(e) => (e.currentTarget.style.filter = 'brightness(1)')}
                      >
                        {loading ? 'Sending...' : (<>Send Message <Send size={15} /></>)}
                      </button>
                      {error && (
                        <p role="alert" className="rounded-lg bg-red-50 border border-red-100 px-4 py-2.5 text-red-600 text-sm text-center">
                          {error}
                        </p>
                      )}
                    </form>
                  </>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <aside className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-green-600 border border-gray-100">
                    <Building2 size={18} />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Registered office</p>
                    <p className="text-sm font-bold text-gray-900">ZipBolt Technologies Pvt Ltd</p>
                  </div>
                </div>
                <ul className="space-y-4 text-sm">
                  <li className="flex gap-3">
                    <MapPin size={16} className="mt-0.5 flex-shrink-0 text-green-600" />
                    <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-green-700">{ADDRESS}</a>
                  </li>
                  <li className="flex gap-3">
                    <Phone size={16} className="mt-0.5 flex-shrink-0 text-green-600" />
                    <a href={PHONE_HREF} className="text-gray-700 hover:text-green-700">{PHONE_DISPLAY}</a>
                  </li>
                  <li className="flex gap-3">
                    <Mail size={16} className="mt-0.5 flex-shrink-0 text-green-600" />
                    <a href={`mailto:${EMAIL}`} className="text-gray-700 hover:text-green-700 break-all">{EMAIL}</a>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-6">
                <h3 className="text-sm font-bold text-gray-900 mb-4">How we can help</h3>
                <ul className="flex flex-wrap gap-2">
                  {helpTopics.map((topic) => (
                    <li key={topic} className="rounded-full bg-green-50 border border-green-100 px-3 py-1 text-xs font-medium text-green-800">
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 py-12 text-center max-w-3xl">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Own a high-yield EV micro-utility</h2>
          <p className="text-gray-600 text-sm mb-6">
            EVChamp is building the future of electric mobility, and we are always open to new users, partners, and collaborators.
          </p>
          <Link
            to="/franchise"
            className="inline-flex items-center gap-2 text-white font-semibold px-7 py-3.5 rounded-xl shadow-lg text-sm transition-all hover:brightness-110"
            style={{ background: BRAND_GRADIENT }}
          >
            Explore franchise plans <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactUs;
