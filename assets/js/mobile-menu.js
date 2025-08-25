/**
 * Mobile Menu JavaScript for IIT Hyderabad KRC Website
 * Handles mobile navigation, dropdown menus, and accessibility
 */

class MobileMenu {
  constructor() {
    this.menuToggle = document.getElementById('mobileMenuToggle');
    this.menuOverlay = document.getElementById('mobileMenuOverlay');
    this.mobileMenu = document.getElementById('mobileMenu');
    this.body = document.body;
    this.isOpen = false;
    
    // Dropdown elements
    this.dropdownTriggers = document.querySelectorAll('.mobile-nav-link[data-dropdown]');
    this.dropdowns = document.querySelectorAll('.mobile-dropdown');
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.setupDropdowns();
    this.setupAccessibility();
  }
  
  setupEventListeners() {
    // Menu toggle button
    if (this.menuToggle) {
      console.log('Mobile menu toggle button found and event listener added');
      this.menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Mobile menu toggle clicked');
        console.log('Current isOpen state:', this.isOpen);
        console.log('Menu overlay element:', this.menuOverlay);
        this.toggle();
      });
      
      // Also add a direct test click handler
      this.menuToggle.addEventListener('click', () => {
        console.log('Direct click handler triggered');
        if (this.menuOverlay) {
          console.log('Adding active class directly to overlay');
          this.menuOverlay.classList.add('active');
          document.body.classList.add('menu-open');
        }
      });
    } else {
      console.error('Mobile menu toggle button not found!');
    }
    
    // Overlay click to close
    if (this.menuOverlay) {
      this.menuOverlay.addEventListener('click', (e) => {
        if (e.target === this.menuOverlay) {
          this.close();
        }
      });
    }
    
    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.menuOverlay.contains(e.target) && !this.menuToggle.contains(e.target)) {
        this.close();
      }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && this.isOpen) {
        this.close();
      }
    });
    
    // Prevent scroll when menu is open
    this.menuOverlay.addEventListener('touchmove', (e) => {
      if (this.isOpen) {
        e.preventDefault();
      }
    }, { passive: false });
  }
  
  setupDropdowns() {
    this.dropdownTriggers.forEach(trigger => {
      const dropdownId = trigger.dataset.dropdown;
      const dropdown = trigger.nextElementSibling;
      
      if (dropdown && dropdown.classList.contains('mobile-dropdown')) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          this.toggleDropdown(trigger, dropdown);
        });
        
        // Set initial ARIA attributes
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-controls', `mobile-dropdown-${dropdownId}`);
        dropdown.setAttribute('id', `mobile-dropdown-${dropdownId}`);
      }
    });
  }
  
  setupAccessibility() {
    // Set ARIA attributes
    if (this.menuToggle) {
      this.menuToggle.setAttribute('aria-expanded', 'false');
      this.menuToggle.setAttribute('aria-controls', 'mobileMenuOverlay');
    }
    
    if (this.menuOverlay) {
      this.menuOverlay.setAttribute('role', 'dialog');
      this.menuOverlay.setAttribute('aria-modal', 'true');
      this.menuOverlay.setAttribute('aria-label', 'Mobile navigation menu');
    }
    
    // Focus management
    this.setupFocusManagement();
  }
  
  setupFocusManagement() {
    if (!this.menuOverlay) return;
    
    const focusableElements = this.menuOverlay.querySelectorAll(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    this.firstFocusableElement = focusableElements[0];
    this.lastFocusableElement = focusableElements[focusableElements.length - 1];
    
    // Trap focus within menu
    this.menuOverlay.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === this.firstFocusableElement) {
            e.preventDefault();
            this.lastFocusableElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === this.lastFocusableElement) {
            e.preventDefault();
            this.firstFocusableElement.focus();
          }
        }
      }
    });
  }
  
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
  
  open() {
    console.log('🔄 Open method called, current isOpen:', this.isOpen);
    if (this.isOpen) {
      console.log('⚠️ Menu already open, returning');
      return;
    }
    
    console.log('✅ Opening mobile menu');
    this.isOpen = true;
    
    // Update classes and attributes
    console.log('Adding active class to toggle button:', this.menuToggle);
    this.menuToggle?.classList.add('active');
    
    console.log('Adding active class to overlay:', this.menuOverlay);
    this.menuOverlay?.classList.add('active');
    
    console.log('Adding menu-open class to body');
    this.body.classList.add('menu-open');
    
    // Check if classes were actually added
    console.log('Toggle has active class:', this.menuToggle?.classList.contains('active'));
    console.log('Overlay has active class:', this.menuOverlay?.classList.contains('active'));
    console.log('Body has menu-open class:', this.body.classList.contains('menu-open'));
    
    console.log('✅ Mobile menu classes added');
    
    // Update ARIA attributes
    this.menuToggle?.setAttribute('aria-expanded', 'true');
    
    // Prevent body scroll
    this.body.style.overflow = 'hidden';
    
    // Focus management
    if (this.firstFocusableElement) {
      setTimeout(() => {
        this.firstFocusableElement.focus();
      }, 100);
    }
    
    // Animate menu items
    this.animateMenuItems();
    
    // Announce to screen readers
    this.announceToScreenReader('Menu opened');
  }
  
  close() {
    if (!this.isOpen) return;
    
    this.isOpen = false;
    
    // Update classes and attributes
    this.menuToggle?.classList.remove('active');
    this.menuOverlay?.classList.remove('active');
    this.body.classList.remove('menu-open');
    
    // Update ARIA attributes
    this.menuToggle?.setAttribute('aria-expanded', 'false');
    
    // Restore body scroll
    this.body.style.overflow = '';
    
    // Close all dropdowns
    this.closeAllDropdowns();
    
    // Return focus to toggle button
    if (this.menuToggle) {
      this.menuToggle.focus();
    }
    
    // Announce to screen readers
    this.announceToScreenReader('Menu closed');
  }
  
  toggleDropdown(trigger, dropdown) {
    const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
    
    // Close all other dropdowns
    this.closeAllDropdowns();
    
    if (!isExpanded) {
      // Open this dropdown
      dropdown.classList.add('active');
      trigger.setAttribute('aria-expanded', 'true');
      
      // Animate dropdown items
      this.animateDropdownItems(dropdown);
    }
  }
  
  closeAllDropdowns() {
    this.dropdowns.forEach(dropdown => {
      dropdown.classList.remove('active');
    });
    
    this.dropdownTriggers.forEach(trigger => {
      trigger.setAttribute('aria-expanded', 'false');
    });
  }
  
  animateMenuItems() {
    const menuItems = this.menuOverlay.querySelectorAll('.mobile-nav-item');
    menuItems.forEach((item, index) => {
      item.style.animationDelay = `${index * 0.1}s`;
      item.classList.add('animate-in');
    });
  }
  
  animateDropdownItems(dropdown) {
    const dropdownItems = dropdown.querySelectorAll('.mobile-dropdown-item');
    dropdownItems.forEach((item, index) => {
      item.style.animationDelay = `${index * 0.05}s`;
      item.classList.add('animate-in');
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
      document.body.removeChild(announcement);
    }, 1000);
  }
}

