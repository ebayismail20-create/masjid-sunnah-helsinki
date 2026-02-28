// js/data-service.js

/**
 * Masjid Sunnah Helsinki - Frontend Data Integration Service
 * 
 * This file acts as the bridge between the data saved in localStorage (from admin.html)
 * and the public-facing HTML pages.
 */

const DataService = {
    // --- Data Retrieval ---
    getAnnouncements: function () {
        return JSON.parse(localStorage.getItem('ms_announcements')) || [];
    },
    getEvents: function () {
        return JSON.parse(localStorage.getItem('ms_events')) || [];
    },
    getPrograms: function () {
        return JSON.parse(localStorage.getItem('ms_programs')) || [];
    },
    getIqamahTimes: function () {
        return JSON.parse(localStorage.getItem('ms_iqamah')) || null;
    },
    getContactInfo: function () {
        return JSON.parse(localStorage.getItem('ms_contact')) || null;
    },
    getJummahInfo: function () {
        return JSON.parse(localStorage.getItem('ms_jummah')) || null;
    },

    // --- DOM Injection Methods ---

    /**
     * Injects the latest active announcement into the top banner slot.
     * Expects an element with ID 'announcement-banner-container'.
     */
    renderBannerAnnouncement: function () {
        const container = document.getElementById('announcement-banner-container');
        if (!container) return;

        const announcements = this.getAnnouncements();

        // Find the most recent announcement 
        // Assuming they are sorted or we just take the last inserted (newest)
        if (announcements.length === 0) {
            container.style.display = 'none';
            return;
        }

        // Taking the last item assuming chronological append. 
        // If they are date sorted, we might want the closest date.
        // For simplicity, we just use the last item in the array for now.
        const activeAnnouncement = announcements[announcements.length - 1];

        // Format the banner type
        let badgeStyle = "background-color: var(--color-gold); color: var(--color-dark);";
        let icon = "fa-bullhorn";

        if (activeAnnouncement.type === 'Urgent') {
            badgeStyle = "background-color: var(--color-danger); color: white;";
            icon = "fa-exclamation-triangle";
        } else if (activeAnnouncement.type === 'Ramadan' || activeAnnouncement.type === 'Eid') {
            badgeStyle = "background-color: var(--color-green); color: white;";
            icon = "fa-moon";
        }

        const html = `
            <div class="announcement-banner" style="display: flex; align-items: center; justify-content: center; padding: 10px 20px; text-align: center; font-family: var(--font-main); box-shadow: 0 2px 5px rgba(0,0,0,0.1); position: relative; z-index: 1000; ${badgeStyle}">
                <div style="max-width: 1200px; display: flex; align-items: center; gap: 15px; flex-wrap: wrap; justify-content: center;">
                    <span style="font-weight: bold; background: rgba(0,0,0,0.1); padding: 3px 10px; border-radius: 20px; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px;">
                        <i class="fas ${icon}"></i> ${activeAnnouncement.type}
                    </span>
                    <strong style="font-size: 1rem;">${activeAnnouncement.title}:</strong>
                    <span style="font-size: 0.95rem;">${activeAnnouncement.message}</span>
                </div>
                <button onclick="this.parentElement.style.display='none'" style="position: absolute; right: 15px; background: none; border: none; font-size: 1.2rem; cursor: pointer; color: inherit; opacity: 0.7;">&times;</button>
            </div>
        `;

        container.innerHTML = html;
        container.style.display = 'block';
    },

    /**
     * Injects Iqamah times into the specified elements.
     * Expects IDs: fajr-iqamah, dhuhr-iqamah, asr-iqamah, maghrib-iqamah, isha-iqamah
     */
    renderIqamahTimes: function () {
        const iqamah = this.getIqamahTimes();
        if (!iqamah) return;

        const populate = (id, val) => {
            const el = document.getElementById(id);
            if (el && val) el.innerText = val;
        };

        populate('fajr-iqamah', iqamah.fajr);
        populate('dhuhr-iqamah', iqamah.dhuhr);
        populate('asr-iqamah', iqamah.asr);
        populate('maghrib-iqamah', iqamah.maghrib);
        populate('isha-iqamah', iqamah.isha);
    },

    /**
     * Injects Jumu'ah information.
     * Expects IDs: jummah-time, jummah-khateeb, jummah-topic
     */
    renderJummahInfo: function () {
        const jummah = this.getJummahInfo();
        if (!jummah) return;

        const populate = (id, val) => {
            const el = document.getElementById(id);
            if (el && val) el.innerText = val;
        };

        populate('jummah-time', jummah.time);
        populate('jummah-khateeb', jummah.khateeb);
        populate('jummah-topic', jummah.topic);
    },

    /**
     * Renders a preview of upcoming events (e.g. for the homepage).
     * Expects an element with ID 'events-preview-grid'.
     */
    renderEventsPreview: function (limit = 3) {
        const container = document.getElementById('events-preview-grid');
        if (!container) return;

        const events = this.getEvents();

        if (events.length === 0) {
            container.innerHTML = `<p style="text-align:center; color:#666; width:100%;">No upcoming events scheduled at this time.</p>`;
            // Optionally, we could still show the placeholder cards here if we preferred.
            return;
        }

        // Sort by date (assuming YYYY-MM-DD strings)
        events.sort((a, b) => new Date(a.date) - new Date(b.date));

        const previewEvents = events.slice(0, limit);
        let html = '';

        previewEvents.forEach(event => {
            // Format date string for display
            const dateObj = new Date(event.date);
            const displayDate = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

            html += `
                <div class="event-card">
                    <div class="event-date">
                        <i class="far fa-calendar-alt"></i> ${displayDate} | ${event.time}
                    </div>
                    <h3 class="event-title">${event.title}</h3>
                    <div class="event-details">
                        <span><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
                        <span><i class="fas fa-tag"></i> ${event.category}</span>
                    </div>
                    <p class="event-desc">${event.description}</p>
                </div>
            `;
        });

        container.innerHTML = html;
    }
};

// Auto-run common integrations on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    DataService.renderBannerAnnouncement();
    DataService.renderIqamahTimes();
    DataService.renderJummahInfo();
    // Specific page calls can be triggered via inline scripts or logic
});
