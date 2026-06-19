// CRA automatically loads this file in development (no import needed).
// It forwards API calls from the dev server (localhost:3000) to the Express
// API (localhost:5001), so relative `/api/*` fetches work the same in local
// dev as they do in production (where one origin serves both). Dev-only — has
// no effect on the production build.
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.API_PROXY_TARGET || 'http://localhost:5001',
      changeOrigin: true,
    })
  );
};