// Desktop dropdown functionality
class DesktopDropdowns {
  constructor() {
    this.dropdowns = document.querySelectorAll('.header_menu .dropdown');
    this.activeDropdown = null;
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.setupAccessibility();
  }
  
  setupEventListeners() {
    this.dropdowns.forEach(dropdown => {
      const trigger = dropdown.querySelector('span');
      const menu = dropdown.querySelector('.dropdown-menu');
      
      if (trigger && menu) {
        // Mouse events
        dropdown.addEventListener('mouseenter', () => {
          this.openDropdown(dropdown, trigger, menu);
        });
        
        dropdown.addEventListener('mouseleave', () => {
          this.closeDropdown(dropdown, trigger, menu);
        });
        
        // Keyboard events
        trigger.addEventListener('keydown', (e) => {
          switch (e.key) {
            case 'Enter':
            case ' ':
              e.preventDefault();
              this.toggleDropdown(dropdown, trigger, menu);
              break;
            case 'ArrowDown':
              e.preventDefault();
              this.openDropdown(dropdown, trigger, menu);
              this.focusFirstMenuItem(menu);
              break;
            case 'Escape':
              this.closeDropdown(dropdown, trigger, menu);
              trigger.focus();
              break;
          }
        });
        
        // Handle menu item navigation
        const menuItems = menu.querySelectorAll('a');
        menuItems.forEach((item, index) => {
          item.addEventListener('keydown', (e) => {
            switch (e.key) {
              case 'ArrowDown':
                e.preventDefault();
                const nextItem = menuItems[index + 1] || menuItems[0];
                nextItem.focus();
                break;
              case 'ArrowUp':
                e.preventDefault();
                const prevItem = menuItems[index - 1] || menuItems[menuItems.length - 1];
                prevItem.focus();
                break;
              case 'Escape':
                this.closeDropdown(dropdown, trigger, menu);
                trigger.focus();
                break;
              case 'Tab':
                if (e.shiftKey && index === 0) {
                  this.closeDropdown(dropdown, trigger, menu);
                } else if (!e.shiftKey && index === menuItems.length - 1) {
                  this.closeDropdown(dropdown, trigger, menu);
                }
                break;
            }
          });
        });
      }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.dropdown')) {
        this.closeAllDropdowns();
      }
    });
  }
  
  setupAccessibility() {
    this.dropdowns.forEach(dropdown => {
      const trigger = dropdown.querySelector('span');
      const menu = dropdown.querySelector('.dropdown-menu');
      
      if (trigger && menu) {
        trigger.setAttribute('aria-haspopup', 'true');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('role', 'button');
        trigger.setAttribute('tabindex', '0');
        
        const menuId = `dropdown-${Math.random().toString(36).substr(2, 9)}`;
        menu.setAttribute('id', menuId);
        trigger.setAttribute('aria-controls', menuId);
        
        menu.setAttribute('role', 'menu');
        menu.querySelectorAll('a').forEach(item => {
          item.setAttribute('role', 'menuitem');
        });
      }
    });
  }
  
  openDropdown(dropdown, trigger, menu) {
    this.closeAllDropdowns();
    dropdown.classList.add('active');
    trigger.setAttribute('aria-expanded', 'true');
    this.activeDropdown = dropdown;
  }
  
  closeDropdown(dropdown, trigger, menu) {
    dropdown.classList.remove('active');
    trigger.setAttribute('aria-expanded', 'false');
    if (this.activeDropdown === dropdown) {
      this.activeDropdown = null;
    }
  }
  
  toggleDropdown(dropdown, trigger, menu) {
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      this.closeDropdown(dropdown, trigger, menu);
    } else {
      this.openDropdown(dropdown, trigger, menu);
    }
  }
  
  closeAllDropdowns() {
    this.dropdowns.forEach(dropdown => {
      const trigger = dropdown.querySelector('span');
      const menu = dropdown.querySelector('.dropdown-menu');
      if (trigger && menu) {
        this.closeDropdown(dropdown, trigger, menu);
      }
    });
  }
  
  focusFirstMenuItem(menu) {
    const firstItem = menu.querySelector('a');
    if (firstItem) {
      firstItem.focus();
    }
  }
}

