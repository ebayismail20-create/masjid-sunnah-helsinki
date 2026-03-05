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

        let themeClass = "default-type";
        let icon = "fa-bullhorn";

        if (activeAnnouncement.type === 'Urgent') {
            themeClass = "urgent-type";
            icon = "fa-exclamation-triangle";
        } else if (activeAnnouncement.type === 'Ramadan' || activeAnnouncement.type === 'Eid') {
            themeClass = "islamic-type";
            icon = "fa-moon";
        }

        const html = `
            <div class="premium-announcement-banner ${themeClass}">
                <div class="premium-announcement-content">
                    <span class="premium-announcement-badge">
                        <i class="fas ${icon}"></i> <span>${activeAnnouncement.type}</span>
                    </span>
                    <div class="premium-announcement-text">
                        <strong>${activeAnnouncement.title}:</strong>
                        <span>${activeAnnouncement.message}</span>
                    </div>
                </div>
                <button onclick="this.parentElement.style.display='none'" class="premium-announcement-close" aria-label="Close Announcement">&times;</button>
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
                <div class="event-card card" data-category="${event.category}" style="display: flex; flex-direction: column; overflow: hidden; height: 100%;">
                    <div style="width: 100%; height: 200px; overflow: hidden; border-bottom: 2px solid var(--color-border);">
                        <img src="${event.image_url || 'https://images.unsplash.com/photo-1590076215667-83ee42ff7594?auto=format&fit=crop&q=80&w=800'}" alt="Event Image" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div style="padding: var(--space-md); flex-grow: 1; display: flex; flex-direction: column;">
                        <div style="color: var(--color-secondary); font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">${event.category}</div>
                        <h3 style="margin-bottom: var(--space-sm); font-size: 1.4rem;">${event.title}</h3>
                        <div style="margin-bottom: var(--space-xs); font-size: 0.95rem; color: var(--color-text-muted);">
                            <i class="far fa-calendar-alt" style="width: 20px; color: var(--color-primary);"></i> ${displayDate}
                        </div>
                        <div style="margin-bottom: var(--space-xs); font-size: 0.95rem; color: var(--color-text-muted);">
                            <i class="far fa-clock" style="width: 20px; color: var(--color-primary);"></i> ${event.time}
                        </div>
                        <div style="margin-bottom: var(--space-md); font-size: 0.95rem; color: var(--color-text-muted);">
                            <i class="fas fa-map-marker-alt" style="width: 20px; color: var(--color-primary);"></i> ${event.location}
                        </div>
                        <p style="flex-grow: 1; border-top: 1px solid var(--color-border); padding-top: var(--space-sm); margin-top: auto;">${event.description}</p>
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
            let mediaHtml = prog.image_url
                ? `<div style="width: 100%; height: 200px; overflow: hidden; border-bottom: 2px solid var(--color-border);"><img src="${prog.image_url}" alt="Program Image" style="width: 100%; height: 100%; object-fit: cover;"></div>`
                : `<div style="background: var(--color-primary); color: var(--color-secondary); padding: 2rem; text-align: center; font-size: 4rem; border-bottom: 2px solid var(--color-border);"><i class="fas ${icon}"></i></div>`;

            html += `
                <div class="program-card card" data-category="${prog.type || prog.audience}" style="display: flex; flex-direction: column; overflow: hidden; height: 100%;">
                    ${mediaHtml}
                    <div style="padding: var(--space-md); flex-grow: 1; display: flex; flex-direction: column;">
                        <h3 style="margin-bottom: var(--space-xs); font-size: 1.4rem;">${prog.name || prog.title}</h3>
                        <p style="color: var(--color-text-muted); margin-bottom: var(--space-md); flex-grow: 1;">${prog.description}</p>
                        <ul style="list-style: none; padding: 0; font-size: 0.95rem; border-top: 1px solid var(--color-border); margin-top: auto; padding-top: var(--space-sm);">
                            <li style="margin-bottom: 5px;"><i class="fas fa-clock" style="color: var(--color-primary); width: 20px;"></i> <strong>Schedule:</strong> ${prog.schedule}</li>
                            <li style="margin-bottom: 5px;"><i class="fas fa-users" style="color: var(--color-primary); width: 20px;"></i> <strong>Audience:</strong> ${prog.audience || prog.type}</li>
                            <li><i class="fas fa-user-tie" style="color: var(--color-primary); width: 20px;"></i> <strong>Instructor:</strong> ${prog.instructor || 'TBA'}</li>
                        </ul>
                        <button class="btn btn-outline" style="margin-top: var(--space-md); width: 100%;" onclick="openModal('${(prog.name || prog.title).replace(/'/g, "\\'")}')">Register Now</button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    },

    // -------- Gallery Rendering --------
    async renderGallery() {
        const container = document.getElementById('gallery-grid') || document.querySelector('.gallery-grid');
        if (!container) return;

        try {
            const { data, error } = await window.supabaseClient
                .from('gallery')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (!data || data.length === 0) {
                container.innerHTML = '<p style="text-align:center; color:#888; grid-column: 1/-1; padding: 2rem;">No gallery images available yet.</p>';
                return;
            }

            container.innerHTML = data.map(img => `
                <div class="gallery-item" data-aos="fade-up">
                    <img src="${img.image_url}" alt="${img.caption || 'Gallery image'}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300?text=Image+Error'">
                    ${img.caption ? `<div class="gallery-caption">${img.caption}</div>` : ''}
                </div>
            `).join('');
        } catch (e) {
            console.error('Error rendering gallery:', e);
        }
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

    // Page-specific auto-renders
    if (document.getElementById('gallery-grid') || document.querySelector('.gallery-grid')) {
        DataService.renderGallery();
    }
});
