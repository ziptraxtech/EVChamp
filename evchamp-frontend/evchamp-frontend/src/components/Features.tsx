import React from 'react';
import { ScrollReveal } from './ScrollReveal';

// delete this if unused
const features = [
	{
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth={2}
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M13 16h-1v-4h-1m1-4h.01"
				/>
			</svg>
		),
		title: 'Plug & Play Compatibility',
		desc: 'Easy installation for OBD and non-OBD vehicles. Get started with your EV fleet instantly.',
	},
	{
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth={2}
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
				/>
			</svg>
		),
		title: '4G Connectivity & GNSS',
		desc: 'Reliable 4G with 2G fallback and GNSS for accurate real-time tracking and analytics.',
	},
	{
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth={2}
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M9 17v-2a4 4 0 018 0v2m-4-4v-4a4 4 0 10-8 0v4m4 4v2a4 4 0 01-8 0v-2m8 0a4 4 0 018 0v2"
				/>
			</svg>
		),
		title: 'Real-Time Battery & Energy Analytics',
		desc: 'Monitor battery status, energy usage, and get actionable insights for every vehicle.',
	},
	{
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth={2}
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
		),
		title: 'Immobilizer, Geofencing & Theft Alerts',
		desc: 'Advanced security with immobilizer, geofencing, and instant theft alerts for your fleet.',
	},
	{
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth={2}
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V4a2 2 0 012-2h8a2 2 0 012 2v4z"
				/>
			</svg>
		),
		title: 'Cloud Synchronization',
		desc: 'Seamless data sync between IoT hardware and the EVChamp dashboard for real-time control.',
	},
];

const Features: React.FC = () => (
	<section id="features" className="py-12 sm:py-20 bg-transparent">
		<div className="container mx-auto px-4 sm:px-6">
			<ScrollReveal className="text-center mb-12">
				<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
					ZipTRAX Battery Analyzer
				</h2>
				<p className="mt-4 text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
					Ziptrax extends the life of Li-ion batteries by combining it with our
					AI-based Technology. It has a vision to provide the world with greener,
					smarter and longer lasting lithium ion batteries.
				</p>
			</ScrollReveal>
			<div className="text-center mt-8">
				<a
					href="/ziptrax"
					className="inline-block bg-gradient-to-r from-blue-300 to-blue-700 text-white font-bold text-base sm:text-lg px-6 sm:px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition"
				>
					Explore Ziptrax Opportunities
				</a>
			</div>
		</div>
	</section>
);

export default Features;