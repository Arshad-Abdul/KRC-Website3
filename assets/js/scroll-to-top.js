/**
 * KRC Library Scroll to Top Button
 * Smooth scroll to top with show/hide behavior
 */

class ScrollToTop {
  constructor() {
    this.scrollButton = document.getElementById('scrollToTop');
    this.scrollBtn = this.scrollButton ? this.scrollButton.querySelector('.scroll-btn') : null;
    this.isVisible = false;
    this.scrollThreshold = 300; // Show button after scrolling 300px
    this.throttleTimeout = null;
    
    this.init();
  }
  
  init() {
    if (!this.scrollButton || !this.scrollBtn) {
      console.warn('Scroll to top button not found');
      return;
    }
    
    this.bindEvents();
    this.checkScroll(); // Check initial scroll position
  }
  
  bindEvents() {
    // Scroll event with throttling for performance
    window.addEventListener('scroll', () => this.throttleScroll());
    
    // Click event for scroll to top
    this.scrollBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.scrollToTop();
    });
    
    // Keyboard support
    this.scrollBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.scrollToTop();
      }
    });
    
    // Window resize to adjust position if needed
    window.addEventListener('resize', () => this.debounce(() => {
      this.checkScroll();
    }, 250));
  }
  
  throttleScroll() {
    if (this.throttleTimeout) return;
    
    this.throttleTimeout = setTimeout(() => {
      this.checkScroll();
      this.throttleTimeout = null;
    }, 16); // ~60fps
  }
  
  checkScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const shouldShow = scrollTop > this.scrollThreshold;
    
    if (shouldShow && !this.isVisible) {
      this.showButton();
    } else if (!shouldShow && this.isVisible) {
      this.hideButton();
    }
  }
  
  showButton() {
    this.isVisible = true;
    this.scrollButton.classList.add('show');
    
    // Announce to screen readers
    this.announceToScreenReader('Scroll to top button is now available');
  }
  
  hideButton() {
    this.isVisible = false;
    this.scrollButton.classList.remove('show');
  }
  
  scrollToTop() {
    // Modern smooth scrolling
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      // Fallback for older browsers
      this.smoothScrollPolyfill();
    }
    
    // Announce to screen readers
    this.announceToScreenReader('Scrolling to top of page');
    
    // Focus management - return focus to skip link or main content
    setTimeout(() => {
      const skipLink = document.querySelector('.skip-link');
      const mainContent = document.getElementById('main-content');
      if (skipLink) {
        skipLink.focus();
      } else if (mainContent) {
        mainContent.focus();
      }
    }, 500);
  }
  
  smoothScrollPolyfill() {
    const startY = window.pageYOffset;
    const targetY = 0;
    const distance = targetY - startY;
    const duration = 800; // 800ms
    let startTime = null;
    
    const easeInOutCubic = (t) => {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    };
    
    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutCubic(progress);
      
      window.scrollTo(0, startY + distance * ease);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };
    
    requestAnimationFrame(animation);
  }
  
  announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  }
  
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // Public methods
  setScrollThreshold(pixels) {
    this.scrollThreshold = pixels;
    this.checkScroll();
  }
  
  destroy() {
    window.removeEventListener('scroll', this.throttleScroll);
    window.removeEventListener('resize', this.checkScroll);
    if (this.scrollBtn) {
      this.scrollBtn.removeEventListener('click', this.scrollToTop);
      this.scrollBtn.removeEventListener('keydown', this.handleKeydown);
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize scroll to top
  window.krcScrollToTop = new ScrollToTop();
  
  // Add to global scope for easy access
  if (typeof window.KRC === 'undefined') {
    window.KRC = {};
  }
  window.KRC.scrollToTop = window.krcScrollToTop;
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScrollToTop;
}
