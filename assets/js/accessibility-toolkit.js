/**
 * KRC Library Accessibility Toolkit
 * Comprehensive accessibility features for inclusive web experience
 * Features: Font size adjustment, contrast modes, screen reader support, keyboard navigation, etc.
 */

class AccessibilityToolkit {
    constructor() {
        this.currentFontSize = 1;
        this.isInitialized = false;
        this.init();
        this.bindEvents();
        this.loadSavedPreferences();
        this.setupMutationObserver();
        this.setupResizeHandler();
        this.isInitialized = true;
        this.announceChange('Accessibility toolkit loaded and ready');
    }

    init() {
        this.createAccessibilityPanel();
        this.setupKeyboardNavigation();
        this.setupScreenReaderSupport();
        this.setupFocusManagement();
    }

    createAccessibilityPanel() {
        const panel = document.createElement('div');
        panel.id = 'accessibility-panel';
        panel.className = 'accessibility-panel';
        panel.setAttribute('aria-label', 'Accessibility Options');
        panel.setAttribute('role', 'region');

        panel.innerHTML = `
            <button id="accessibility-toggle" class="accessibility-toggle" 
                    aria-label="Open Accessibility Options" 
                    aria-expanded="false">
                <i class="fas fa-universal-access" aria-hidden="true"></i>
                <span class="sr-only">Accessibility</span>
            </button>
            
            <div id="accessibility-menu" class="accessibility-menu" aria-hidden="true">
                <div class="accessibility-header">
                    <h3>Accessibility Options</h3>
                    <button id="accessibility-close" class="accessibility-close" 
                            aria-label="Close Accessibility Panel">
                        <i class="fas fa-times" aria-hidden="true"></i>
                    </button>
                </div>
                
                <div class="accessibility-content">
                    <!-- Font Size Controls -->
                    <div class="accessibility-section">
                        <h4>Text Size</h4>
                        <div class="button-group" role="group" aria-label="Text size controls">
                            <button class="accessibility-btn" data-action="font-decrease" 
                                    aria-label="Decrease text size">A-</button>
                            <button class="accessibility-btn" data-action="font-reset" 
                                    aria-label="Reset text size">A</button>
                            <button class="accessibility-btn" data-action="font-increase" 
                                    aria-label="Increase text size">A+</button>
                        </div>
                    </div>

                    <!-- Contrast & Color Options -->
                    <div class="accessibility-section">
                        <h4>Visual Display</h4>
                        <div class="accessibility-options">
                            <button class="accessibility-option" data-action="high-contrast" 
                                    aria-pressed="false">
                                <i class="fas fa-adjust" aria-hidden="true"></i>
                                High Contrast
                            </button>
                            <button class="accessibility-option" data-action="dark-mode" 
                                    aria-pressed="false">
                                <i class="fas fa-moon" aria-hidden="true"></i>
                                Dark Mode
                            </button>
                            <button class="accessibility-option" data-action="grayscale" 
                                    aria-pressed="false">
                                <i class="fas fa-palette" aria-hidden="true"></i>
                                Grayscale
                            </button>
                            <button class="accessibility-option" data-action="invert-colors" 
                                    aria-pressed="false">
                                <i class="fas fa-exchange-alt" aria-hidden="true"></i>
                                Invert Colors
                            </button>
                        </div>
                    </div>

                    <!-- Reading & Navigation -->
                    <div class="accessibility-section">
                        <h4>Reading & Navigation</h4>
                        <div class="accessibility-options">
                            <button class="accessibility-option" data-action="dyslexia-font" 
                                    aria-pressed="false">
                                <i class="fas fa-font" aria-hidden="true"></i>
                                Dyslexia Friendly Font
                            </button>
                            <button class="accessibility-option" data-action="reading-guide" 
                                    aria-pressed="false">
                                <i class="fas fa-bars" aria-hidden="true"></i>
                                Reading Guide
                            </button>
                            <button class="accessibility-option" data-action="highlight-links" 
                                    aria-pressed="false">
                                <i class="fas fa-link" aria-hidden="true"></i>
                                Highlight Links
                            </button>
                            <button class="accessibility-option" data-action="text-spacing" 
                                    aria-pressed="false">
                                <i class="fas fa-text-height" aria-hidden="true"></i>
                                Increase Text Spacing
                            </button>
                        </div>
                    </div>

                    <!-- Motor & Interaction -->
                    <div class="accessibility-section">
                        <h4>Motor & Interaction</h4>
                        <div class="accessibility-options">
                            <button class="accessibility-option" data-action="big-cursor" 
                                    aria-pressed="false">
                                <i class="fas fa-mouse-pointer" aria-hidden="true"></i>
                                Big Cursor
                            </button>
                            <button class="accessibility-option" data-action="pause-animations" 
                                    aria-pressed="false">
                                <i class="fas fa-pause" aria-hidden="true"></i>
                                Pause Animations
                            </button>
                            <button class="accessibility-option" data-action="keyboard-navigation" 
                                    aria-pressed="false">
                                <i class="fas fa-keyboard" aria-hidden="true"></i>
                                Enhanced Keyboard Nav
                            </button>
                        </div>
                    </div>

                    <!-- Screen Reader Support -->
                    <div class="accessibility-section">
                        <h4>Screen Reader</h4>
                        <div class="accessibility-options">
                            <button class="accessibility-option" data-action="skip-links" 
                                    aria-pressed="false">
                                <i class="fas fa-forward" aria-hidden="true"></i>
                                Show Skip Links
                            </button>
                            <button class="accessibility-option" data-action="alt-text-toggle" 
                                    aria-pressed="false">
                                <i class="fas fa-image" aria-hidden="true"></i>
                                Show Alt Text
                            </button>
                        </div>
                    </div>

                    <!-- Reset All -->
                    <div class="accessibility-section">
                        <button class="accessibility-reset" data-action="reset-all">
                            <i class="fas fa-undo" aria-hidden="true"></i>
                            Reset All Settings
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        this.createSkipLinks();
        this.createReadingGuide();
    }

    createSkipLinks() {
        const skipLinks = document.createElement('div');
        skipLinks.id = 'skip-links';
        skipLinks.className = 'skip-links';
        skipLinks.innerHTML = `
            <a href="#main-content" class="skip-link">Skip to main content</a>
            <a href="#navigation" class="skip-link">Skip to navigation</a>
            <a href="#" class="skip-link" id="skip-to-search">Skip to search</a>
            <a href="#footer" class="skip-link">Skip to footer</a>
        `;
        
        // Set up smart search link
        this.setupSmartSearchLink();
        document.body.insertBefore(skipLinks, document.body.firstChild);
    }

    createReadingGuide() {
        const guide = document.createElement('div');
        guide.id = 'reading-guide';
        guide.className = 'reading-guide';
        guide.setAttribute('aria-hidden', 'true');
        document.body.appendChild(guide);
    }

    bindEvents() {
        const toggle = document.getElementById('accessibility-toggle');
        const close = document.getElementById('accessibility-close');
        const menu = document.getElementById('accessibility-menu');

        // Panel toggle
        toggle.addEventListener('click', () => this.togglePanel());
        close.addEventListener('click', () => this.closePanel());

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.getAttribute('aria-hidden') === 'false') {
                this.closePanel();
                toggle.focus();
            }
        });

        // Accessibility feature buttons
        document.addEventListener('click', (e) => {
            if (e.target.hasAttribute('data-action')) {
                this.handleAction(e.target.getAttribute('data-action'), e.target);
            }
        });

        // Reading guide mouse tracking
        document.addEventListener('mousemove', (e) => {
            if (document.body.classList.contains('reading-guide-active')) {
                this.updateReadingGuide(e.clientY);
            }
        });

        // Enhanced keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (document.body.classList.contains('enhanced-keyboard-nav')) {
                this.enhancedKeyboardNavigation(e);
            }
        });
    }

    togglePanel() {
        const toggle = document.getElementById('accessibility-toggle');
        const menu = document.getElementById('accessibility-menu');
        const isOpen = menu.getAttribute('aria-hidden') === 'false';

        if (isOpen) {
            this.closePanel();
        } else {
            this.openPanel();
        }
    }

    openPanel() {
        const toggle = document.getElementById('accessibility-toggle');
        const menu = document.getElementById('accessibility-menu');
        
        menu.setAttribute('aria-hidden', 'false');
        toggle.setAttribute('aria-expanded', 'true');
        menu.classList.add('open');
        
        // Focus first interactive element
        const firstButton = menu.querySelector('button, [tabindex="0"]');
        if (firstButton) firstButton.focus();
    }

    closePanel() {
        const toggle = document.getElementById('accessibility-toggle');
        const menu = document.getElementById('accessibility-menu');
        
        menu.setAttribute('aria-hidden', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        menu.classList.remove('open');
    }

    handleAction(action, button) {
        switch (action) {
            case 'font-increase':
                this.adjustFontSize(1.1);
                break;
            case 'font-decrease':
                this.adjustFontSize(0.9);
                break;
            case 'font-reset':
                this.resetFontSize();
                break;
            case 'high-contrast':
                this.toggleHighContrast(button);
                break;
            case 'dark-mode':
                this.toggleDarkMode(button);
                break;
            case 'grayscale':
                this.toggleGrayscale(button);
                break;
            case 'invert-colors':
                this.toggleInvertColors(button);
                break;
            case 'dyslexia-font':
                this.toggleDyslexiaFont(button);
                break;
            case 'reading-guide':
                this.toggleReadingGuide(button);
                break;
            case 'highlight-links':
                this.toggleHighlightLinks(button);
                break;
            case 'text-spacing':
                this.toggleTextSpacing(button);
                break;
            case 'big-cursor':
                this.toggleBigCursor(button);
                break;
            case 'pause-animations':
                this.togglePauseAnimations(button);
                break;
            case 'keyboard-navigation':
                this.toggleKeyboardNavigation(button);
                break;
            case 'skip-links':
                this.toggleSkipLinks(button);
                break;
            case 'alt-text-toggle':
                this.toggleAltTextDisplay(button);
                break;
            case 'reset-all':
                this.resetAllSettings();
                break;
        }
        this.savePreferences();
    }

    adjustFontSize(multiplier) {
        const currentSize = parseFloat(localStorage.getItem('accessibility-font-size') || '1');
        const newSize = Math.max(0.8, Math.min(2, currentSize * multiplier));
        
        document.documentElement.style.setProperty('--accessibility-font-scale', newSize);
        localStorage.setItem('accessibility-font-size', newSize);
        
        this.announceChange(`Font size ${multiplier > 1 ? 'increased' : 'decreased'} to ${Math.round(newSize * 100)}%`);
    }

    resetFontSize() {
        document.documentElement.style.removeProperty('--accessibility-font-scale');
        localStorage.removeItem('accessibility-font-size');
        this.announceChange('Font size reset to default');
    }

    toggleHighContrast(button) {
        document.body.classList.toggle('accessibility-high-contrast');
        const isActive = document.body.classList.contains('accessibility-high-contrast');
        button.setAttribute('aria-pressed', isActive);
        this.announceChange(`High contrast ${isActive ? 'enabled' : 'disabled'}`);
    }

    toggleDarkMode(button) {
        document.body.classList.toggle('accessibility-dark-mode');
        const isActive = document.body.classList.contains('accessibility-dark-mode');
        button.setAttribute('aria-pressed', isActive);
        this.announceChange(`Dark mode ${isActive ? 'enabled' : 'disabled'}`);
    }

    toggleGrayscale(button) {
        document.body.classList.toggle('accessibility-grayscale');
        const isActive = document.body.classList.contains('accessibility-grayscale');
        button.setAttribute('aria-pressed', isActive);
        this.announceChange(`Grayscale ${isActive ? 'enabled' : 'disabled'}`);
    }

    toggleInvertColors(button) {
        document.body.classList.toggle('accessibility-invert-colors');
        const isActive = document.body.classList.contains('accessibility-invert-colors');
        button.setAttribute('aria-pressed', isActive);
        this.announceChange(`Color inversion ${isActive ? 'enabled' : 'disabled'}`);
    }

    toggleDyslexiaFont(button) {
        document.body.classList.toggle('accessibility-dyslexia-font');
        const isActive = document.body.classList.contains('accessibility-dyslexia-font');
        button.setAttribute('aria-pressed', isActive);
        this.announceChange(`Dyslexia-friendly font ${isActive ? 'enabled' : 'disabled'}`);
    }

    toggleReadingGuide(button) {
        document.body.classList.toggle('reading-guide-active');
        const isActive = document.body.classList.contains('reading-guide-active');
        button.setAttribute('aria-pressed', isActive);
        this.announceChange(`Reading guide ${isActive ? 'enabled' : 'disabled'}`);
    }

    toggleHighlightLinks(button) {
        document.body.classList.toggle('accessibility-highlight-links');
        const isActive = document.body.classList.contains('accessibility-highlight-links');
        button.setAttribute('aria-pressed', isActive);
        this.announceChange(`Link highlighting ${isActive ? 'enabled' : 'disabled'}`);
    }

    toggleTextSpacing(button) {
        document.body.classList.toggle('accessibility-text-spacing');
        const isActive = document.body.classList.contains('accessibility-text-spacing');
        button.setAttribute('aria-pressed', isActive);
        this.announceChange(`Text spacing ${isActive ? 'increased' : 'reset'}`);
    }

    toggleBigCursor(button) {
        document.body.classList.toggle('accessibility-big-cursor');
        const isActive = document.body.classList.contains('accessibility-big-cursor');
        button.setAttribute('aria-pressed', isActive);
        this.announceChange(`Big cursor ${isActive ? 'enabled' : 'disabled'}`);
    }

    togglePauseAnimations(button) {
        document.body.classList.toggle('accessibility-reduced-motion');
        const isActive = document.body.classList.contains('accessibility-reduced-motion');
        button.setAttribute('aria-pressed', isActive);
        this.announceChange(`Animations ${isActive ? 'paused' : 'resumed'}`);
    }

    toggleKeyboardNavigation(button) {
        document.body.classList.toggle('enhanced-keyboard-nav');
        const isActive = document.body.classList.contains('enhanced-keyboard-nav');
        button.setAttribute('aria-pressed', isActive);
        this.announceChange(`Enhanced keyboard navigation ${isActive ? 'enabled' : 'disabled'}`);
    }

    toggleSkipLinks(button) {
        const skipLinks = document.getElementById('skip-links');
        skipLinks.classList.toggle('visible');
        const isVisible = skipLinks.classList.contains('visible');
        button.setAttribute('aria-pressed', isVisible);
        this.announceChange(`Skip links ${isVisible ? 'shown' : 'hidden'}`);
    }

    toggleAltTextDisplay(button) {
        document.body.classList.toggle('show-alt-text');
        const isActive = document.body.classList.contains('show-alt-text');
        button.setAttribute('aria-pressed', isActive);
        this.announceChange(`Alt text display ${isActive ? 'enabled' : 'disabled'}`);
    }

    updateReadingGuide(mouseY) {
        const guide = document.getElementById('reading-guide');
        guide.style.top = `${mouseY - 2}px`;
    }

    enhancedKeyboardNavigation(e) {
        // Add visual focus indicators and improve tab navigation
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-focus-visible');
        }
    }

    setupKeyboardNavigation() {
        // Trap focus in modal when open
        document.addEventListener('keydown', (e) => {
            const menu = document.getElementById('accessibility-menu');
            if (e.key === 'Tab' && menu.getAttribute('aria-hidden') === 'false') {
                this.trapFocus(e, menu);
            }
        });
    }

    trapFocus(e, container) {
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }

    setupScreenReaderSupport() {
        // Create live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.id = 'accessibility-announcements';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);
    }

    setupFocusManagement() {
        // Add focus indicators for better visual feedback
        document.addEventListener('focusin', (e) => {
            if (document.body.classList.contains('enhanced-keyboard-nav')) {
                e.target.classList.add('accessibility-focus');
            }
        });

        document.addEventListener('focusout', (e) => {
            e.target.classList.remove('accessibility-focus');
        });
    }

    announceChange(message) {
        const announcements = document.getElementById('accessibility-announcements');
        if (announcements) {
            announcements.textContent = message;
            // Clear after announcement
            setTimeout(() => {
                announcements.textContent = '';
            }, 1000);
        }
    }

    resetAllSettings() {
        // Remove all accessibility classes
        const classes = [
            'accessibility-high-contrast', 'accessibility-dark-mode', 'accessibility-grayscale',
            'accessibility-invert-colors', 'accessibility-dyslexia-font', 'reading-guide-active',
            'accessibility-highlight-links', 'accessibility-text-spacing', 'accessibility-big-cursor',
            'accessibility-reduced-motion', 'enhanced-keyboard-nav', 'show-alt-text'
        ];
        
        classes.forEach(className => {
            document.body.classList.remove(className);
        });

        // Reset font size
        document.documentElement.style.removeProperty('--accessibility-font-scale');
        
        // Reset all button states
        document.querySelectorAll('[aria-pressed]').forEach(button => {
            button.setAttribute('aria-pressed', 'false');
        });

        // Clear localStorage
        localStorage.removeItem('accessibility-preferences');
        localStorage.removeItem('accessibility-font-size');

        this.announceChange('All accessibility settings reset');
    }

    savePreferences() {
        const preferences = {
            highContrast: document.body.classList.contains('accessibility-high-contrast'),
            darkMode: document.body.classList.contains('accessibility-dark-mode'),
            grayscale: document.body.classList.contains('accessibility-grayscale'),
            invertColors: document.body.classList.contains('accessibility-invert-colors'),
            dyslexiaFont: document.body.classList.contains('accessibility-dyslexia-font'),
            readingGuide: document.body.classList.contains('reading-guide-active'),
            highlightLinks: document.body.classList.contains('accessibility-highlight-links'),
            textSpacing: document.body.classList.contains('accessibility-text-spacing'),
            bigCursor: document.body.classList.contains('accessibility-big-cursor'),
            reducedMotion: document.body.classList.contains('accessibility-reduced-motion'),
            keyboardNav: document.body.classList.contains('enhanced-keyboard-nav'),
            showAltText: document.body.classList.contains('show-alt-text'),
            fontSize: localStorage.getItem('accessibility-font-size')
        };
        
        localStorage.setItem('accessibility-preferences', JSON.stringify(preferences));
    }

    loadSavedPreferences() {
        const saved = localStorage.getItem('accessibility-preferences');
        if (!saved) return;

        try {
            const preferences = JSON.parse(saved);
            
            // Apply saved preferences
            Object.entries(preferences).forEach(([key, value]) => {
                if (!value) return;
                
                switch (key) {
                    case 'highContrast':
                        document.body.classList.add('accessibility-high-contrast');
                        this.updateButtonState('high-contrast', true);
                        break;
                    case 'darkMode':
                        document.body.classList.add('accessibility-dark-mode');
                        this.updateButtonState('dark-mode', true);
                        break;
                    case 'grayscale':
                        document.body.classList.add('accessibility-grayscale');
                        this.updateButtonState('grayscale', true);
                        break;
                    case 'invertColors':
                        document.body.classList.add('accessibility-invert-colors');
                        this.updateButtonState('invert-colors', true);
                        break;
                    case 'dyslexiaFont':
                        document.body.classList.add('accessibility-dyslexia-font');
                        this.updateButtonState('dyslexia-font', true);
                        break;
                    case 'readingGuide':
                        document.body.classList.add('reading-guide-active');
                        this.updateButtonState('reading-guide', true);
                        break;
                    case 'highlightLinks':
                        document.body.classList.add('accessibility-highlight-links');
                        this.updateButtonState('highlight-links', true);
                        break;
                    case 'textSpacing':
                        document.body.classList.add('accessibility-text-spacing');
                        this.updateButtonState('text-spacing', true);
                        break;
                    case 'bigCursor':
                        document.body.classList.add('accessibility-big-cursor');
                        this.updateButtonState('big-cursor', true);
                        break;
                    case 'reducedMotion':
                        document.body.classList.add('accessibility-reduced-motion');
                        this.updateButtonState('pause-animations', true);
                        break;
                    case 'keyboardNav':
                        document.body.classList.add('enhanced-keyboard-nav');
                        this.updateButtonState('keyboard-navigation', true);
                        break;
                    case 'showAltText':
                        document.body.classList.add('show-alt-text');
                        this.updateButtonState('alt-text-toggle', true);
                        break;
                    case 'fontSize':
                        if (value && value !== '1') {
                            document.documentElement.style.setProperty('--accessibility-font-scale', value);
                        }
                        break;
                }
            });
        } catch (e) {
            console.warn('Error loading accessibility preferences:', e);
        }
    }

    updateButtonState(action, pressed) {
        const button = document.querySelector(`[data-action="${action}"]`);
        if (button) {
            button.setAttribute('aria-pressed', pressed);
        }
    }

    setupSmartSearchLink() {
        const searchLink = document.getElementById('skip-to-search');
        if (!searchLink) return;

        // Function to update the search link target
        const updateSearchTarget = () => {
            const isLargeScreen = window.innerWidth >= 1024;
            const targetId = isLargeScreen ? 'search-overlay' : 'search';
            searchLink.href = `#${targetId}`;
        };

