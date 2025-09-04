/**
 * KRC Library Notification Banner
 * Handles rotating announcements with smooth transitions
 */

class NotificationBanner {
  constructor() {
    this.banner = document.getElementById('notificationBanner');
    this.items = document.querySelectorAll('.notification-item');
    this.closeBtn = this.banner ? this.banner.querySelector('.notification-close') : null;
    this.toggleContainer = document.getElementById('notificationToggle');
    this.showBtn = this.toggleContainer ? this.toggleContainer.querySelector('.notification-show-btn') : null;
    this.currentIndex = 0;
    this.interval = null;
    this.isPaused = false;
    this.rotationSpeed = this.getRotationSpeed(); // Dynamic speed based on screen size
    
    this.init();
  }
  
  init() {
    if (!this.banner || this.items.length === 0) return;
    
    // Clear any previous close state for fresh start (can be removed later)
    localStorage.removeItem('krc-notification-closed');
    
    // Check if banner was previously closed (commented out for now)
    // if (localStorage.getItem('krc-notification-closed') === 'true') {
    //   this.banner.classList.add('hidden');
    //   return;
    // }
    
    this.bindEvents();
    this.startRotation();
    
    // Accessibility: Announce first notification
    this.announceToScreenReader(this.items[0].textContent);
  }
  
  bindEvents() {
    // Close button - try multiple ways to find it
    this.closeBtn = this.banner.querySelector('.notification-close');
    console.log('Banner element:', this.banner);
    console.log('Close button found:', this.closeBtn);
    console.log('Close button HTML:', this.closeBtn ? this.closeBtn.outerHTML : 'Not found');
    
    if (this.closeBtn) {
      // Add multiple event types for better compatibility
      this.closeBtn.addEventListener('click', (e) => {
        console.log('Click event triggered on close button');
        e.preventDefault();
        e.stopPropagation();
        this.closeBanner();
      });
      
      this.closeBtn.addEventListener('touchend', (e) => {
        console.log('Touch event triggered on close button');
        e.preventDefault();
        e.stopPropagation();
        this.closeBanner();
      });
      
      // Also try event delegation on the banner
      this.banner.addEventListener('click', (e) => {
        if (e.target.closest('.notification-close')) {
          console.log('Delegation click triggered');
          e.preventDefault();
          e.stopPropagation();
          this.closeBanner();
        }
      });
    } else {
      console.error('Close button not found! Check HTML structure.');
    }
    
    // Show button
    if (this.showBtn) {
      this.showBtn.addEventListener('click', (e) => {
        console.log('Show button clicked');
        e.preventDefault();
        e.stopPropagation();
        this.showBanner();
      });
    }
    
    // Pause on hover
    this.banner.addEventListener('mouseenter', () => this.pauseRotation());
    this.banner.addEventListener('mouseleave', () => this.resumeRotation());
    
    // Keyboard navigation
    this.banner.addEventListener('keydown', (e) => this.handleKeydown(e));
    
    // Touch events for mobile
    this.banner.addEventListener('touchstart', () => this.pauseRotation());
    this.banner.addEventListener('touchend', () => this.resumeRotation());
    
    // Visibility change (pause when tab is hidden)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseRotation();
      } else {
        this.resumeRotation();
      }
    });
    
    // Window resize listener removed - speed is now consistent across all screen sizes
  }
  
  startRotation() {
    if (this.items.length <= 1) return;
    
    this.interval = setInterval(() => {
      if (!this.isPaused) {
        this.nextNotification();
      }
    }, this.rotationSpeed);
  }
  
  stopRotation() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
  
  pauseRotation() {
    this.isPaused = true;
  }
  
  resumeRotation() {
    this.isPaused = false;
  }
  
  nextNotification() {
    // Hide current item
    this.items[this.currentIndex].classList.remove('active');
    
    // Move to next item
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    
    // Show next item with delay for smooth transition
    setTimeout(() => {
      this.items[this.currentIndex].classList.add('active');
      
      // Announce to screen readers
      this.announceToScreenReader(this.items[this.currentIndex].textContent);
    }, 300);
  }
  
  previousNotification() {
    // Hide current item
    this.items[this.currentIndex].classList.remove('active');
    
    // Move to previous item
    this.currentIndex = this.currentIndex === 0 ? this.items.length - 1 : this.currentIndex - 1;
    
    // Show previous item
    setTimeout(() => {
      this.items[this.currentIndex].classList.add('active');
      this.announceToScreenReader(this.items[this.currentIndex].textContent);
    }, 300);
  }
  
  closeBanner() {
    console.log('Close banner clicked'); // Debug log
    this.stopRotation();
    this.banner.classList.add('hidden');
    
    // Show the toggle button
    if (this.toggleContainer) {
      this.toggleContainer.classList.add('show');
    }
    
    // Remember user preference (but don't auto-clear it anymore)
    localStorage.setItem('krc-notification-closed', 'true');
    
    // Announce closure to screen readers
    this.announceToScreenReader('Notification banner closed. Use the notification button to show it again.');
  }
  
  handleKeydown(e) {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        this.nextNotification();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        this.previousNotification();
        break;
      case 'Escape':
        e.preventDefault();
        this.closeBanner();
        break;
      case ' ':
      case 'Enter':
        e.preventDefault();
        if (this.isPaused) {
          this.resumeRotation();
        } else {
          this.pauseRotation();
        }
        break;
    }
  }
  
  announceToScreenReader(message) {
    // Create temporary element for screen reader announcement
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = `Library notification: ${message}`;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
  
  getRotationSpeed() {
    // Consistent speed across all screen sizes
    return 25000; // 25s for all screens
  }
  
  updateRotationSpeed() {
    const newSpeed = this.getRotationSpeed();
    if (newSpeed !== this.rotationSpeed) {
      this.rotationSpeed = newSpeed;
      if (this.interval) {
        this.stopRotation();
        this.startRotation();
      }
    }
  }

  // Public methods for external control
  showBanner() {
    console.log('Showing banner'); // Debug log
    this.banner.classList.remove('hidden');
    
    // Hide the toggle button
    if (this.toggleContainer) {
      this.toggleContainer.classList.remove('show');
    }
    
    // Clear closed state and restart rotation
    localStorage.removeItem('krc-notification-closed');
    this.startRotation();
    
    // Announce to screen readers
    this.announceToScreenReader('Notification banner restored');
  }
  
  addNotification(text) {
    const newItem = document.createElement('span');
    newItem.className = 'notification-item';
    newItem.textContent = text;
    
    document.querySelector('.notification-text').appendChild(newItem);
    this.items = document.querySelectorAll('.notification-item');
  }
  
  updateNotification(index, text) {
    if (this.items[index]) {
      this.items[index].textContent = text;
    }
  }
  
  setRotationSpeed(speed) {
    this.rotationSpeed = speed;
    this.stopRotation();
    this.startRotation();
  }
  
  // Update rotation to be responsive on initialization
  updateRotationForScreenSize() {
    this.rotationSpeed = this.getRotationSpeed();
    if (this.interval) {
      this.stopRotation();
      this.startRotation();
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize notification banner
  window.krcNotificationBanner = new NotificationBanner();
  
  // Add to global scope for easy access
  if (typeof window.KRC === 'undefined') {
    window.KRC = {};
  }
  window.KRC.notificationBanner = window.krcNotificationBanner;
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NotificationBanner;
}
