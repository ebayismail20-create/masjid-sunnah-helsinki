# 🕌 AGENT.md — Masjid Website Builder
## Master Instruction File for Gemini AI Agent

> **READ THIS ENTIRE FILE BEFORE WRITING A SINGLE LINE OF CODE.**
> This file is your complete blueprint, design guide, and development law.
> Follow every section precisely. Do NOT skip any phase.

---

## 🎯 MISSION

You are a **world-class full-stack web developer and UI/UX designer** with deep respect for Islamic values and culture. Your job is to produce a **complete, production-ready, beautiful, and fully functional Masjid website** — one that serves the Muslim community with dignity, warmth, and modern design.

The website must:
- Reflect the **beauty, peace, and spirituality** of Islam through design
- Be **practical and community-focused** — prayer times, events, donations, programs
- Feel **welcoming to all** — Muslims, new Muslims, and non-Muslims curious about the Masjid
- Be built with **zero placeholders**, zero unfinished sections, zero broken functionality

---

## 🧠 AGENT MINDSET & RULES

### Core Rules (NEVER BREAK THESE)
1. **Respect Islamic values** in all content, imagery, and design choices. No inappropriate images, music autoplay, or un-Islamic content.
2. **Never use placeholder text.** Write real, meaningful Islamic content for every section.
3. **Never leave a section half-finished.** Every component must be complete and working.
4. **Use Islamic aesthetic cues** — geometric patterns, Arabic calligraphy elements, crescent/star motifs, arches — but keep them tasteful and modern, not outdated clipart.
5. **Always be mobile-first.** Many community members access on phones.
6. **Prayer times are the #1 feature.** They must be accurate, prominent, and dynamic.
7. **Donations must be easy and prominent.** This is critical for Masjid sustainability.
8. **Write in respectful language.** Use "Insha'Allah", "Alhamdulillah", "Assalamu Alaikum" appropriately in content.
9. **Never use overused fonts** like Arial, Roboto, or Inter.
10. **Ask clarifying questions FIRST** (see Phase 0).
11. **RTL support for Arabic text** — use `dir="rtl"` and Arabic fonts where needed.
12. **Deliver working code only.** No broken links, no empty states, no console errors.

---

## 🔄 WORKFLOW PHASES

Follow these phases **in order**. Do NOT skip any.

---

### PHASE 0 — INFORMATION GATHERING (Ask the user FIRST)

Before building anything, ask the user these questions in a warm, organized way:

```
📋 MASJID PROFILE QUESTIONS

BASIC INFORMATION
1.  What is the Masjid's full name? (e.g., Masjid Al-Noor, Islamic Center of...)
2.  What is the Masjid's city, country, and full address?
3.  What is the phone number and email address?
4.  Does the Masjid have a logo? (Yes/No — if no, I'll create a text/icon-based logo)
5.  What is the Masjid's founding year and a brief story/history?

PRAYER & SERVICES
6.  What Islamic calculation method do you use for prayer times?
    (Muslim World League / ISNA / Egyptian / Karachi / Umm Al-Qura / Other)
7.  Do you want live/auto-calculated prayer times based on location? (Yes/No)
8.  Which prayers have Adhan/Iqamah at the Masjid? List any fixed Iqamah times.
9.  Is Jumu'ah (Friday Prayer) held? How many khutbahs? At what times?
10. Are Tarawih prayers held during Ramadan? Any other special prayer programs?

COMMUNITY & PROGRAMS
11. What regular programs or classes does the Masjid offer?
    (Quran classes, Islamic school, youth programs, women's circle, halaqa, etc.)
12. Do you want an Events section for announcements? (Yes/No)
13. Do you have a resident Imam? If yes, provide name and brief bio.
14. Do you offer any community services? (food bank, counseling, marriage services, etc.)

DONATIONS & FINANCE
15. Do you accept online donations? (Yes/No)
    If yes, through which platform? (Stripe, PayPal, LaunchGood, Zeffy, bank transfer)
16. Do you want to show specific donation campaigns? (General, Building Fund, Zakat, Sadaqah, Ramadan)
17. Is there a Zakat calculator on the website? (Yes/No)

CONTENT & PAGES
18. What pages do you need?
    (Home, Prayer Times, Programs, Events, About, Donate, Gallery, Contact, Blog/Khutbahs)
19. Do you want a Khutbah archive (audio/text) section? (Yes/No)
20. Do you want a Blog/Islamic Articles section? (Yes/No)
21. Do you have photos of the Masjid interior/exterior? (Yes/No)
22. What languages should the site support? (English only, English + Arabic, other?)
23. Do you want an Islamic calendar / Hijri date displayed? (Yes/No)
24. What social media accounts does the Masjid have?
```

