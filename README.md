# IIT Hyderabad Knowledge Resource Centre Website

A modern, responsive website for the Knowledge Resource Centre (KRC) at Indian Institute of Technology Hyderabad.

## Features

### 🎨 Design
- **Modern Academic Theme**: Professional design inspired by the KRC logo color palette
- **Responsive Layout**: Optimized for all devices from mobile to desktop
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **Performance**: Optimized images, lazy loading, and efficient CSS/JS

### 🌈 Color Scheme (Based on KRC Logo)
- **Primary Navy**: #2d3561 - Main branding color
- **Primary Teal**: #1ba1a1 - Secondary branding color  
- **Accent Orange**: #ff6b35 - Call-to-action elements
- **Accent Yellow**: #ffa500 - Highlights and accents

### 📱 Components

#### Header & Navigation
- Sticky header with smooth scrolling
- Responsive mobile menu with hamburger toggle
- Multi-level dropdown menus
- Email contact display

#### Hero Carousel
- Modern carousel with 4 slides showcasing library services
- Auto-play with pause on hover
- Touch/swipe support for mobile
- Keyboard navigation support
- Smooth transitions and animations

#### Search Section
- Toggle between different search types:
  - Library Catalog (Koha)
  - eBooks/Articles (Summons)
  - Repository (RAIITH)
  - Advanced Search
- Responsive form layouts
- Academic-themed styling

#### Quick Links
- 8 service quick links with hover animations
- Icon-based navigation
- Responsive grid layout
- Individual color themes for each service

#### Statistics Section
- Animated number counters
- 5 key library statistics
- Intersection Observer for performance
- Interactive hover effects with tooltips

#### New Arrivals
- Horizontal scrolling book carousel
- Book card displays with covers, titles, authors
- Modal popup for book details
- Touch/swipe navigation
- Responsive book card sizes

### 🛠️ Technical Features

#### CSS
- **CSS Custom Properties**: Consistent design system
- **Flexbox & Grid**: Modern layout techniques
- **Smooth Animations**: 60fps animations with hardware acceleration
- **Progressive Enhancement**: Graceful degradation for older browsers
- **Print Styles**: Optimized for printing

#### JavaScript
- **ES6+ Features**: Modern JavaScript with class-based components
- **Intersection Observer**: Performance-optimized scroll animations
- **Touch Events**: Mobile-first interaction support
- **Accessibility**: Screen reader support and keyboard navigation
- **Performance**: Lazy loading and optimized animations

#### Responsive Breakpoints
- **Desktop**: 1200px+ (Large screens)
- **Tablet**: 768px - 1199px (Medium screens)
- **Mobile**: 480px - 767px (Small screens)
- **Small Mobile**: <480px (Extra small screens)

### 📂 File Structure

```
assets/
├── css/
│   ├── style.css           # Main stylesheet with design system
│   ├── header.css          # Header and navigation styles
│   ├── modern-carousel.css # Hero carousel styles
│   ├── search_box.css      # Search component styles
│   ├── quick-links.css     # Quick links section styles
│   ├── stats.css           # Statistics section styles
│   └── new-arrivals.css    # New arrivals carousel styles
├── js/
│   ├── modern-carousel.js  # Carousel functionality
│   ├── mobile-menu.js      # Navigation and mobile menu
│   ├── stats.js           # Statistics animations
│   └── new-arrivals.js    # New arrivals carousel
└── img/
    └── (placeholder images)
```

### 🚀 Getting Started

1. Clone or download the project files
2. Open `index.html` in a web browser
3. The website is ready to use!

### 🔧 Customization

#### Colors
Edit the CSS custom properties in `assets/css/style.css`:
```css
:root {
  --primary-navy: #2d3561;
  --primary-teal: #1ba1a1;
  --accent-orange: #ff6b35;
  --accent-yellow: #ffa500;
}
```

#### Content
- Update library information in `index.html`
- Replace placeholder images with actual library photos
- Modify book data in `assets/js/new-arrivals.js`
- Update contact information and links

#### Logo
Replace the placeholder logo URL in the header section with your actual logo file.

### 📱 Browser Support

- **Modern Browsers**: Full support (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)
- **Older Browsers**: Graceful degradation with core functionality
- **Mobile**: Optimized for iOS Safari and Android Chrome

### ♿ Accessibility Features

- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Color Contrast**: WCAG AA compliant color ratios
- **Focus Management**: Clear focus indicators and logical tab order
- **Reduced Motion**: Respects `prefers-reduced-motion` setting

### 🎯 Performance Optimizations

- **Lazy Loading**: Images load as they enter viewport
- **CSS Optimization**: Minimal reflows and repaints
- **JavaScript**: Event delegation and debounced resize handlers
- **Font Loading**: Optimized web font loading
- **Image Formats**: Modern image formats with fallbacks

---

Built with ❤️ for IIT Hyderabad Knowledge Resource Centre
