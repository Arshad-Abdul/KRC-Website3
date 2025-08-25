/**
 * Statistics Animation JavaScript for IIT Hyderabad KRC Website
 * Handles number counting animation and intersection observer
 */

class StatsAnimator {
  constructor() {
    this.statsSection = document.querySelector('.stats-section');
    this.statNumbers = document.querySelectorAll('.stat-number');
    this.animatedNumbers = new Set();
    this.observers = [];
    
    this.init();
  }
  
  init() {
    if (!this.statsSection || this.statNumbers.length === 0) return;
    
    this.setupIntersectionObserver();
    this.setupHoverEffects();
    this.setupAccessibility();
  }
  
  setupIntersectionObserver() {
    // Create intersection observer for stats section
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animatedNumbers.has(entry.target)) {
          this.animateNumber(entry.target);
          this.animatedNumbers.add(entry.target);
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '50px'
    });
    
    // Observe each stat number
    this.statNumbers.forEach(statNumber => {
      observer.observe(statNumber);
    });
    
    this.observers.push(observer);
  }
  
  animateNumber(element) {
    const target = parseInt(element.dataset.target) || 0;
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    // Add animation class
    element.classList.add('animate', 'counting');
    
    const timer = setInterval(() => {
      current += increment;
      
      if (current >= target) {
        current = target;
        clearInterval(timer);
        element.classList.remove('counting');
        element.classList.add('completed');
        
        // Add pulse effect on completion
        this.addPulseEffect(element);
      }
      
      // Format number with commas
      element.textContent = this.formatNumber(Math.floor(current));
    }, 16);
    
    // Store timer for cleanup
    element._animationTimer = timer;
  }
  
  formatNumber(num) {
    return num.toLocaleString();
  }
  
  addPulseEffect(element) {
    const statBox = element.closest('.stat-box');
    if (statBox) {
      statBox.classList.add('pulse');
      setTimeout(() => {
        statBox.classList.remove('pulse');
      }, 2000);
    }
  }
  
  setupHoverEffects() {
    const statBoxes = document.querySelectorAll('.stat-box');
    
    statBoxes.forEach(box => {
      const statNumber = box.querySelector('.stat-number');
      const originalTarget = statNumber ? parseInt(statNumber.dataset.target) : 0;
      
      box.addEventListener('mouseenter', () => {
        if (this.animatedNumbers.has(statNumber)) {
          this.showAdditionalInfo(box);
        }
      });
      
      box.addEventListener('mouseleave', () => {
        this.hideAdditionalInfo(box);
      });
      
      // Add click effect for mobile
      box.addEventListener('click', () => {
        if (this.animatedNumbers.has(statNumber)) {
          this.triggerClickEffect(box);
        }
      });
    });
  }
  
  showAdditionalInfo(statBox) {
    // Add a subtle animation to show engagement
    const statNumber = statBox.querySelector('.stat-number');
    if (statNumber && !statNumber.classList.contains('hover-effect')) {
      statNumber.classList.add('hover-effect');
      
      // Optionally show additional context
      this.showTooltip(statBox);
    }
  }
  
  hideAdditionalInfo(statBox) {
    const statNumber = statBox.querySelector('.stat-number');
    if (statNumber) {
      statNumber.classList.remove('hover-effect');
    }
    
    this.hideTooltip(statBox);
  }
  
  showTooltip(statBox) {
    const statLabel = statBox.querySelector('.stat-label');
    const tooltipText = this.getTooltipText(statLabel.textContent.toLowerCase());
    
    if (tooltipText) {
      const tooltip = document.createElement('div');
      tooltip.className = 'stat-tooltip';
      tooltip.textContent = tooltipText;
      tooltip.setAttribute('aria-live', 'polite');
      
      statBox.appendChild(tooltip);
      
      // Position tooltip
      setTimeout(() => {
        tooltip.classList.add('visible');
      }, 10);
    }
  }
  
  hideTooltip(statBox) {
    const tooltip = statBox.querySelector('.stat-tooltip');
    if (tooltip) {
      tooltip.classList.remove('visible');
      setTimeout(() => {
        if (tooltip.parentNode) {
          tooltip.parentNode.removeChild(tooltip);
        }
      }, 200);
    }
  }
  
  getTooltipText(label) {
    const tooltips = {
      'ebooks': 'Digital books and publications available 24/7',
      'books': 'Physical books in our collection',
      'theses': 'Research theses and dissertations',
      'databases': 'Academic databases and journals',
      'newspapers': 'Daily newspapers and periodicals'
    };
    
    return tooltips[label] || '';
  }
  
  triggerClickEffect(statBox) {
    statBox.classList.add('clicked');
    setTimeout(() => {
      statBox.classList.remove('clicked');
    }, 300);
    
    // Announce to screen readers
    const statLabel = statBox.querySelector('.stat-label');
    const statNumber = statBox.querySelector('.stat-number');
    const announcement = `${statLabel.textContent}: ${statNumber.textContent}`;
    this.announceToScreenReader(announcement);
  }
  
  setupAccessibility() {
    // Add proper ARIA labels
    this.statNumbers.forEach((statNumber, index) => {
      const statBox = statNumber.closest('.stat-box');
      const statLabel = statBox.querySelector('.stat-label');
      
      if (statLabel) {
        const labelText = statLabel.textContent;
        statNumber.setAttribute('aria-label', `${statNumber.textContent} ${labelText}`);
        statBox.setAttribute('role', 'img');
        statBox.setAttribute('aria-label', `Statistic: ${statNumber.textContent} ${labelText}`);
      }
    });
    
    // Add keyboard navigation
    const statBoxes = document.querySelectorAll('.stat-box');
    statBoxes.forEach((box, index) => {
      box.setAttribute('tabindex', '0');
      
      box.addEventListener('keydown', (e) => {
        switch (e.key) {
          case 'Enter':
          case ' ':
            e.preventDefault();
            this.triggerClickEffect(box);
            break;
          case 'ArrowRight':
            e.preventDefault();
            const nextBox = statBoxes[index + 1] || statBoxes[0];
            nextBox.focus();
            break;
          case 'ArrowLeft':
            e.preventDefault();
            const prevBox = statBoxes[index - 1] || statBoxes[statBoxes.length - 1];
            prevBox.focus();
            break;
        }
      });
    });
  }
  
  announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      if (announcement.parentNode) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  }
  
  // Method to manually trigger animation (useful for testing)
  triggerAnimation() {
    this.statNumbers.forEach(statNumber => {
      if (!this.animatedNumbers.has(statNumber)) {
        this.animateNumber(statNumber);
        this.animatedNumbers.add(statNumber);
      }
    });
  }
  
  // Method to reset animations
  resetAnimations() {
    this.statNumbers.forEach(statNumber => {
      // Clear any running timers
      if (statNumber._animationTimer) {
        clearInterval(statNumber._animationTimer);
        delete statNumber._animationTimer;
      }
      
      // Reset classes and content
      statNumber.classList.remove('animate', 'counting', 'completed', 'hover-effect');
      statNumber.textContent = '0';
      
      // Reset stat box
      const statBox = statNumber.closest('.stat-box');
      if (statBox) {
        statBox.classList.remove('pulse', 'clicked');
      }
    });
    
    // Clear animated numbers set
    this.animatedNumbers.clear();
  }
  
  // Cleanup method
  destroy() {
    // Clear all timers
    this.statNumbers.forEach(statNumber => {
      if (statNumber._animationTimer) {
        clearInterval(statNumber._animationTimer);
        delete statNumber._animationTimer;
      }
    });
    
    // Disconnect observers
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    
    this.observers = [];
  }
}

