# Masjid Sunnah — Admin Panel Specification

## Overview

Build a single-file `admin.html` page for Masjid Sunnah Helsinki website. This is a content management panel for non-technical users (mosque staff) to add, edit, and delete website content without touching any code.

All data must be saved to `localStorage` so it persists between sessions. No backend or database required.

---

## Design Style

- **Colors:** Dark green `#2C4C3B` (primary), gold `#D4AF37` (accent), light background `#F0F4F1`
- **Fonts:** `Amiri` (Google Fonts, for Arabic text), `Nunito` (Google Fonts, for all other text)
- **Icons:** Font Awesome 6 (CDN)
- **Style:** Clean, professional, sidebar layout. Similar to a simple CMS dashboard.

---

## Authentication

- Show a **login screen** before the app loads
- Single password field (no username)
- Default password: `masjid2024`
- Password is stored in `localStorage` and changeable from Settings
- On wrong password, show error message
- On correct password, hide login screen and show the main app

---

## Layout

```
┌─────────────────────────────────────────────────────┐
│  SIDEBAR (fixed, 260px)  │  MAIN CONTENT AREA        │
│                          │                           │
│  🕌 Masjid Sunnah Admin  │  [Top Bar: title + clock] │
│  مسجد السنة              │                           │
│  ─────────────────       │  [Page content here]      │
│  OVERVIEW                │                           │
│  › Dashboard             │                           │
│                          │                           │
│  CONTENT                 │                           │
│  › Announcements         │                           │
│  › Events                │                           │
│  › Programs              │                           │
│                          │                           │
│  MASJID INFO             │                           │
│  › Iqamah Times          │                           │
│  › Contact Info          │                           │
│  › Jumu'ah Info          │                           │
│                          │                           │
│  SYSTEM                  │                           │
│  › Settings              │                           │
│  ─────────────────       │                           │
│  [Log Out]               │                           │
└─────────────────────────────────────────────────────┘
```

- On mobile (< 768px): sidebar collapses, show hamburger menu button
- Active nav item highlighted with left gold border

---

## Pages / Panels

### 1. Dashboard
- Show 4 stat cards: count of Announcements, Events, Programs, and a checkmark for Prayer Times
- Cards are clickable and navigate to the relevant section
- Show a "Quick Guide" section explaining what each section does in simple language

---

### 2. Announcements
- **List view:** Show all announcements as cards with title, date, type badge, Edit and Delete buttons
- **Add button** opens a modal form with:
  - Title / Headline (required)
  - Full Message (textarea)
  - Date (date picker)
  - Type (dropdown: General, Urgent, Eid, Ramadan, Event, Closure)
- Edit pre-fills the form with existing data
- Delete asks for confirmation before removing
- Empty state shows an icon and helpful message

---

### 3. Events
- **List view:** Show all events as cards with name, date, time, location, Edit and Delete buttons
- **Add button** opens a modal form with:
  - Event Name (required)
  - Description (textarea)
  - Date (date picker, required)
  - Time (text field, e.g. "6:00 PM")
  - Location (text field)
  - Category (dropdown: Community, Educational, Ramadan, Eid, Youth, Fundraiser)
  - Contact / RSVP Info (text field)

---

### 4. Programs & Classes
- **List view:** Show all programs as cards with name, schedule, audience, Edit and Delete buttons
- **Add button** opens a modal form with:
  - Program Name (required)
  - Description (textarea)
  - Schedule (text field, e.g. "Sundays 10:00–13:00")
  - Audience (dropdown: All Ages, Children 5-12, Youth 13-18, Adults, Sisters Only, Brothers Only, New Muslims)
  - Instructor / Teacher (text field)
  - Room / Location (text field)
  - Registration / Contact Info (text field)

---

### 5. Iqamah Times
- A table with all 5 prayers: Fajr, Dhuhr, Asr, Maghrib, Isha
- Each row shows: English name, Arabic name (using Amiri font, RTL direction), Iqamah time input, Notes input
- Arabic names: الفجر، الظهر، العصر، المغرب، العشاء
- One "Save Iqamah Times" button saves all rows at once to localStorage key `ms_iqamah`
- Input placeholder: "e.g. 06:30"

---

### 6. Contact Information
- A 2-column grid of info cards (1-column on mobile)
- **Address card:** Street Address, City & Postcode, Country
- **Phone & Email card:** Phone Number, Email Address, WhatsApp Number
- **Office Hours card:** Weekday Hours, Weekend Hours
- **Social Media card:** Facebook URL, Instagram URL, YouTube URL
- One "Save Contact Info" button saves everything to localStorage key `ms_contactInfo`
- On load, pre-fill inputs from saved localStorage data