        // Set initial target
        updateSearchTarget();

        // Update on resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(updateSearchTarget, 100);
        });

        // Handle click event
        searchLink.addEventListener('click', (e) => {
            e.preventDefault();
            const isLargeScreen = window.innerWidth >= 1024;
            const targetId = isLargeScreen ? 'search-overlay' : 'search';
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Smooth scroll to the target
                targetElement.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
                
                // Focus the first form element in the search section
                setTimeout(() => {
                    const firstInput = targetElement.querySelector('input, select, button');
                    if (firstInput) {
                        firstInput.focus();
                    }
                }, 300);
                
                this.announceChange('Jumped to search section');
            }
        });
    }

    // Enhanced methods for perfect functionality
    setupMutationObserver() {
        // Watch for dynamic content changes and maintain accessibility
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    this.enhanceNewContent(mutation.addedNodes);
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    enhanceNewContent(nodes) {
        nodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                // Add accessibility attributes to new content
                this.addAccessibilityAttributes(node);
                
                // Apply current accessibility settings to new content
                if (document.body.classList.contains('accessibility-dyslexia-font')) {
                    node.style.fontFamily = 'OpenDyslexic, Comic Sans MS, cursive';
                }
                
                if (document.body.classList.contains('accessibility-text-spacing')) {
                    node.style.letterSpacing = '0.12em';
                    node.style.wordSpacing = '0.16em';
                    node.style.lineHeight = '1.5';
                }
            }
        });
    }

    addAccessibilityAttributes(element) {
        // Add missing accessibility attributes
        const images = element.querySelectorAll('img:not([alt])');
        images.forEach(img => {
            img.setAttribute('alt', 'Image');
            img.setAttribute('role', 'img');
        });

        const buttons = element.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
        buttons.forEach(btn => {
            if (!btn.textContent.trim()) {
                btn.setAttribute('aria-label', 'Button');
            }
        });

        const links = element.querySelectorAll('a:not([aria-label]):not([aria-labelledby])');
        links.forEach(link => {
            if (!link.textContent.trim() && !link.querySelector('img[alt]')) {
                link.setAttribute('aria-label', 'Link');
            }
        });
    }

    setupResizeHandler() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.adjustPanelPosition();
            }, 250);
        });
    }

    adjustPanelPosition() {
        const panel = document.getElementById('accessibility-panel');
        const menu = document.getElementById('accessibility-menu');
        
        if (window.innerWidth < 768) {
            menu.style.width = 'calc(100vw - 20px)';
            menu.style.maxWidth = '300px';
        } else {
            menu.style.width = '320px';
            menu.style.maxWidth = 'none';
        }
    }

    // Language support
    setupLanguageSupport() {
        const currentLang = document.documentElement.lang || 'en';
        const translations = this.getTranslations(currentLang);
        this.applyTranslations(translations);
    }

    getTranslations(lang) {
        const translations = {
            'en': {
                'accessibilityOptions': 'Accessibility Options',
                'textSize': 'Text Size',
                'visualDisplay': 'Visual Display',
                'highContrast': 'High Contrast',
                'darkMode': 'Dark Mode',
                'resetAll': 'Reset All Settings'
            },
            'hi': {
                'accessibilityOptions': 'पहुंच विकल्प',
                'textSize': 'पाठ आकार',
                'visualDisplay': 'दृश्य प्रदर्शन',
                'highContrast': 'उच्च कंट्रास्ट',
                'darkMode': 'डार्क मोड',
                'resetAll': 'सभी सेटिंग्स रीसेट करें'
            }
        };
        
        return translations[lang] || translations['en'];
    }

    applyTranslations(translations) {
        // Apply translations to the interface
        Object.entries(translations).forEach(([key, value]) => {
            const element = document.querySelector(`[data-translate="${key}"]`);
            if (element) {
                element.textContent = value;
            }
        });
    }

    // Advanced keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Alt + A: Toggle accessibility panel
            if (e.altKey && e.key === 'a') {
                e.preventDefault();
                this.togglePanel();
            }

            // Alt + 1: Increase font size
            if (e.altKey && e.key === '1') {
                e.preventDefault();
                this.adjustFontSize(1.1);
            }

            // Alt + 2: Decrease font size
            if (e.altKey && e.key === '2') {
                e.preventDefault();
                this.adjustFontSize(0.9);
            }

            // Alt + 3: Toggle high contrast
            if (e.altKey && e.key === '3') {
                e.preventDefault();
                const button = document.querySelector('[data-action="high-contrast"]');
                this.toggleHighContrast(button);
            }

            // Alt + 4: Toggle dark mode
            if (e.altKey && e.key === '4') {
                e.preventDefault();
                const button = document.querySelector('[data-action="dark-mode"]');
                this.toggleDarkMode(button);
            }

            // Alt + 0: Reset all
            if (e.altKey && e.key === '0') {
                e.preventDefault();
                this.resetAllSettings();
            }
        });
    }

    // Performance optimization
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

    // Enhanced announcements with priority
    announceChange(message, priority = 'polite') {
        const announcements = document.getElementById('accessibility-announcements');
        if (announcements) {
            announcements.setAttribute('aria-live', priority);
            announcements.textContent = message;
            
            // Clear after announcement with longer timeout for important messages
            const timeout = priority === 'assertive' ? 3000 : 1000;
            setTimeout(() => {
                announcements.textContent = '';
            }, timeout);
        }
    }

    // Accessibility audit function
    runAccessibilityAudit() {
        const issues = [];
        
        // Check for images without alt text
        const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
        if (imagesWithoutAlt.length > 0) {
            issues.push(`${imagesWithoutAlt.length} images missing alt text`);
        }

        // Check for buttons without labels
        const buttonsWithoutLabels = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
        const unlabeledButtons = Array.from(buttonsWithoutLabels).filter(btn => !btn.textContent.trim());
        if (unlabeledButtons.length > 0) {
            issues.push(`${unlabeledButtons.length} buttons missing labels`);
        }

        // Check for links without context
        const emptyLinks = document.querySelectorAll('a:not([aria-label]):not([aria-labelledby])');
        const contextlessLinks = Array.from(emptyLinks).filter(link => 
            !link.textContent.trim() && !link.querySelector('img[alt]')
        );
        if (contextlessLinks.length > 0) {
            issues.push(`${contextlessLinks.length} links missing context`);
        }

        // Check color contrast (simplified)
        const lowContrastElements = this.checkColorContrast();
        if (lowContrastElements.length > 0) {
            issues.push(`${lowContrastElements.length} elements with low contrast`);
        }

        return issues;
    }

    checkColorContrast() {
        // Simplified contrast check - in real implementation would use proper contrast calculation
        const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, a, button');
        const lowContrastElements = [];
        
        elements.forEach(element => {
            const style = window.getComputedStyle(element);
            const color = style.color;
            const backgroundColor = style.backgroundColor;
            
            // This is a simplified check - real implementation would calculate actual contrast ratio
            if (color === 'rgb(128, 128, 128)' || backgroundColor === 'rgb(200, 200, 200)') {
                lowContrastElements.push(element);
            }
        });
        
        return lowContrastElements;
    }

    // Export settings
    exportSettings() {
        const settings = {
            preferences: localStorage.getItem('accessibility-preferences'),
            fontSize: localStorage.getItem('accessibility-font-size'),
            timestamp: new Date().toISOString(),
            version: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'accessibility-settings.json';
        a.click();
        URL.revokeObjectURL(url);
        
        this.announceChange('Accessibility settings exported');
    }

    // Import settings
    importSettings(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const settings = JSON.parse(e.target.result);
                if (settings.preferences) {
                    localStorage.setItem('accessibility-preferences', settings.preferences);
                }
                if (settings.fontSize) {
                    localStorage.setItem('accessibility-font-size', settings.fontSize);
                }
                this.loadSavedPreferences();
                this.announceChange('Accessibility settings imported successfully');
            } catch (error) {
                this.announceChange('Error importing settings', 'assertive');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AccessibilityToolkit();
});

// Export for use in other scripts
window.AccessibilityToolkit = AccessibilityToolkit;
