const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(createProxyMiddleware('/api',
    { target: 'http://localhost:4001' }
  ));
  app.use(createProxyMiddleware('/videos',
    { target: 'http://localhost:4001' }
  ));
}
