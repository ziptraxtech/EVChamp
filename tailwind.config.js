const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'media',
  theme: {
    extend: {
      // EV Marketplace (Decision Toolkit) brand tokens. These are ADDITIVE:
      // the default numbered shades (green-500, blue-600, …) used elsewhere on
      // the site are preserved via the spreads, so no existing page changes.
      // Only bare utilities (text-green, bg-panel, text-ink, …) — used solely
      // by the marketplace — resolve to these new values.
      colors: {
        green: { ...colors.green, DEFAULT: '#0a8a52', strong: '#076b40' },
        blue: { ...colors.blue, DEFAULT: '#1257c4', mid: '#1f4fd0', bright: '#2a6fe0', deep: '#13267a', ink: '#16307e' },
        ink: '#0f2133',
        body: '#5e7085',
        muted: '#94a3b8',
        panel: { DEFAULT: '#f1f5f9', 2: '#f5f8fb' },
        line: '#e4e9f0',
        divider: '#eef2f7',
      },
      fontFamily: {
        // `font-display` (Sora) for the marketplace headings. `font-sans` is
        // intentionally left untouched so the rest of the site is unaffected.
        display: ['Sora', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
