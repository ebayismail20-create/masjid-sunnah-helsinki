/* main.js - Core JS (nav, scroll, animations) */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Logic
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const closeMenu = document.querySelector('.mobile-menu-close');
  const overlay = document.querySelector('.mobile-menu-overlay');

  if (hamburger && mobileMenu && closeMenu && overlay) {
    function toggleMenu() {
      mobileMenu.classList.toggle('active');
      overlay.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    hamburger.addEventListener('click', toggleMenu);
    closeMenu.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);
  }

  // Sticky Navbar Logic
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Initialize AOS (Animate on Scroll) if available
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out',
      once: true,
      offset: 100
    });
  }
  
  /* Fallback scroll observer if AOS isn't loading or for custom slide-ups */
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stop observing once animated
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.slide-up').forEach(el => {
    observer.observe(el);
  });
});
