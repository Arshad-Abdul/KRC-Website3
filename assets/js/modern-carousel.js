/**
 * Modern Carousel JavaScript for IIT Hyderabad KRC Website
 * Handles hero carousel functionality with smooth transitions and accessibility
 */

class ModernCarousel {
  constructor(element) {
    this.carousel = element;
    this.track = this.carousel.querySelector('.mc-track');
    this.items = Array.from(this.track.querySelectorAll('.mc-item'));
    this.prevBtn = this.carousel.querySelector('.mc-prev');
    this.nextBtn = this.carousel.querySelector('.mc-next');
    this.dotsContainer = this.carousel.querySelector('.mc-dots');
    
    // Configuration
    this.currentIndex = parseInt(this.carousel.dataset.startIndex) || 0;
    this.autoplayDelay = parseInt(this.carousel.dataset.autoplay) || 5000;
    this.loop = this.carousel.dataset.loop === 'true';
    this.pauseOnHover = this.carousel.dataset.pauseOnHover === 'true';
    
    // State
    this.isAutoPlaying = false;
    this.autoplayTimer = null;
    this.isTransitioning = false;
    this.touchStartX = 0;
    this.touchEndX = 0;
    
    this.init();
  }
  
  init() {
    this.createDots();
    this.setupEventListeners();
    this.updateCarousel();
    this.startAutoplay();
    
    // Mark carousel as initialized
    this.carousel.classList.add('mc-initialized');
    
    // Announce to screen readers
    this.carousel.setAttribute('aria-live', 'polite');
  }
  
  createDots() {
    if (!this.dotsContainer) return;
    
    this.dotsContainer.innerHTML = '';
    this.items.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('mc-dot');
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => this.goToSlide(index));
      this.dotsContainer.appendChild(dot);
    });
    
    this.dots = Array.from(this.dotsContainer.querySelectorAll('.mc-dot'));
  }
  
  setupEventListeners() {
    // Navigation buttons
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.previousSlide());
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextSlide());
    }
    
    // Keyboard navigation
    this.carousel.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          this.previousSlide();
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.nextSlide();
          break;
        case 'Home':
          e.preventDefault();
          this.goToSlide(0);
          break;
        case 'End':
          e.preventDefault();
          this.goToSlide(this.items.length - 1);
          break;
      }
    });
    
    // Touch/swipe support
    this.carousel.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    this.carousel.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    }, { passive: true });
    
    // Mouse drag support (optional)
    let isDragging = false;
    let startX = 0;
    
    this.carousel.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      this.carousel.style.cursor = 'grabbing';
    });
    
    this.carousel.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
    });
    
    this.carousel.addEventListener('mouseup', (e) => {
      if (!isDragging) return;
      isDragging = false;
      this.carousel.style.cursor = 'grab';
      
      const endX = e.clientX;
      const diff = startX - endX;
      
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.nextSlide();
        } else {
          this.previousSlide();
        }
      }
    });
    
    // Pause on hover
    if (this.pauseOnHover) {
      this.carousel.addEventListener('mouseenter', () => this.pauseAutoplay());
      this.carousel.addEventListener('mouseleave', () => this.resumeAutoplay());
    }
    
    // Pause when tab is not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAutoplay();
      } else {
        this.resumeAutoplay();
      }
    });
    
    // Pause when window loses focus
    window.addEventListener('blur', () => this.pauseAutoplay());
    window.addEventListener('focus', () => this.resumeAutoplay());
    
    // Handle resize
    window.addEventListener('resize', () => {
      this.updateCarousel(false);
    });
  }
  
  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.nextSlide();
      } else {
        this.previousSlide();
      }
    }
  }
  
  updateCarousel(animate = true) {
    if (this.isTransitioning && animate) return;
    
    this.isTransitioning = true;
    
    // Update transform
    const translateX = -this.currentIndex * 100;
    this.track.style.transform = `translateX(${translateX}%)`;
    
    // Update active states
    this.items.forEach((item, index) => {
      item.classList.toggle('active', index === this.currentIndex);
      item.setAttribute('aria-hidden', index !== this.currentIndex);
    });
    
    // Update dots
    if (this.dots) {
      this.dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === this.currentIndex);
        dot.setAttribute('aria-pressed', index === this.currentIndex);
      });
    }
    
    // Update button states
    if (this.prevBtn) {
      this.prevBtn.disabled = !this.loop && this.currentIndex === 0;
    }
    
    if (this.nextBtn) {
      this.nextBtn.disabled = !this.loop && this.currentIndex === this.items.length - 1;
    }
    
    // Update aria-live region
    const currentSlide = this.items[this.currentIndex];
    const slideContent = currentSlide.querySelector('.mc-card-body h2')?.textContent || `Slide ${this.currentIndex + 1}`;
    this.carousel.setAttribute('aria-label', `${slideContent}. Slide ${this.currentIndex + 1} of ${this.items.length}`);
    
    // Reset transition flag after animation
    if (animate) {
      setTimeout(() => {
        this.isTransitioning = false;
      }, 600);
    } else {
      this.isTransitioning = false;
    }
  }
  
  goToSlide(index) {
    if (index < 0 || index >= this.items.length || index === this.currentIndex) return;
    
    this.currentIndex = index;
    this.updateCarousel();
    this.restartAutoplay();
  }
  
  nextSlide() {
    if (this.currentIndex < this.items.length - 1) {
      this.currentIndex++;
    } else if (this.loop) {
      this.currentIndex = 0;
    } else {
      return;
    }
    
    this.updateCarousel();
    this.restartAutoplay();
  }
  
  previousSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else if (this.loop) {
      this.currentIndex = this.items.length - 1;
    } else {
      return;
    }
    
    this.updateCarousel();
    this.restartAutoplay();
  }
  
  startAutoplay() {
    if (this.autoplayDelay <= 0) return;
    
    this.isAutoPlaying = true;
    this.autoplayTimer = setInterval(() => {
      if (!this.isTransitioning) {
        this.nextSlide();
      }
    }, this.autoplayDelay);
  }
  
  pauseAutoplay() {
    this.isAutoPlaying = false;
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }
  
  resumeAutoplay() {
    if (!this.isAutoPlaying && this.autoplayDelay > 0) {
      this.startAutoplay();
    }
  }
  
  restartAutoplay() {
    this.pauseAutoplay();
    this.resumeAutoplay();
  }
  
  destroy() {
    this.pauseAutoplay();
    // Remove event listeners and clean up
    this.carousel.classList.remove('mc-initialized');
  }
  
  // Static method to auto-initialize all carousels
  static autoInit() {
    const carousels = document.querySelectorAll('.modern-carousel:not(.mc-initialized)');
    carousels.forEach(carousel => new ModernCarousel(carousel));
  }
  
  // Static method to get carousel instance
  static getInstance(element) {
    return element._modernCarousel;
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ModernCarousel.autoInit);
} else {
  ModernCarousel.autoInit();
}

