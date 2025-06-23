(function(window) {
  'use strict';

  // --- Environment Configuration ---

  // List of hostnames that are considered 'development'
  const devHosts = ['localhost', '127.0.0.1'];

  // API URLs
  const API_URLS = {
    development: 'http://localhost:3000',
    production: 'http://147.93.18.244:3000' // <-- ❗️ UPDATE THIS with your VPS server URL
  };

  // Determine the current environment
  const isDevelopment = devHosts.includes(window.location.hostname);
  const environment = isDevelopment ? 'development' : 'production';

  // --- Global API Base URL ---
  const API_BASE_URL = API_URLS[environment];

  // --- Expose to global scope ---
  window.appConfig = {
    API_BASE_URL: API_BASE_URL,
    environment: environment
  };

  // --- Log the environment for debugging ---
  console.log(`🚀 FlytEasy App running in ${window.appConfig.environment.toUpperCase()} mode.`);
  console.log(`API endpoint: ${window.appConfig.API_BASE_URL}`);

})(window); 