// Initialize when DOM is ready
console.log('Mobile menu script file loaded');

// Simple test function
function testMobileMenuButton() {
  const button = document.getElementById('mobileMenuToggle');
  const overlay = document.getElementById('mobileMenuOverlay');
  
  if (button) {
    console.log('✅ Mobile menu button found:', button);
    console.log('Button computed style display:', window.getComputedStyle(button).display);
    
    // Add a simple test click handler that bypasses the class
    button.addEventListener('click', function() {
      console.log('🧪 Test click handler - forcing menu to show');
      if (overlay) {
        overlay.style.opacity = '1';
        overlay.style.visibility = 'visible';
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
        console.log('🧪 Menu forced to show with inline styles');
      }
    });
  } else {
    console.error('❌ Mobile menu button NOT found');
  }
  
  if (overlay) {
    console.log('✅ Mobile menu overlay found:', overlay);
    console.log('Overlay computed styles:', {
      opacity: window.getComputedStyle(overlay).opacity,
      visibility: window.getComputedStyle(overlay).visibility,
      zIndex: window.getComputedStyle(overlay).zIndex
    });
  } else {
    console.error('❌ Mobile menu overlay NOT found');
  }
}

function initializeMobileMenu() {
  console.log('Initializing mobile menu');
  testMobileMenuButton();
  new MobileMenu();
  new DesktopDropdowns();
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('Mobile menu script loaded and DOM ready');
  initializeMobileMenu();
});

// Also try immediate initialization if DOM is already loaded
if (document.readyState === 'loading') {
  // DOM not yet loaded
  console.log('DOM still loading, waiting...');
} else {
  // DOM already loaded
  console.log('DOM already loaded, initializing immediately');
  initializeMobileMenu();
}

// Add smooth scrolling for navigation links
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (link) {
    const href = link.getAttribute('href');
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      
      // Close mobile menu if open
      const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
      if (mobileMenuOverlay && mobileMenuOverlay.classList.contains('active')) {
        const mobileMenu = new MobileMenu();
        mobileMenu.close();
      }
      
      // Smooth scroll to target
      const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
      const targetPosition = target.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }
});

// Header scroll effect
let lastScrollY = window.scrollY;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  
  if (header) {
    if (currentScrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Hide/show header on scroll
    if (currentScrollY > lastScrollY && currentScrollY > 200) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }
  }
  
  lastScrollY = currentScrollY;
});

// Add CSS for header effects
const headerStyles = `
  .header {
    transition: all 0.3s ease;
  }
  
  .header.scrolled {
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.95);
  }
  
  .mobile-nav-item.animate-in {
    animation: slideInLeft 0.3s ease-out forwards;
  }
  
  .mobile-dropdown-item.animate-in {
    animation: slideInUp 0.2s ease-out forwards;
  }
  
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  body.menu-open {
    overflow: hidden;
  }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = headerStyles;
document.head.appendChild(styleSheet);