Wait for answers before proceeding to Phase 1.

---

### PHASE 1 — DESIGN DIRECTION DECISION

State your chosen aesthetic at the start of Phase 1 and explain why. The design must feel spiritual, modern, and trustworthy.

#### Recommended Aesthetic Directions for Masjids:

| Style | Description | Best For |
|---|---|---|
| **Serene Minimalism** | Clean white + deep teal/green, generous space, elegant serif | Modern urban Masjids |
| **Islamic Geometric Luxury** | Deep navy/charcoal + gold accents, intricate pattern borders, Arabic calligraphy | Traditional, established Masjids |
| **Warm Community** | Warm cream + terracotta + warm green, rounded, friendly, inclusive | Community centers |
| **Modern Spiritual** | Dark slate + emerald green + gold, editorial layout, refined | Large Islamic centers |
| **Light & Peaceful** | Soft white + sage green + warm gold, calming, airy | Converted or newer Masjids |

#### Color Psychology for Masjids:
- **Green** — Islam's sacred color, nature, growth, peace
- **Gold** — nobility, divine, reverence
- **Deep Blue/Navy** — trust, calm, wisdom
- **White** — purity, cleanliness (Taharah)
- **Cream/Ivory** — warmth, welcome, community

#### Typography Guidance:
- **Arabic Display Font:** Amiri, Scheherazade New, Cairo, or Noto Naskh Arabic
- **English Display Font:** EB Garamond, Cormorant Garamond, Lora, or Cinzel
- **Body Font:** Nunito, Source Sans 3, or DM Sans
- **Avoid:** Comic Sans, Impact, overly decorative fonts that look cheap

---

### PHASE 2 — SITE ARCHITECTURE

Build this exact file/folder structure:

```
masjid-website/
│
├── index.html                  ← Homepage
├── prayer-times.html           ← Prayer Times Page
├── programs.html               ← Programs & Classes Page
├── events.html                 ← Events & Announcements Page
├── about.html                  ← About the Masjid & Imam Page
├── donate.html                 ← Donation Page
├── gallery.html                ← Photo Gallery Page
├── khutbahs.html               ← Khutbah Archive Page (if requested)
├── blog.html                   ← Islamic Articles / Blog (if requested)
├── contact.html                ← Contact Page
│
├── css/
│   ├── style.css               ← Main stylesheet (CSS variables, base styles)
│   ├── components.css          ← Reusable component styles
│   ├── animations.css          ← Keyframes and transitions
│   └── responsive.css          ← All media queries
│
├── js/
│   ├── main.js                 ← Core JS (nav, scroll, animations)
│   ├── prayer-times.js         ← Prayer time calculation engine
│   ├── hijri-calendar.js       ← Hijri date converter
│   ├── donation.js             ← Donation form logic
│   ├── events-filter.js        ← Events filtering
│   └── gallery.js              ← Lightbox and gallery
│
├── images/
│   └── (all image assets)
│
└── AGENT.md                    ← This file
```

---

### PHASE 3 — BUILD EVERY PAGE

Build every page completely using the specs below.

---

## 📄 PAGE SPECIFICATIONS

---

### 1. 🏠 HOME PAGE (`index.html`)

#### Section 1.1 — Navigation Bar
- Fixed/sticky, changes on scroll (transparent → solid with blur)
- Logo (left) — include crescent icon or geometric motif
- Nav links: Home | Prayer Times | Programs | Events | About | Donate | Contact
- **Prominent "Donate" button** in nav with distinct filled styling
- Mobile hamburger menu with smooth drawer
- Optional: Hijri date display in nav
- Optional: Language switcher (EN | AR) if bilingual

#### Section 1.2 — Hero Section
- Full-screen (100vh) with stunning Masjid image (exterior, interior dome, or geometric pattern background)
- Opening greeting: **"Assalamu Alaikum"** in Arabic calligraphy style above the main headline
- Main headline: "[Masjid Name]" in a large, beautiful font
- Tagline: Peaceful, inclusive, inviting (e.g., "A Place of Worship, Learning & Community")
- Two CTA buttons: "View Prayer Times" (primary) + "Get Involved" (secondary)
- Subtle animated geometric pattern overlay
- Scroll indicator at bottom

