/* i18n.js - Language switching engine */
(function () {
  const STORAGE_KEY = 'masjid_lang';
  const DEFAULT_LANG = 'en';
  const SUPPORTED = ['en', 'fi', 'ar'];

  function getCurrentLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return SUPPORTED.includes(saved) ? saved : DEFAULT_LANG;
  }

  function setLanguage(lang) {
    if (!SUPPORTED.includes(lang)) return;
    localStorage.setItem(STORAGE_KEY, lang);
    applyTranslations(lang);
    applyDirection(lang);
    updateSwitcherUI(lang);
  }

  function applyTranslations(lang) {
    if (typeof translations === 'undefined') return;
    const t = translations[lang];
    if (!t) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) {
        el.textContent = t[key];
      }
    });

    // Handle placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (t[key] !== undefined) {
        el.setAttribute('placeholder', t[key]);
      }
    });

    // Update page title if data-i18n-title is set on <html>
    const titleKey = document.documentElement.getAttribute('data-i18n-title');
    if (titleKey && t[titleKey]) {
      document.title = t[titleKey] + ' | Masjid Sunnah Helsinki';
    }

    // Set html lang attribute
    document.documentElement.setAttribute('lang', lang);
  }

  function applyDirection(lang) {
    if (lang === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.body.classList.add('rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.body.classList.remove('rtl');
    }
  }

  function updateSwitcherUI(lang) {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
  }

  function createSwitcher() {
    const langs = [
      { code: 'fi', flag: '🇫🇮', label: 'FI' },
      { code: 'en', flag: '🇬🇧', label: 'EN' },
      { code: 'ar', flag: '🇸🇦', label: 'AR' }
    ];

    const switcher = document.createElement('div');
    switcher.className = 'lang-switcher';
    switcher.id = 'lang-switcher';

    const currentLang = getCurrentLang();

    langs.forEach(l => {
      const btn = document.createElement('button');
      btn.className = 'lang-btn' + (l.code === currentLang ? ' active' : '');
      btn.dataset.lang = l.code;
      btn.innerHTML = `<span class="lang-flag">${l.flag}</span> ${l.label}`;
      btn.setAttribute('aria-label', `Switch to ${l.label}`);
      btn.addEventListener('click', () => setLanguage(l.code));
      switcher.appendChild(btn);
    });

    // Insert into desktop nav (before hamburger)
    const navContainers = document.querySelectorAll('.nav-container');
    navContainers.forEach(nc => {
      const hamburger = nc.querySelector('.hamburger');
      if (hamburger) {
        nc.insertBefore(switcher.cloneNode(true), hamburger);
        // Add event listeners to cloned buttons
        nc.querySelector('.lang-switcher').querySelectorAll('.lang-btn').forEach(btn => {
          btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
        });
      } else {
        nc.appendChild(switcher.cloneNode(true));
        nc.querySelector('.lang-switcher').querySelectorAll('.lang-btn').forEach(btn => {
          btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
        });
      }
    });

    // Also add to mobile menu
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
      const mobileSwitcher = switcher.cloneNode(true);
      mobileSwitcher.style.marginTop = '15px';
      mobileSwitcher.style.justifyContent = 'center';
      const mobileNav = mobileMenu.querySelector('.nav-links');
      if (mobileNav) {
        mobileNav.parentNode.insertBefore(mobileSwitcher, mobileNav.nextSibling);
      }
      mobileSwitcher.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
      });
    }
  }

  // Initialize on DOMContentLoaded
  function init() {
    createSwitcher();
    const lang = getCurrentLang();
    applyTranslations(lang);
    applyDirection(lang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose globally for prayer-times.js and other scripts
  window.i18n = {
    getCurrentLang,
    setLanguage,
    t: function (key) {
      const lang = getCurrentLang();
      if (typeof translations !== 'undefined' && translations[lang] && translations[lang][key]) {
        return translations[lang][key];
      }
      return key;
    }
  };
})();
