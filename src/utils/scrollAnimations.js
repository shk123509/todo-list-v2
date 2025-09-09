// Enhanced Scroll Animations and UI Interaction Utilities

class ScrollAnimationManager {
  constructor() {
    this.observers = new Map();
    this.animationClasses = [
      'animate-fade-in-up',
      'animate-fade-in-left', 
      'animate-fade-in-right',
      'animate-zoom-in',
      'animate-slide-in-up',
      'animate-bounce-in',
      'animate-rotate-in'
    ];
    
    this.init();
  }

  init() {
    // Create intersection observers for different animation types
    this.createObserver('fadeIn', {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    this.createObserver('slideIn', {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px'
    });

    this.createObserver('zoomIn', {
      threshold: 0.15,
      rootMargin: '0px'
    });

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.startObserving());
    } else {
      this.startObserving();
    }
  }

  createObserver(name, options) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target, name);
          observer.unobserve(entry.target);
        }
      });
    }, options);

    this.observers.set(name, observer);
  }

  animateElement(element, type) {
    // Remove any existing animation classes
    this.animationClasses.forEach(cls => element.classList.remove(cls));
    
    // Add animation based on type and element
    const animationClass = this.getAnimationClass(element, type);
    element.classList.add(animationClass);
    
    // Add completion event listener
    element.addEventListener('animationend', () => {
      element.classList.add('animation-complete');
    }, { once: true });
  }

  getAnimationClass(element, type) {
    const elementType = element.tagName.toLowerCase();
    const hasClass = (cls) => element.classList.contains(cls);

    // Smart animation selection based on element type and existing classes
    if (hasClass('card') || hasClass('news-card') || hasClass('product-card')) {
      return 'animate-fade-in-up';
    }
    
    if (hasClass('btn') || elementType === 'button') {
      return 'animate-bounce-in';
    }
    
    if (hasClass('title') || hasClass('heading') || elementType.startsWith('h')) {
      return 'animate-slide-in-up';
    }
    
    if (hasClass('sidebar') || hasClass('nav')) {
      return 'animate-fade-in-left';
    }
    
    if (hasClass('image') || elementType === 'img') {
      return 'animate-zoom-in';
    }
    
    if (hasClass('icon') || hasClass('emoji')) {
      return 'animate-rotate-in';
    }

    // Default animations by type
    switch (type) {
      case 'fadeIn':
        return 'animate-fade-in-up';
      case 'slideIn':
        return 'animate-slide-in-up';
      case 'zoomIn':
        return 'animate-zoom-in';
      default:
        return 'animate-fade-in-up';
    }
  }

  startObserving() {
    // Observe elements with scroll-animate class
    document.querySelectorAll('.scroll-animate').forEach(element => {
      const observer = this.observers.get('fadeIn');
      if (observer) observer.observe(element);
    });

    // Observe cards and interactive elements
    document.querySelectorAll('.card, .news-card, .product-card, .contact-card').forEach(element => {
      const observer = this.observers.get('slideIn');
      if (observer) observer.observe(element);
    });

    // Observe images and media
    document.querySelectorAll('img, .image-container, .media').forEach(element => {
      const observer = this.observers.get('zoomIn');
      if (observer) observer.observe(element);
    });

    // Observe buttons and interactive elements
    document.querySelectorAll('button, .btn, .interactive').forEach(element => {
      const observer = this.observers.get('fadeIn');
      if (observer) observer.observe(element);
    });
  }

  // Add new elements to observe (for dynamically added content)
  observeNewElements(container = document) {
    container.querySelectorAll('.scroll-animate:not(.animation-complete)').forEach(element => {
      const observer = this.observers.get('fadeIn');
      if (observer) observer.observe(element);
    });
  }

  // Stop all observations
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// Smooth Scrolling Utility
class SmoothScrollManager {
  constructor() {
    this.init();
  }