---

### 7. Jumu'ah (Friday Prayer) Info
- A single form card:
  - Khutbah Start Time
  - Iqamah (Salah) Time
  - This Week's Khutbah Topic
  - Khateeb (Speaker)
  - Language (dropdown: Arabic with English Translation, English only, Arabic only, Finnish with Arabic Translation)
  - Special Notes
- "Save Jumu'ah Info" button saves to localStorage key `ms_jummah`
- Pre-fill on load from saved data

---

### 8. Settings
Three separate cards:

**Change Password**
- Current Password input
- New Password input (min 6 characters)
- Confirm New Password input
- Validate all three before saving; show error toasts for mismatches

**Export & Backup**
- "Download Backup" button: exports all localStorage data (announcements, events, programs, iqamah, contactInfo, jummah) as a `.json` file named `masjid-backup-YYYY-MM-DD.json`
- "Restore Backup" button: file input that reads a `.json` file and restores all data, then re-renders all lists

**Clear All Content**
- "Clear All Content" button with a double-confirmation (`confirm()` dialog)
- Only clears lists (announcements, events, programs) — keeps contact info and prayer times

---

## Modal (Add / Edit)

- Triggered by "Add" or "Edit" buttons
- Dark backdrop overlay with blur
- Centered card with smooth slide-up animation
- Header with title and ✕ close button
- Form fields (specific to each content type, listed above)
- Footer with Cancel and Save buttons
- Close on Escape key press
- Close on clicking the backdrop
- On Save: validate required fields, save to localStorage, close modal, re-render list, show success toast

---

## Toast Notifications

- Fixed position, bottom-center of screen
- Rounded pill shape, green background
- Shows for 3 seconds then fades out
- Used for: Save success, Delete confirmation, Error messages, Password changes

---

## localStorage Keys

| Key | Type | Contents |
|-----|------|----------|
| `ms_announcements` | Array | List of announcement objects |
| `ms_events` | Array | List of event objects |
| `ms_programs` | Array | List of program objects |
| `ms_iqamah` | Object | Prayer name → time + note |
| `ms_contactInfo` | Object | All contact fields |
| `ms_jummah` | Object | Friday prayer info |
| `ms_password` | String | Admin password |

---

## Mobile Requirements

- Hamburger button (top-left, fixed position) on screens < 768px
- Sidebar slides in/out on hamburger click
- Clicking a nav item closes the sidebar on mobile
- All modals scroll if content is too tall
- Form fields stack to single column on mobile
- Dashboard stat cards go to 2-column grid on mobile

---

## Technology

- **Single HTML file** — no frameworks, no build tools
- Vanilla JavaScript only
- Google Fonts (Amiri + Nunito) via CDN
- Font Awesome 6 via CDN
- No backend, no API calls
- Works offline after first load (fonts cached)

---

## Sample Data Structures

**Announcement object:**
```json
{
  "title": "Eid Al-Fitr is on March 30th",
  "message": "Eid prayer will be at 8:00 AM at the main hall.",
  "date": "2025-03-30",
  "type": "Eid"
}
```

**Event object:**
```json
{
  "title": "Annual Community Iftar Dinner",
  "description": "Join us for a communal iftar dinner open to all.",
  "date": "2025-03-15",
  "time": "6:30 PM",
  "location": "Main Prayer Hall",
  "category": "Community",
  "contact": "info@masjidsunnah.fi"
}
```

**Program object:**
```json
{
  "name": "Sunday Quran School",
  "description": "Weekly Quran memorization and Tajweed classes for children.",
  "schedule": "Sundays 10:00–13:00",
  "audience": "Children (5-12)",
  "instructor": "Ustaz Mohammed",
  "room": "Classroom 2",
  "registration": "Register at reception"
}
```

**Iqamah object:**
```json
{
  "fajr": "06:30",
  "fajr_note": "",
  "dhuhr": "13:15",
  "dhuhr_note": "",
  "asr": "16:00",
  "asr_note": "Winter time",
  "maghrib": "18:05",
  "maghrib_note": "5 min after Adhan",
  "isha": "20:00",
  "isha_note": ""
}
```

---

## Notes for the Developer

- The admin panel is a **standalone file** — place it in the same folder as the main website
- No login system on the server side — this is password-protected only via JavaScript (suitable for a small mosque, not a bank)
- All content managers should regularly use **Download Backup** to save their data
- The panel does not automatically update the main website pages — a separate `content-manager.js` script would be needed to read from localStorage and inject content into the main site (out of scope for this spec)
