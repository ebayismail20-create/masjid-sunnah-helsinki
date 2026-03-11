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
    const langs = {
      'fi': { flag: '🇫🇮', label: 'FI' },
      'en': { flag: '🇬🇧', label: 'EN' },
      'ar': { flag: '🇸🇦', label: 'AR' }
    };
    
    // Update all toggles
    document.querySelectorAll('.lang-dropdown-toggle').forEach(toggle => {
      toggle.innerHTML = `<span class="lang-flag">${langs[lang].flag}</span> ${langs[lang].label} <i class="fas fa-chevron-down" style="margin-left: 4px;"></i>`;
    });

    // Update active state in dropdown menus
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const isActive = btn.dataset.lang === lang;
      btn.classList.toggle('active', isActive);
      const check = btn.querySelector('.fa-check');
      if (check) check.style.opacity = isActive ? '1' : '0';
    });
  }

  function createSwitcher() {
    const langs = [
      { code: 'fi', flag: '🇫🇮', label: 'Suomi' },
      { code: 'en', flag: '🇬🇧', label: 'English' },
      { code: 'ar', flag: '🇸🇦', label: 'العربية' }
    ];

    const wrapper = document.createElement('div');
    wrapper.className = 'lang-dropdown-wrapper';
    wrapper.id = 'lang-switcher';

    const toggle = document.createElement('button');
    toggle.className = 'lang-dropdown-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    
    const menu = document.createElement('div');
    menu.className = 'lang-dropdown-menu';

    langs.forEach(l => {
      const btn = document.createElement('button');
      btn.className = 'lang-btn';
      btn.dataset.lang = l.code;
      btn.innerHTML = `<span class="lang-flag">${l.flag}</span> <span style="flex:1;">${l.label}</span> <i class="fas fa-check" style="opacity: 0;"></i>`;
      btn.addEventListener('click', () => {
        setLanguage(l.code);
        wrapper.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
      menu.appendChild(btn);
    });

    wrapper.appendChild(toggle);
    wrapper.appendChild(menu);

    // Toggle dropdown
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = wrapper.classList.contains('open');
      
      // Close all other dropdowns
      document.querySelectorAll('.lang-dropdown-wrapper').forEach(w => {
        w.classList.remove('open');
        w.querySelector('.lang-dropdown-toggle').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        wrapper.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) {
        wrapper.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Insert into desktop nav (before hamburger)
    const navContainers = document.querySelectorAll('.nav-container');
    navContainers.forEach(nc => {
      const hamburger = nc.querySelector('.hamburger');
      const clonedWrapper = wrapper.cloneNode(true);
      
      // Reattach events for cloned node
      const clonedToggle = clonedWrapper.querySelector('.lang-dropdown-toggle');
      clonedToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = clonedWrapper.classList.contains('open');
        document.querySelectorAll('.lang-dropdown-wrapper').forEach(w => {
          w.classList.remove('open');
          w.querySelector('.lang-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          clonedWrapper.classList.add('open');
          clonedToggle.setAttribute('aria-expanded', 'true');
        }
      });
      
      clonedWrapper.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          setLanguage(btn.dataset.lang);
          clonedWrapper.classList.remove('open');
          clonedToggle.setAttribute('aria-expanded', 'false');
        });
      });

      if (hamburger) {
        nc.insertBefore(clonedWrapper, hamburger);
      } else {
        nc.appendChild(clonedWrapper);
      }
    });

    // Also add to mobile menu
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
      const mobileWrapper = wrapper.cloneNode(true);
      mobileWrapper.style.margin = '20px auto 0';
      mobileWrapper.style.width = 'fit-content';
      
      const mobileToggle = mobileWrapper.querySelector('.lang-dropdown-toggle');
      mobileToggle.style.background = 'rgba(0,0,0,0.05)';
      mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileWrapper.classList.toggle('open');
        mobileToggle.setAttribute('aria-expanded', mobileWrapper.classList.contains('open'));
      });

      mobileWrapper.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          setLanguage(btn.dataset.lang);
          mobileWrapper.classList.remove('open');
          mobileToggle.setAttribute('aria-expanded', 'false');
        });
      });

      const mobileNav = mobileMenu.querySelector('.nav-links');
      if (mobileNav) {
        mobileNav.parentNode.insertBefore(mobileWrapper, mobileNav.nextSibling);
      }
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
