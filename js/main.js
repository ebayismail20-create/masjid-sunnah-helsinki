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

    document.querySelectorAll('.mobile-menu .nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // Sticky Navbar Logic
  const navbar = document.querySelector('.navbar');
  const isHomePage = document.querySelector('.hero') !== null;

  if (navbar) {
    if (isHomePage) {
      window.addEventListener('scroll', () => {
        const hasBanner = document.getElementById('announcement-banner-container') &&
          document.getElementById('announcement-banner-container').style.display === 'block';
        if (window.scrollY > 50 || hasBanner) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      });
    } else {
      // Ensure it stays scrolled on inner pages
      navbar.classList.add('scrolled');
    }
  }

  const btt = document.getElementById('back-to-top');
  if (btt) {
    window.addEventListener('scroll', () => {
      const show = window.scrollY > 300;
      btt.style.opacity = show ? '1' : '0';
      btt.style.pointerEvents = show ? 'auto' : 'none';
      btt.style.transform = show ? 'translateY(0)' : 'translateY(10px)';
    });
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  document.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.nextElementSibling;
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.accordion-btn').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        b.nextElementSibling.classList.remove('open');
      });
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        panel.classList.add('open');
      }
    });
  });

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
