/**
 * New Arrivals JavaScript for IIT Hyderabad KRC Website
 * Handles carousel functionality for book displays
 */

class NewArrivalsCarousel {
  constructor() {
    this.track = document.getElementById('na-track');
    this.prevBtn = document.getElementById('na-prev');
    this.nextBtn = document.getElementById('na-next');
    this.container = document.querySelector('.na-track-wrapper');
    
    // Configuration
    this.itemWidth = 280; // Base width of each book card
    this.gap = 32; // Gap between cards
    this.scrollAmount = this.itemWidth + this.gap;
    this.currentPosition = 0;
    this.maxPosition = 0;
    
    // Sample data (in a real application, this would come from an API)
    this.books = [
      {
        id: 1,
        title: "Advanced Engineering Mathematics",
        author: "K.A. Stroud",
        year: "2023",
        status: "new",
        cover: "./assets/img/book1.jpg",
        available: true
      },
      {
        id: 2,
        title: "Introduction to Algorithms",
        author: "Thomas H. Cormen",
        year: "2023",
        status: "available",
        cover: "./assets/img/book2.jpg",
        available: true
      },
      {
        id: 3,
        title: "Machine Learning Yearning",
        author: "Andrew Ng",
        year: "2023",
        status: "new",
        cover: "./assets/img/book3.jpg",
        available: true
      },
      {
        id: 4,
        title: "Digital Signal Processing",
        author: "John G. Proakis",
        year: "2023",
        status: "available",
        cover: "./assets/img/book4.jpg",
        available: false
      },
      {
        id: 5,
        title: "Computer Networks",
        author: "Andrew S. Tanenbaum",
        year: "2023",
        status: "new",
        cover: "./assets/img/book5.jpg",
        available: true
      },
      {
        id: 6,
        title: "Database Management Systems",
        author: "Raghu Ramakrishnan",
        year: "2023",
        status: "available",
        cover: "./assets/img/book6.jpg",
        available: true
      }
    ];
    
    this.init();
  }
  
  init() {
    if (!this.track) return;
    
    this.renderBooks();
    this.setupEventListeners();
    this.updateButtons();
    this.setupResponsiveDesign();
    this.setupAccessibility();
    this.setupIntersectionObserver();
  }
  
  renderBooks() {
    this.track.innerHTML = '';
    
    this.books.forEach(book => {
      const bookElement = this.createBookElement(book);
      this.track.appendChild(bookElement);
    });
    
    this.calculateMaxPosition();
  }
  