  init() {
    // Enable smooth scrolling for anchor links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (link) {
        e.preventDefault();
        const targetId = link.getAttribute('href').slice(1);
        this.scrollToElement(targetId);
      }
    });
  }

  scrollToElement(elementId, options = {}) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const defaultOptions = {
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
      offset: 80 // Account for fixed headers
    };

    const mergedOptions = { ...defaultOptions, ...options };
    const elementRect = element.getBoundingClientRect();
    const absoluteElementTop = elementRect.top + window.pageYOffset;
    const middle = absoluteElementTop - (window.innerHeight / 2);

    window.scrollTo({
      top: middle - mergedOptions.offset,
      behavior: mergedOptions.behavior
    });
  }

  scrollToTop(smooth = true) {
    window.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'auto'
    });
  }
}

// Enhanced Hover Effects Manager
class HoverEffectsManager {
  constructor() {
    this.init();
  }

  init() {
    // Add enhanced hover effects to interactive elements
    this.addParallaxHover();
    this.addMagneticEffect();
    this.addRippleEffect();
    this.addGlowEffect();
  }

  addParallaxHover() {
    document.querySelectorAll('.parallax-hover').forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;
        
        element.style.transform = `perspective(1000px) rotateX(${(yPercent - 50) * 0.1}deg) rotateY(${(xPercent - 50) * 0.1}deg) translateZ(10px)`;
      });

      element.addEventListener('mouseleave', () => {
        element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
      });
    });
  }

  addMagneticEffect() {
    document.querySelectorAll('.magnetic').forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);
        
        const distance = Math.sqrt(x * x + y * y);
        const maxDistance = Math.max(rect.width, rect.height);
        
        if (distance < maxDistance) {
          const strength = (maxDistance - distance) / maxDistance;
          element.style.transform = `translate(${x * strength * 0.2}px, ${y * strength * 0.2}px)`;
        }
      });

      element.addEventListener('mouseleave', () => {
        element.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  addRippleEffect() {
    document.querySelectorAll('.ripple').forEach(element => {
      element.addEventListener('click', (e) => {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple-effect');
        
        element.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });
  }

  addGlowEffect() {
    document.querySelectorAll('.glow-on-hover').forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        element.style.setProperty('--mouse-x', x + 'px');
        element.style.setProperty('--mouse-y', y + 'px');
      });
    });
  }
}

// Loading Animation Manager
class LoadingManager {
  constructor() {
    this.loadingElements = new Set();
  }

  showLoading(element, type = 'spinner') {
    if (this.loadingElements.has(element)) return;
    
    this.loadingElements.add(element);
    element.classList.add('loading', `loading-${type}`);
    
    const loadingOverlay = this.createLoadingOverlay(type);
    element.appendChild(loadingOverlay);
  }

  hideLoading(element) {
    if (!this.loadingElements.has(element)) return;
    
    this.loadingElements.delete(element);
    element.classList.remove('loading');
    
    const overlay = element.querySelector('.loading-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 300);
    }
  }

  createLoadingOverlay(type) {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    
    let content = '';
    switch (type) {
      case 'spinner':
        content = '<div class="loading-spinner"></div>';
        break;
      case 'dots':
        content = '<div class="loading-dots"><span></span><span></span><span></span></div>';
        break;
      case 'pulse':
        content = '<div class="loading-pulse"></div>';
        break;
      case 'shimmer':
        content = '<div class="loading-shimmer"></div>';
        break;
      default:
        content = '<div class="loading-spinner"></div>';
    }
    
    overlay.innerHTML = content;
    return overlay;
  }
}

// Page Transition Manager
class PageTransitionManager {
  constructor() {
    this.init();
  }

  // Ensure the page is visible and not stuck hidden
  ensurePageVisible() {
    const body = document.body;
    if (!body) return;
    body.classList.add('page-enter-active');
    body.classList.remove('page-enter', 'page-exit', 'page-exit-active');
    // Defensive: clear any inline opacity/transform that might keep it hidden
    if (body.style.opacity) body.style.opacity = '';
    if (body.style.transform) body.style.transform = '';
  }

