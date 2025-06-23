/**
 * Token Manager Utility
 * Handles JWT token management across the FlytEasy application
 */

class TokenManager {
  constructor() {
    this.TOKEN_EXPIRY_HOURS = 48; // Token expires in 48 hours
    this.TOKEN_REFRESH_THRESHOLD = 2; // Refresh token 2 hours before expiry
    this.TOKEN_KEY = 'token';
    this.TIMESTAMP_KEY = 'tokenTimestamp';
  }

  /**
   * Get the current JWT token
   * @returns {string|null} The token or null if not found/expired
   */
  getToken() {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const timestamp = localStorage.getItem(this.TIMESTAMP_KEY);
    
    if (!token || !timestamp) {
      return null;
    }

    // Check if token is expired
    if (this.isTokenExpired()) {
      this.clearToken();
      return null;
    }

    return token;
  }

  /**
   * Store a new JWT token
   * @param {string} token - The JWT token to store
   */
  setToken(token) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.TIMESTAMP_KEY, Date.now().toString());
    console.log('✅ Token stored successfully');
  }

  /**
   * Clear the stored token
   */
  clearToken() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.TIMESTAMP_KEY);
    localStorage.removeItem('websettingData');
    console.log('🗑️ Token cleared');
  }

  /**
   * Check if the current token is expired
   * @returns {boolean} True if token is expired
   */
  isTokenExpired() {
    const timestamp = localStorage.getItem(this.TIMESTAMP_KEY);
    if (!timestamp) return true;

    const now = Date.now();
    const tokenAge = now - parseInt(timestamp);
    const tokenAgeHours = tokenAge / (1000 * 60 * 60);

    return tokenAgeHours >= this.TOKEN_EXPIRY_HOURS;
  }

  /**
   * Check if token is close to expiry (within refresh threshold)
   * @returns {boolean} True if token needs refresh
   */
  isTokenNearExpiry() {
    const timestamp = localStorage.getItem(this.TIMESTAMP_KEY);
    if (!timestamp) return true;

    const now = Date.now();
    const tokenAge = now - parseInt(timestamp);
    const tokenAgeHours = tokenAge / (1000 * 60 * 60);

    return tokenAgeHours >= (this.TOKEN_EXPIRY_HOURS - this.TOKEN_REFRESH_THRESHOLD);
  }

  /**
   * Get token age in hours
   * @returns {number} Token age in hours
   */
  getTokenAge() {
    const timestamp = localStorage.getItem(this.TIMESTAMP_KEY);
    if (!timestamp) return 0;

    const now = Date.now();
    const tokenAge = now - parseInt(timestamp);
    return tokenAge / (1000 * 60 * 60);
  }

  /**
   * Get remaining token validity in hours
   * @returns {number} Remaining hours
   */
  getRemainingHours() {
    const age = this.getTokenAge();
    return Math.max(0, this.TOKEN_EXPIRY_HOURS - age);
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} True if user has valid token
   */
  isAuthenticated() {
    return this.getToken() !== null;
  }

  /**
   * Redirect to login if not authenticated
   * @param {string} redirectUrl - URL to redirect to after login
   */
  requireAuth(redirectUrl = null) {
    if (!this.isAuthenticated()) {
      if (redirectUrl) {
        localStorage.setItem('redirectAfterLogin', redirectUrl);
      }
      window.location.href = '/login.html';
      return false;
    }
    return true;
  }

  /**
   * Get authorization header for API requests
   * @returns {Object} Headers object with Authorization
   */
  getAuthHeaders() {
    const token = this.getToken();
    if (!token) {
      throw new Error('No valid token found');
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Make authenticated API request
   * @param {string} url - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise} Fetch response
   */
  async authenticatedRequest(url, options = {}) {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required');
    }

    const headers = {
      ...this.getAuthHeaders(),
      ...options.headers
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    // Handle 401 Unauthorized
    if (response.status === 401) {
      this.clearToken();
      window.location.href = '/login.html';
      throw new Error('Session expired. Please log in again.');
    }

    return response;
  }

  /**
   * Show token expiry warning
   */
  showExpiryWarning() {
    const remainingHours = this.getRemainingHours();
    const warningToast = document.createElement('div');
    warningToast.className = 'warning-toast';
    warningToast.innerHTML = `
      <div class="toast-content">
        <i class="fas fa-exclamation-triangle"></i>
        <span>Your session will expire in ${Math.round(remainingHours)} hours. Please log in again for security.</span>
      </div>
    `;
    
    document.body.appendChild(warningToast);
    
    setTimeout(() => {
      warningToast.remove();
    }, 8000);
  }

  /**
   * Initialize token monitoring
   */
  initTokenMonitoring() {
    // Check token status every 5 minutes
    setInterval(() => {
      if (this.isAuthenticated()) {
        if (this.isTokenExpired()) {
          this.clearToken();
          window.location.href = '/login.html';
        } else if (this.isTokenNearExpiry()) {
          this.showExpiryWarning();
        }
      }
    }, 5 * 60 * 1000); // 5 minutes
  }
}

// Create global instance
const tokenManager = new TokenManager();

// Auto-initialize token monitoring
if (typeof window !== 'undefined') {
  tokenManager.initTokenMonitoring();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TokenManager;
} else {
  window.TokenManager = TokenManager;
  window.tokenManager = tokenManager;
} 