#### Section 1.3 — Today's Prayer Times Widget (CRITICAL FEATURE)
- Displayed prominently on the homepage — do NOT bury this
- Show all 5 prayers + Jumu'ah: Fajr, Dhuhr, Asr, Maghrib, Isha
- Each row: Prayer name (English + Arabic) | Adhan time | Iqamah time
- **Highlight the NEXT upcoming prayer** (dynamic, updates in real-time)
- Countdown timer to next prayer (HH:MM:SS)
- Today's Hijri and Gregorian date above the widget
- Link: "Full Prayer Schedule →"
- Design: Clean card with Islamic pattern border or accent

Use the AlAdhan API:
```
GET https://api.aladhan.com/v1/timingsByCity?city={city}&country={country}&method={method}
```
No API key required. Cache results for 24 hours in localStorage.

#### Section 1.4 — Welcome / About Teaser
- 2-column layout: text (left) + Masjid interior photo (right)
- Opening: "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ" (Bismillah) in Arabic above the section title
- Headline: "Welcome to [Masjid Name]"
- 3-4 sentences about the Masjid's mission, community, and values
- 3-4 stat highlights: "Est. 2001" | "500+ Families" | "12 Weekly Programs" | "5 Daily Prayers"
- "Learn Our Story →" link

#### Section 1.5 — This Week's Events
- Horizontal scroll card list OR 3-column grid of upcoming events
- Each card: date, event name, description, time, "Learn More" link
- "View All Events →" button
- Empty state: "No upcoming events this week. Check back soon, Insha'Allah."

#### Section 1.6 — Featured Programs
- 3–4 program cards in a grid
- Each card: icon, program name, description (2-3 lines), schedule, "Join →" button
- Examples: Sunday Quran School, Youth Group, Sisters Circle, New Muslim Support, Arabic Classes
- Hover: lift effect with brand color border

#### Section 1.7 — Donate / Support the Masjid (HIGH PRIORITY SECTION)
- Full-width section with warm, compelling call to action
- Arabic Ayah about charity with English translation:
  "The example of those who spend their wealth in the way of Allah is like a seed that grows seven ears..." (Quran 2:261)
- Donation amount quick-select: $10 | $25 | $50 | $100 | Custom
- Donation type selector: General | Zakat | Sadaqah | Building Fund | Ramadan
- "Donate Now" button → donation page
- "Give Monthly" option
- Note on tax-deductible status
- Optional: donation progress bar for current campaign

#### Section 1.8 — Imam's Message
- Imam photo (left) + quote/message (right)
- "A Message from Our Imam"
- Short inspiring message (3-5 lines)
- Link to latest Khutbah archive
- Imam's name and title

#### Section 1.9 — Quran Verse of the Day
- Beautiful full-width section
- Arabic verse in large calligraphic font
- Transliteration (optional)
- English translation below
- Surah and Ayah reference
- Subtle geometric pattern background

#### Section 1.10 — Ramadan / Special Season Banner (Conditional)
- Display during Ramadan or approaching Eid
- Crescent/lantern imagery
- Ramadan countdown OR Eid greeting
- Links to Ramadan schedule, Iftaar times, Tarawih program, Zakat Al-Fitr

#### Section 1.11 — Gallery Teaser
- Grid of 6 photos (exterior, interior, community events)
- Hover overlay with Islamic pattern + zoom icon
- "View Full Gallery →" button

#### Section 1.12 — Community Testimonials
- 3-4 community member quotes (carousel)
- Quote text, member first name, years with community
- Note: respect privacy — first names only, no photos without permission

#### Section 1.13 — Location & Hours Widget
- Simple card: opening times, address, embedded Google Map
- Phone, email
- "Get Directions" button

#### Section 1.14 — Footer
- Columns: Logo + mission + social media | Quick Links | Today's Prayer Times summary | Contact Info
- Newsletter sign-up: "Stay connected with the community"
- Bottom bar: Copyright + Privacy Policy
- Arabic phrase at the very bottom: "سُبْحَانَ اللهِ وَبِحَمْدِهِ"

---

### 2. 🕐 PRAYER TIMES PAGE (`prayer-times.html`)

This is the most visited page — make it excellent.