  init() {
    // Add page transition classes
    document.body.classList.add('page-enter');

    // If the document is already loaded, activate immediately
    const ready = document.readyState;
    if (ready === 'complete' || ready === 'interactive') {
      setTimeout(() => this.ensurePageVisible(), 100);
    } else {
      // Use DOMContentLoaded for earlier activation; load as a fallback
      window.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => this.ensurePageVisible(), 100);
      });
      window.addEventListener('load', () => {
        setTimeout(() => this.ensurePageVisible(), 100);
      });
    }

    // Hard safety: if something goes wrong, force visibility after 2s
    setTimeout(() => this.ensurePageVisible(), 2000);

    // Handle route changes for SPA (back/forward)
    window.addEventListener('popstate', () => {
      this.transitionPage();
    });
  }

  transitionPage() {
    document.body.classList.add('page-exit');

    setTimeout(() => {
      document.body.classList.remove('page-exit');
      document.body.classList.add('page-enter');

      setTimeout(() => {
        this.ensurePageVisible();
      }, 100);
    }, 300);
  }
}

// Initialize all managers
const initializeUIEnhancements = () => {
  // Check if running in browser environment
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  // Initialize managers
  const scrollAnimationManager = new ScrollAnimationManager();
  const smoothScrollManager = new SmoothScrollManager();
  const hoverEffectsManager = new HoverEffectsManager();
  const loadingManager = new LoadingManager();
  const pageTransitionManager = new PageTransitionManager();

  // Expose managers globally for use in components
  window.UIManagers = {
    scrollAnimation: scrollAnimationManager,
    smoothScroll: smoothScrollManager,
    hoverEffects: hoverEffectsManager,
    loading: loadingManager,
    pageTransition: pageTransitionManager
  };

  // Add utility functions
  window.addScrollAnimation = (element) => scrollAnimationManager.observeNewElements(element);
  window.showLoading = (element, type) => loadingManager.showLoading(element, type);
  window.hideLoading = (element) => loadingManager.hideLoading(element);
  window.scrollToTop = () => smoothScrollManager.scrollToTop();

  // Add custom CSS for new effects
  const style = document.createElement('style');
  style.textContent = `
    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      transition: opacity 0.3s ease;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #f3f3f3;
      border-top: 3px solid #4e54c8;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .loading-dots {
      display: flex;
      gap: 4px;
    }

    .loading-dots span {
      width: 8px;
      height: 8px;
      background: #4e54c8;
      border-radius: 50%;
      animation: loading-dots 1.4s infinite ease-in-out;
    }

    .loading-dots span:nth-child(1) { animation-delay: -0.32s; }
    .loading-dots span:nth-child(2) { animation-delay: -0.16s; }

    @keyframes loading-dots {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }

    .loading-pulse {
      width: 40px;
      height: 40px;
      background: #4e54c8;
      border-radius: 50%;
      animation: loading-pulse 1.5s ease-in-out infinite;
    }

    @keyframes loading-pulse {
      0% { transform: scale(0); opacity: 1; }
      100% { transform: scale(1); opacity: 0; }
    }

    .ripple-effect {
      position: absolute;
      border-radius: 50%;
      background: rgba(78, 84, 200, 0.3);
      pointer-events: none;
      transform: scale(0);
      animation: ripple-animation 0.6s linear;
    }

    @keyframes ripple-animation {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }

    .glow-on-hover {
      position: relative;
      overflow: hidden;
    }

    .glow-on-hover::before {
      content: '';
      position: absolute;
      top: var(--mouse-y, 50%);
      left: var(--mouse-x, 50%);
      width: 100px;
      height: 100px;
      background: radial-gradient(circle, rgba(78, 84, 200, 0.2) 0%, transparent 70%);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    }

    .glow-on-hover:hover::before {
      opacity: 1;
    }

    .parallax-hover {
      transition: transform 0.1s ease;
    }

    .magnetic {
      transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
  `;
  document.head.appendChild(style);
};

// Auto-initialize when imported
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeUIEnhancements);
  } else {
    initializeUIEnhancements();
  }
}

export {
  ScrollAnimationManager,
  SmoothScrollManager,
  HoverEffectsManager,
  LoadingManager,
  PageTransitionManager,
  initializeUIEnhancements
};
