// js/data-service.js

/**
 * Masjid Sunnah Helsinki - Frontend Data Integration Service
 * 
 * This file acts as the bridge between the Supabase Backend
 * and the public-facing HTML pages.
 */

const DataService = {
    // --- Data Retrieval ---
    getAnnouncements: async function () {
        const { data, error } = await window.supabaseClient
            .from('announcements')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching announcements:', error);
            return [];
        }
        return data || [];
    },
    getEvents: async function () {
        const { data, error } = await window.supabaseClient
            .from('events')
            .select('*')
            .order('date', { ascending: true });

        if (error) {
            console.error('Error fetching events:', error);
            return [];
        }
        return data || [];
    },
    getPrograms: async function () {
        const { data, error } = await window.supabaseClient
            .from('programs')
            .select('*');

        if (error) {
            console.error('Error fetching programs:', error);
            return [];
        }
        return data || [];
    },
    getIqamahTimes: async function () {
        console.log("Fetching Iqamah times from Supabase DataService...");
        const { data, error } = await window.supabaseClient
            .from('settings')
            .select('value')
            .eq('key', 'iqamah_times')
            .single();

        if (error) {
            console.error('Error fetching iqamah times:', error);
            return null;
        }
        console.log("Returned Iqamah:", data ? data.value : null);
        return data ? data.value : null;
    },
    getContactInfo: async function () {
        const { data, error } = await window.supabaseClient
            .from('settings')
            .select('value')
            .eq('key', 'contact_info')
            .single();

        if (error) {
            console.error('Error fetching contact info:', error);
            return null;
        }
        return data ? data.value : null;
    },
    getJummahInfo: async function () {
        const { data, error } = await window.supabaseClient
            .from('settings')
            .select('value')
            .eq('key', 'jummah_info')
            .single();

        if (error) {
            console.error('Error fetching jummah info:', error);
            return null;
        }
        return data ? data.value : null;
    },

    // --- DOM Injection Methods ---

    /**
     * Injects the latest active announcement into the top banner slot.
     * Expects an element with ID 'announcement-banner-container'.
     */
    renderBannerAnnouncement: async function () {
        const container = document.getElementById('announcement-banner-container');
        if (!container) return;

        const announcements = await this.getAnnouncements();

        if (announcements.length === 0) {
            container.style.display = 'none';
            return;
        }

        const activeAnnouncement = announcements[announcements.length - 1];

        let badgeStyle = "background-color: var(--color-secondary); color: var(--color-bg-dark);";
        let icon = "fa-bullhorn";

        if (activeAnnouncement.type === 'Urgent') {
            badgeStyle = "background-color: #e53e3e; color: white;";
            icon = "fa-exclamation-triangle";
        } else if (activeAnnouncement.type === 'Ramadan' || activeAnnouncement.type === 'Eid') {
            badgeStyle = "background-color: var(--color-primary); color: white;";
            icon = "fa-moon";
        }

        const html = `
            <div class="announcement-banner" style="display: flex; align-items: center; justify-content: center; padding: 10px 20px; text-align: center; font-family: var(--font-main); box-shadow: 0 2px 5px rgba(0,0,0,0.1); position: relative; z-index: 998; margin-top: var(--header-height, 80px); ${badgeStyle}">
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

        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.classList.add('scrolled');
        }
    },

    /**
     * Injects Iqamah times into the specified elements.
     */
    renderIqamahTimes: async function () {
        const iqamah = await this.getIqamahTimes();
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
     */
    renderJummahInfo: async function () {
        const jummah = await this.getJummahInfo();
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
     * Injects Contact Info globally across all pages where classes are present
     */
    renderContactInfo: async function () {
        const contact = await this.getContactInfo();
        if (!contact) return;

        // Populate elements by class name so we can inject them in multiple places dynamically
        const setByClass = (className, value, prefix = '') => {
            if (!value) return;
            const elements = document.querySelectorAll('.' + className);
            elements.forEach(el => {
                if (el.tagName === 'A') {
                    el.href = prefix + value;
                    el.innerText = value;
                } else {
                    el.innerText = value;
                }
            });
        };

        setByClass('ms-contact-email', contact.email, 'mailto:');
        setByClass('ms-contact-phone', contact.phone, 'tel:');
        setByClass('ms-contact-address', contact.address);
    },

    /**
     * Renders a preview of upcoming events.
     */
    renderEventsPreview: async function (limit = 3) {
        const container = document.getElementById('events-preview-grid');
        if (!container) return;

        const events = await this.getEvents();

        if (events.length === 0) {
            container.innerHTML = `<p style="text-align:center; color:#666; width:100%;">No upcoming events scheduled at this time.</p>`;
            return;
        }

        const previewEvents = events.slice(0, limit);
        let html = '';

        previewEvents.forEach(event => {
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
    },

    /**
     * Renders all events for the events.html page.
     */
    renderAllEvents: async function (containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const events = await this.getEvents();

        if (events.length === 0) {
            container.innerHTML = `<p style="text-align:center; color:#666; width:100%;">There are no upcoming events at this time. Please check back later.</p>`;
            return;
        }

        let html = '';

        events.forEach(event => {
            const dateObj = new Date(event.date);
            const displayDate = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

            html += `
                <div class="event-card" data-category="${event.category}">
                    <div class="event-image">
                        <img src="${event.image_url || 'https://images.unsplash.com/photo-1590076215667-83ee42ff7594?auto=format&fit=crop&q=80&w=800'}" alt="Event Image">
                    </div>
                    <div class="event-content">
                        <div class="event-category">${event.category}</div>
                        <h3>${event.title}</h3>
                        <div class="event-info-line">
                            <i class="far fa-calendar-alt"></i> ${displayDate}
                        </div>
                        <div class="event-info-line">
                            <i class="far fa-clock"></i> ${event.time}
                        </div>
                        <div class="event-info-line">
                            <i class="fas fa-map-marker-alt"></i> ${event.location}
                        </div>
                        <p>${event.description}</p>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    },

    /**
     * Renders all programs for the programs.html page.
     */
    renderAllPrograms: async function (containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const programs = await this.getPrograms();

        if (programs.length === 0) {
            container.innerHTML = `<p style="text-align:center; color:#666; width:100%;">There are no active programs at this time.</p>`;
            return;
        }

        let html = '';

        programs.forEach(prog => {
            let icon = prog.icon || 'fa-book-open';

            html += `
                <div class="program-card" data-category="${prog.type}">
                    <div class="program-icon">
                        <i class="fas ${icon}"></i>
                    </div>
                    <h3>${prog.title}</h3>
                    <p>${prog.description}</p>
                    <ul class="program-details">
                        <li><i class="fas fa-clock"></i> <strong>Schedule:</strong> ${prog.schedule}</li>
                        <li><i class="fas fa-users"></i> <strong>Type/Audience:</strong> ${prog.type}</li>
                        <li><i class="fas fa-info-circle"></i> <strong>Status:</strong> ${prog.status}</li>
                    </ul>
                </div>
            `;
        });

        container.innerHTML = html;
    }
};

// Make DataService globally available for other scripts like prayer-times.js
window.DataService = DataService;

// Auto-run common integrations on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    DataService.renderBannerAnnouncement();
    DataService.renderContactInfo();
    DataService.renderIqamahTimes();
    DataService.renderJummahInfo();
});