  createBookElement(book) {
    const bookDiv = document.createElement('div');
    bookDiv.className = 'na-book';
    bookDiv.setAttribute('data-book-id', book.id);
    bookDiv.setAttribute('tabindex', '0');
    bookDiv.setAttribute('role', 'article');
    bookDiv.setAttribute('aria-label', `Book: ${book.title} by ${book.author}`);
    
    bookDiv.innerHTML = `
      <div class="na-cover ${!book.cover ? 'no-image' : ''}">
        ${book.cover ? `<img src="${book.cover}" alt="Cover of ${book.title}" loading="lazy" onerror="this.parentElement.classList.add('no-image'); this.style.display='none';">` : ''}
      </div>
      <div class="na-details">
        <h4 class="na-title">${book.title}</h4>
        <p class="na-author">by ${book.author}</p>
        <div class="na-meta">
          <span class="na-year">${book.year}</span>
          <span class="na-status ${book.status}">${book.status.toUpperCase()}</span>
        </div>
        <button class="na-action" aria-label="View details for ${book.title}">
          <i class="fas fa-eye"></i>
          View Details
        </button>
      </div>
    `;
    
    // Add click event for book interaction
    bookDiv.addEventListener('click', () => this.handleBookClick(book));
    bookDiv.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.handleBookClick(book);
      }
    });
    
    return bookDiv;
  }
  
  handleBookClick(book) {
    // In a real application, this would open a modal or navigate to a detail page
    console.log('Book clicked:', book);
    
    // For demonstration, show an alert
    const message = `Title: ${book.title}\nAuthor: ${book.author}\nYear: ${book.year}\nStatus: ${book.status}`;
    
    // Create a custom modal or notification instead of alert
    this.showBookModal(book);
    
    // Announce to screen readers
    this.announceToScreenReader(`Viewing details for ${book.title} by ${book.author}`);
  }
  
  showBookModal(book) {
    // Create a simple modal overlay
    const modal = document.createElement('div');
    modal.className = 'book-modal-overlay';
    modal.innerHTML = `
      <div class="book-modal">
        <div class="book-modal-header">
          <h3>${book.title}</h3>
          <button class="book-modal-close" aria-label="Close modal">&times;</button>
        </div>
        <div class="book-modal-body">
          <p><strong>Author:</strong> ${book.author}</p>
          <p><strong>Year:</strong> ${book.year}</p>
          <p><strong>Status:</strong> ${book.status.toUpperCase()}</p>
          <p><strong>Available:</strong> ${book.available ? 'Yes' : 'No'}</p>
        </div>
        <div class="book-modal-footer">
          <button class="btn btn-primary">Reserve Book</button>
          <button class="btn btn-outline">Add to Wishlist</button>
        </div>
      </div>
    `;
    
    // Add modal styles
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    
    const modalContent = modal.querySelector('.book-modal');
    modalContent.style.cssText = `
      background: white;
      border-radius: 12px;
      padding: 24px;
      max-width: 400px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      transform: scale(0.8);
      transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(modal);
    
    // Animate in
    setTimeout(() => {
      modal.style.opacity = '1';
      modalContent.style.transform = 'scale(1)';
    }, 10);
    
    // Close modal functionality
    const closeModal = () => {
      modal.style.opacity = '0';
      modalContent.style.transform = 'scale(0.8)';
      setTimeout(() => {
        if (modal.parentNode) {
          document.body.removeChild(modal);
        }
      }, 300);
    };
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    
    modal.querySelector('.book-modal-close').addEventListener('click', closeModal);
    
    // Escape key to close
    const escapeHandler = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', escapeHandler);
      }
    };
    document.addEventListener('keydown', escapeHandler);
    
    // Focus management
    const firstButton = modal.querySelector('button');
    if (firstButton) {
      firstButton.focus();
    }
  }
  
  calculateMaxPosition() {
    if (!this.track) return;
    
    const containerWidth = this.container.offsetWidth;
    const totalWidth = this.books.length * this.scrollAmount;
    this.maxPosition = Math.max(0, totalWidth - containerWidth);
  }
  
  setupEventListeners() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.scrollPrevious());
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.scrollNext());
    }
    
    // Touch/swipe support
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    this.track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });
    
    this.track.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
    }, { passive: true });
    
    this.track.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      
      const diff = startX - currentX;
      const threshold = 50;
      
      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          this.scrollNext();
        } else {
          this.scrollPrevious();
        }
      }
    });
    
    // Keyboard navigation
    this.track.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          this.scrollPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.scrollNext();
          break;
        case 'Home':
          e.preventDefault();
          this.scrollToStart();
          break;
        case 'End':
          e.preventDefault();
          this.scrollToEnd();
          break;
      }
    });
    
    // Window resize
    window.addEventListener('resize', () => {
      this.calculateMaxPosition();
      this.updatePosition();
    });
  }
  
  scrollNext() {
    this.currentPosition = Math.min(this.currentPosition + this.scrollAmount, this.maxPosition);
    this.updatePosition();
  }
  
  scrollPrevious() {
    this.currentPosition = Math.max(this.currentPosition - this.scrollAmount, 0);
    this.updatePosition();
  }
  
  scrollToStart() {
    this.currentPosition = 0;
    this.updatePosition();
  }
  
  scrollToEnd() {
    this.currentPosition = this.maxPosition;
    this.updatePosition();
  }
  
  updatePosition() {
    if (!this.track) return;
    
    this.track.style.transform = `translateX(-${this.currentPosition}px)`;
    this.updateButtons();
    
    // Announce position to screen readers
    const totalBooks = this.books.length;
    const visibleBooks = Math.floor(this.container.offsetWidth / this.scrollAmount);
    const currentBook = Math.floor(this.currentPosition / this.scrollAmount) + 1;
    
    this.announceToScreenReader(`Showing books ${currentBook} to ${Math.min(currentBook + visibleBooks - 1, totalBooks)} of ${totalBooks}`);
  }
  
  updateButtons() {
    if (this.prevBtn) {
      this.prevBtn.disabled = this.currentPosition <= 0;
    }
    
    if (this.nextBtn) {
      this.nextBtn.disabled = this.currentPosition >= this.maxPosition;
    }
  }
  
  setupResponsiveDesign() {
    const updateItemWidth = () => {
      const containerWidth = this.container.offsetWidth;
      
      if (containerWidth < 480) {
        this.itemWidth = 180;
        this.gap = 16;
      } else if (containerWidth < 768) {
        this.itemWidth = 220;
        this.gap = 20;
      } else if (containerWidth < 1024) {
        this.itemWidth = 250;
        this.gap = 24;
      } else {
        this.itemWidth = 280;
        this.gap = 32;
      }
      
      this.scrollAmount = this.itemWidth + this.gap;
      this.calculateMaxPosition();
      
      // Reset position if it's beyond the new max
      if (this.currentPosition > this.maxPosition) {
        this.currentPosition = this.maxPosition;
        this.updatePosition();
      }
    };
    
    updateItemWidth();
    
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateItemWidth, 250);
    });
  }
  
  setupAccessibility() {
    // Add ARIA labels and roles
    if (this.track) {
      this.track.setAttribute('role', 'region');
      this.track.setAttribute('aria-label', 'New arrivals book carousel');
    }
    
    if (this.prevBtn) {
      this.prevBtn.setAttribute('aria-label', 'View previous books');
    }
    
    if (this.nextBtn) {
      this.nextBtn.setAttribute('aria-label', 'View next books');
    }
    
    // Add focus management for book cards
    const books = this.track.querySelectorAll('.na-book');
    books.forEach((book, index) => {
      book.addEventListener('focus', () => {
        // Ensure focused book is visible
        const bookLeft = index * this.scrollAmount;
        const bookRight = bookLeft + this.itemWidth;
        const viewportLeft = this.currentPosition;
        const viewportRight = this.currentPosition + this.container.offsetWidth;
        
        if (bookLeft < viewportLeft) {
          this.currentPosition = bookLeft;
          this.updatePosition();
        } else if (bookRight > viewportRight) {
          this.currentPosition = bookRight - this.container.offsetWidth;
          this.updatePosition();
        }
      });
    });
  }
  
  setupIntersectionObserver() {
    // Lazy load book covers as they come into view
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
    }, {
      rootMargin: '50px'
    });
    
    // Observe book covers
    const bookImages = this.track.querySelectorAll('.na-cover img[data-src]');
    bookImages.forEach(img => {
      imageObserver.observe(img);
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
  
  // Public methods for external control
  addBook(book) {
    this.books.push(book);
    this.renderBooks();
  }
  
  removeBook(bookId) {
    this.books = this.books.filter(book => book.id !== bookId);
    this.renderBooks();
  }
  
  updateBook(bookId, updates) {
    const bookIndex = this.books.findIndex(book => book.id === bookId);
    if (bookIndex !== -1) {
      this.books[bookIndex] = { ...this.books[bookIndex], ...updates };
      this.renderBooks();
    }
  }
  
  refresh() {
    this.renderBooks();
    this.currentPosition = 0;
    this.updatePosition();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.newArrivalsCarousel = new NewArrivalsCarousel();
});

// Auto-refresh every 5 minutes to check for new arrivals
setInterval(() => {
  if (window.newArrivalsCarousel) {
    // In a real application, this would fetch new data from the server
    console.log('Checking for new arrivals...');
  }
}, 5 * 60 * 1000);

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NewArrivalsCarousel;
}