// Initialize on dynamic content
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === 1) { // Element node
        if (node.classList && node.classList.contains('modern-carousel')) {
          new ModernCarousel(node);
        } else {
          const carousels = node.querySelectorAll && node.querySelectorAll('.modern-carousel:not(.mc-initialized)');
          if (carousels) {
            carousels.forEach(carousel => new ModernCarousel(carousel));
          }
        }
      }
    });
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Expose to global scope
window.ModernCarousel = ModernCarousel;

// Handle image loading for better performance
document.addEventListener('DOMContentLoaded', () => {
  const carouselImages = document.querySelectorAll('.modern-carousel img[loading="lazy"]');
  
  // Preload the first few images
  carouselImages.forEach((img, index) => {
    if (index < 2) { // Preload first 2 images
      img.loading = 'eager';
    }
  });
  
  // Intersection Observer for lazy loading
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imageObserver.unobserve(img);
        }
      });
    });
    
    carouselImages.forEach(img => {
      if (img.dataset.src) {
        imageObserver.observe(img);
      }
    });
  }
});

// Add smooth scrolling for anchor links in carousel
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (link) {
    const href = link.getAttribute('href');
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
});

// Performance optimization: Use requestAnimationFrame for smooth animations
let ticking = false;

function updateCarouselPerformance() {
  // Update any performance-critical carousel operations here
  ticking = false;
}

function requestCarouselUpdate() {
  if (!ticking) {
    requestAnimationFrame(updateCarouselPerformance);
    ticking = true;
  }
}

// Add error handling for images
document.addEventListener('error', (e) => {
  if (e.target.tagName === 'IMG' && e.target.closest('.modern-carousel')) {
    const img = e.target;
    const fallbackSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
    
    if (img.src !== fallbackSrc) {
      img.src = fallbackSrc;
      img.alt = 'Image not available';
    }
  }
}, true);