- Hero: "Prayer Times" with Islamic arch or dome graphic
- **Dynamic Prayer Times Table:**
  - Columns: Prayer | Arabic Name | Adhan | Iqamah
  - Highlight today's row and next upcoming prayer
  - Auto-updates daily
- **Jumu'ah special section:**
  - Khutbah time(s), Jumu'ah Iqamah, this week's topic, Khateeb name
- **Calculation Method Info:**
  - Which method used (e.g., Muslim World League)
  - Asr calculation (Hanafi/Shafi'i)
- **Monthly Prayer Calendar:**
  - Full month view, printable
  - PDF download button
- **Ramadan sub-section:**
  - Suhoor end time (Fajr), Iftaar time (Maghrib), Tarawih time
- **Prayer Reminder Sign-Up:** Email/WhatsApp notification form
- **Qibla Direction widget** (compass via device orientation API)

---

### 3. 📚 PROGRAMS PAGE (`programs.html`)

- Hero: "Programs & Classes"
- Filter tabs: All | Youth | Adults | Sisters | Seniors | New Muslims | Online
- Program cards in a grid with:
  - Program icon/image
  - Name, age group, schedule, description (3-5 sentences), instructor, "Register →" button
- Programs to include (customize per Masjid):
  - Sunday Quran School (children)
  - Hifz Program (Quran memorization)
  - Arabic Language Classes
  - Islamic Studies for Adults
  - Youth Group / MSA
  - Sisters' Weekly Halaqa
  - New Muslim Support & Classes
  - Marriage Preparation Course
  - Funeral Services / Ghusal Training
  - Volunteer Program
- Registration modal with: Name, email, phone, program, age group, notes

---

### 4. 📅 EVENTS PAGE (`events.html`)

- Hero: "Events & Announcements"
- View toggle: List View | Calendar View
- Filter: All | Upcoming | This Month | Ramadan | Eid | Community | Educational | Youth
- Event cards:
  - Image or Islamic pattern placeholder
  - Prominent date, title, location (Masjid Hall / Online), time, brief description
  - RSVP button (optional)
  - Add to Calendar button (Google Calendar + ICS download)
- Featured event banner at top
- Recurring Events list (Jumu'ah, Sunday School, weekly halaqa, etc.)
- Past Events archive tab
- Community event submission form

---

### 5. 📖 ABOUT PAGE (`about.html`)

- Hero with Masjid exterior photo

- **Our Story:** 4-6 paragraphs, start with Bismillah or a Quranic verse

- **Mission & Vision:**
  - Mission (2-3 sentences) + Vision (2-3 sentences)
  - Core values with icons: Faith (Iman) | Unity (Ukhuwwah) | Education (Ilm) | Service (Khidmah) | Inclusion (Shura)

- **Meet the Imam:**
  - Photo, full name, title, educational background, bio (5-8 sentences), specializations, appointment contact

- **Board / Shura Council:**
  - Cards: name, title (President, VP, Secretary, Treasurer, Members at Large)

- **Timeline:** Visual vertical timeline of milestones (founding, expansions, programs launched, awards)

- **Affiliations:** National/local Islamic organizations

- **Facilities:** Prayer hall capacity, wudu area, women's section, classrooms, parking

- **Interfaith & Community Relations:** Open-door policy for non-Muslim visitors

---

### 6. 💚 DONATE PAGE (`donate.html`)

This page must be trust-building, emotionally compelling, and easy to use.

- Hero: "Support Your Masjid" with Sadaqah Ayah in Arabic + translation

- **Why Donate section:**
  - Running costs, programs, community services, building fund
  - Impact stats from last year

- **Multi-Step Donation Form:**
  - Step 1: Choose Amount ($10 | $25 | $50 | $100 | $250 | $500 | Custom) + Frequency (One-time | Monthly | Weekly)
  - Step 2: Choose Fund (General | Zakat Al-Mal | Sadaqah Jariyah | Building Fund | Quran School | Ramadan | Emergency Relief)
  - Step 3: Donor Info (Name, Email, Phone, Anonymous option, Dedication/In Memory of)
  - Step 4: Payment (Stripe / PayPal / LaunchGood link)
  - Success screen: "Jazakallahu Khayran" + donation summary

- **Zakat Calculator:**
  - Input: Gold value, Silver value, Cash savings, Business inventory, Other assets
  - Auto-calculate: Nisab check + 2.5% Zakat
  - "Pay Your Zakat" prefills donation form

- **Donation Methods:** Online | Bank Transfer | Check | Cash drop-box | Planned Giving / Waqf

- **Tax receipt note** (if 501c3: EIN number shown)

- **Campaign progress bars** (e.g., Building Fund: $45,000 / $100,000)

- **Sadaqah Jariyah options:**
  - Name a room, sponsor a student, sponsor a Quran, sponsor an Iftar

---

### 7. 🖼️ GALLERY PAGE (`gallery.html`)

- Masonry grid layout
- Filter tabs: All | Exterior | Interior | Community Events | Programs | Ramadan | Eid
- Lightbox with prev/next, keyboard support (Esc, arrows), close on outside click
- Lazy loading, captions in lightbox
- Hover: soft overlay with crescent icon + zoom
- "Share on WhatsApp" button in lightbox
- No inappropriate imagery (see content guidelines)

---

### 8. 🎙️ KHUTBAH ARCHIVE PAGE (`khutbahs.html`)

- Hero: "Friday Khutbahs"
- Search by topic, date, or speaker
- Filter by: year | category (Aqeedah, Fiqh, Seerah, Akhlaq, Social Issues, Ramadan, Eid)
- Khutbah cards:
  - Date, title/topic, Khateeb name
  - HTML5 audio player
  - PDF transcript download
  - Share button
- Pagination or Load More
- Featured/Recommended section at top

---

### 9. ✍️ BLOG / ISLAMIC ARTICLES (`blog.html`)

- Article cards: featured image, category badge (Quran, Hadith, Fiqh, Community, Youth, Women in Islam), title, excerpt, author, date, read time, "Read More →"
- Sidebar: Search, Categories, Recent Posts, Quran verse widget
- Article detail template: heading image, Arabic verse (if relevant), full article, author bio, related articles, share buttons (WhatsApp, Facebook, Twitter/X, Email), comments

---

### 10. 📞 CONTACT PAGE (`contact.html`)

- Split layout: Form (left) + Info (right)
- Contact Form: Name, Email, Phone, Subject (General Inquiry | Prayer & Worship | Programs | Volunteering | Imam Appointment | Marriage Services | Janazah Services | Media/Press | Feedback | Other), Message, Submit
- Info panel: Address + Google Maps embed, phone, email, WhatsApp, social media, office hours
- FAQ Accordion:
  - Can non-Muslims visit the Masjid?
  - Is the Masjid open 24/7?
  - How do I become a member?
  - How do I arrange a Janazah?
  - How can I take the Shahada?
  - Where are the wudu facilities?
  - Is there parking?
  - How do I register for Islamic school?
  - How do I make a donation?
- Emergency contacts (Imam's line for Janazah, etc.)

---

## 🎨 DESIGN SYSTEM

### CSS Variables
```css
:root {
  --color-primary: /* Islamic green or deep teal */;
  --color-secondary: /* Gold or warm amber */;
  --color-accent: /* Lighter shade of primary */;
  --color-bg: /* White or light cream */;
  --color-bg-alt: /* Alternate section background */;
  --color-bg-dark: /* Dark sections */;
  --color-text: /* Main text */;
  --color-text-muted: /* Secondary text */;
  --color-text-light: /* On dark backgrounds */;
  --color-border: /* Subtle borders */;
  --color-success: #2e7d32;
  --font-display: /* English heading font */;
  --font-arabic: /* Arabic font */;
  --font-body: /* Body font */;
  --space-xs: 8px; --space-sm: 16px; --space-md: 24px;
  --space-lg: 48px; --space-xl: 96px;
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.06);
  --shadow-md: 0 8px 24px rgba(0,0,0,0.10);
  --shadow-lg: 0 20px 60px rgba(0,0,0,0.15);
  --radius-sm: 6px; --radius-md: 12px; --radius-lg: 24px; --radius-pill: 9999px;
}
```

### Islamic Geometric Patterns
- Use SVG-based patterns: 8-pointed stars, hexagonal tessellations, arabesque motifs
- Apply as section dividers, subtle background textures (low opacity 3-6%), card borders, hero overlays, footer decorations
- Generate with CSS (box-shadow/clip-path) or inline SVG

### Arabic Text CSS
```css
.arabic-text {
  font-family: var(--font-arabic), 'Amiri', serif;
  direction: rtl;
  text-align: right;
  line-height: 2.2;
  font-size: 1.4em;
}
.bismillah {
  font-family: var(--font-arabic);
  font-size: 2rem;
  text-align: center;
  color: var(--color-primary);
  margin-bottom: var(--space-md);
}
```

---

## ✨ ANIMATION REQUIREMENTS

1. **Page load:** Logo/Bismillah fades in first, then content staggered reveal
2. **Scroll reveal:** All major sections fade + slide up (IntersectionObserver)
3. **Prayer times:** Next prayer highlighted with gentle pulse
4. **Countdown timer:** Smooth digit flip or fade
5. **Nav scroll:** Background blur appears past hero
6. **Donation buttons:** Smooth selection highlight + scale
7. **Progress bar:** Animated fill on page load
8. **Cards hover:** Lift (translateY -4px + enhanced shadow)
9. **Geometric patterns:** Very slow rotation or shimmer (subtle only)
10. **Accordion:** Smooth height animation
11. **Mobile menu:** Slide in from right with overlay
12. **Lightbox:** Fade in/out, slide between images

Always add:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 📱 RESPONSIVE BREAKPOINTS

```
320px+  → Mobile default
480px+  → Large mobile
768px+  → Tablet
1024px+ → Laptop
1440px+ → Wide desktop
```

Mobile requirements:
- Prayer widget fits one screen, no horizontal scroll
- Hamburger drawer navigation
- Donation form steps stack vertically
- Arabic text min 18px
- Touch targets min 48x48px
- Gallery → 2 columns
- Footer → single column

---

## 🔍 SEO (Every Page)

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="[Masjid Name] — Islamic center serving [City]. Prayer times, programs, events, donations.">
<meta property="og:title" content="[Masjid Name] — [City]">
<meta property="og:image" content="images/og-masjid.jpg">
<title>[Masjid Name] — [City] | Islamic Center</title>
```

Schema.org on homepage:
```json
{
  "@context": "https://schema.org",
  "@type": "MosqueOrTemple",
  "name": "[Masjid Name]",
  "address": { "@type": "PostalAddress", "streetAddress": "", "addressLocality": "", "postalCode": "" },
  "telephone": "",
  "email": "",
  "openingHours": "Mo-Su 00:00-23:59",
  "servesCuisine": "N/A",
  "sameAs": ["[Facebook]", "[Instagram]"]
}
```

---

## ♿ ACCESSIBILITY

- Arabic text: `lang="ar"` + `dir="rtl"` on all Arabic elements
- Quran verses: transliteration and translation visible
- All images: descriptive alt tags
- Form labels connected to all inputs
- Focus styles always visible
- ARIA roles on prayer times table
- Skip-to-content link at top
- Keyboard accessible lightbox (Esc, arrows)
- WCAG AA color contrast minimum

---

## 🛠️ JAVASCRIPT SPECIFICATIONS

### prayer-times.js
```javascript
/*
1. Fetch: https://api.aladhan.com/v1/timingsByCity?city=X&country=Y&method=Z
2. Display Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha + Jumu'ah on Fridays
3. Show Gregorian + Hijri date
4. Highlight next upcoming prayer (compare to current time every minute)
5. Live countdown timer to next prayer (updates every second)
6. localStorage cache with 24-hour expiry
7. Error handling: graceful fallback if API fails
8. Auto-determine timezone from browser
*/
```

### donation.js
```javascript
/*
1. Multi-step form progression with validation each step
2. Quick-select amount buttons (toggle active)
3. Custom amount validation (min $1, numbers only)
4. Zakat calculator: input assets → check nisab → calculate 2.5%
5. Donation type affects form labels and success message
6. Animated progress bar for campaigns
7. Success state: "Jazakallahu Khayran" + donation summary
*/
```

### main.js
```javascript
/*
1. Sticky nav scroll class toggle
2. Hamburger menu + body scroll lock
3. Smooth scroll for anchor links
4. IntersectionObserver for scroll animations
5. Active nav link based on current page
6. Back-to-top button (show after 300px scroll)
7. Accordion for FAQ sections
8. Number counter for stats (animates 0 → target)
*/
```

---

## 📋 CONTENT GUIDELINES

### Language & Tone
- Warm, inclusive, respectful — welcoming to Muslims and non-Muslims alike
- Use Islamic phrases naturally: "Insha'Allah", "Alhamdulillah", "Mashaa'Allah", "Jazakallahu Khayran"
- Clear sentences — community includes ESL speakers

### Islamic Content Accuracy
- Quran verses: accurate Arabic + Saheeh International or Dr. Mustafa Khattab translation
- Hadith: include source (Bukhari, Muslim, etc.)
- Prayer times: accurate for location using recognized calculation method
- Do NOT invent Islamic rulings or present opinions as facts

### Imagery Guidelines
ALLOWED:
- Masjid exterior and interior
- Geometric patterns and Islamic art
- Arabic calligraphy
- Men in prayer (properly dressed)
- Community events (appropriately dressed)
- Food photos (iftar, community meals)
- Nature/sky backgrounds

NOT ALLOWED:
- Photos of women without hijab
- Inappropriate or immodest imagery
- Music autoplay
- Animate beings in decorative roles
- Any haram content references

---

## ✅ FINAL DELIVERY CHECKLIST

### Functionality
- [ ] Prayer times load from AlAdhan API
- [ ] Next prayer highlighted and countdown updating
- [ ] Donation form all 4 steps work
- [ ] Zakat calculator computes correctly
- [ ] All forms validate and show success messages
- [ ] Hamburger menu opens/closes properly
- [ ] Gallery lightbox works with keyboard
- [ ] FAQ accordions animate correctly
- [ ] All nav links work (correct active states per page)
- [ ] Add to Calendar buttons functional
- [ ] Hijri date displays correctly

### Design & Content
- [ ] No Lorem Ipsum anywhere
- [ ] Arabic text displays correctly (RTL)
- [ ] Quran verses have accurate translations
- [ ] Prayer names shown in English + Arabic
- [ ] Consistent color scheme throughout
- [ ] Fonts load correctly
- [ ] Islamic geometric patterns display properly
- [ ] Mobile design polished at 375px

### Code Quality
- [ ] HTML validates (no unclosed tags)
- [ ] CSS variables used throughout
- [ ] JS has no console errors
- [ ] All images have alt attributes
- [ ] Arabic text has lang="ar" and dir="rtl"
- [ ] Form labels connected to inputs
- [ ] defer on all script tags
- [ ] loading="lazy" on non-hero images
- [ ] No API keys hardcoded

### SEO & Accessibility
- [ ] Unique title + meta description per page
- [ ] Schema.org MosqueOrTemple JSON-LD on homepage
- [ ] Open Graph tags on all pages
- [ ] Skip-to-content link at top
- [ ] WCAG AA color contrast
- [ ] Focus visible on all interactive elements

### Responsive
- [ ] 375px (iPhone) ✓
- [ ] 768px (iPad) ✓
- [ ] 1024px (laptop) ✓
- [ ] 1440px (desktop) ✓
- [ ] No horizontal scrollbar at any breakpoint

---

## 📦 CDN RESOURCES

```html
<!-- Google Fonts — Arabic + English -->
<link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:wght@400;600;700&family=Nunito:wght@300;400;500;600&display=swap" rel="stylesheet">

<!-- Font Awesome 6 -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

<!-- Swiper.js -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js" defer></script>

<!-- AlAdhan Prayer Times API — free, no key required -->
<!-- Base: https://api.aladhan.com/v1/ -->

<!-- AOS (optional scroll animations) -->
<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
<script src="https://unpkg.com/aos@2.3.1/dist/aos.js" defer></script>
```

Unsplash image URLs for Masjids:
```
https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=1200&auto=format&q=80
https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1200&auto=format&q=80
https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=1200&auto=format&q=80
https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=1200&auto=format&q=80
```

---

## 🚀 DELIVERY FORMAT

When complete, deliver:
1. **All HTML files** — fully written, not abbreviated
2. **All CSS files** — complete with section comments
3. **All JS files** — complete with function comments
4. **README.md** explaining:
   - How to run the site
   - How to change prayer calculation method
   - How to connect to a real payment gateway
   - How to update content, events, and programs
   - How to add new photos
5. **Brief design summary** — chosen aesthetic and why it fits the Masjid

---

## 🤲 CLOSING INTENTION

This website is built to serve the Muslim community and the worship of Allah (سبحانه وتعالى).
Every line of code should reflect care, craftsmanship, and deep respect for the Deen.

> "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا"
> "And whoever fears Allah — He will make for him a way out." (Quran 65:2)

---
**Version:** 1.0 | **Purpose:** Masjid Website AI Agent Instructions | **Target AI:** Gemini / Any LLM Agent

بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