// Additional CSS for tooltip and effects
const statsStyles = `
  .stat-tooltip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(-10px);
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease;
    z-index: 10;
    pointer-events: none;
  }
  
  .stat-tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: rgba(0, 0, 0, 0.9);
  }
  
  .stat-tooltip.visible {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(-5px);
  }
  
  .stat-number.hover-effect {
    transform: scale(1.05) !important;
    text-shadow: 0 0 20px rgba(255, 165, 0, 0.6) !important;
  }
  
  .stat-box.clicked {
    transform: scale(0.98) !important;
    transition: transform 0.1s ease !important;
  }
  
  .stat-box:focus {
    outline: 2px solid var(--accent-yellow);
    outline-offset: 4px;
  }
  
  @media (prefers-reduced-motion: reduce) {
    .stat-number,
    .stat-box,
    .stat-tooltip {
      animation: none !important;
      transition: none !important;
    }
  }
  
  @media (max-width: 768px) {
    .stat-tooltip {
      font-size: 10px;
      padding: 6px 8px;
    }
  }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = statsStyles;
document.head.appendChild(styleSheet);

// Initialize when DOM is ready
let statsAnimator;

document.addEventListener('DOMContentLoaded', () => {
  statsAnimator = new StatsAnimator();
});

// Reinitialize on page visibility change (for better performance)
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && statsAnimator) {
    // Optionally reset and retrigger animations when page becomes visible
    setTimeout(() => {
      const statsSection = document.querySelector('.stats-section');
      if (statsSection) {
        const rect = statsSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && statsAnimator.animatedNumbers.size === 0) {
          statsAnimator.triggerAnimation();
        }
      }
    }, 500);
  }
});

// Expose to global scope for debugging
window.StatsAnimator = StatsAnimator;
window.statsAnimator = statsAnimator;

// Handle window resize for responsive behavior
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Recalculate positions if needed
    const tooltips = document.querySelectorAll('.stat-tooltip');
    tooltips.forEach(tooltip => {
      // Force recalculation of tooltip position
      tooltip.style.transform = 'translateX(-50%) translateY(-5px)';
    });
  }, 250);
});

// Performance optimization: Use Intersection Observer v2 if available
if ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window) {
  // Enhanced observer for better performance monitoring
  const performanceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const statBox = entry.target;
      if (entry.isIntersecting) {
        statBox.classList.add('in-viewport');
      } else {
        statBox.classList.remove('in-viewport');
      }
    });
  }, {
    threshold: [0, 0.25, 0.5, 0.75, 1.0]
  });
  
  document.addEventListener('DOMContentLoaded', () => {
    const statBoxes = document.querySelectorAll('.stat-box');
    statBoxes.forEach(box => {
      performanceObserver.observe(box);
    });
  });
}

// Add smooth reveal animation for the entire stats section
const revealStatsSection = () => {
  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2
    });
    
    observer.observe(statsSection);
  }
};

document.addEventListener('DOMContentLoaded', revealStatsSection);
