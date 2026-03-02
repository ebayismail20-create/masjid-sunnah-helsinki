// js/realtime-service.js

/**
 * Masjid Sunnah Helsinki - Realtime Synchronization Service
 * 
 * This service listens to Supabase Postgres changes via WebSockets
 * and automatically triggers UI updates when data changes on the server.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Ensure Supabase client and DataService are loaded
    if (!window.supabaseClient) {
        console.error("Supabase client not found. Realtime sync disabled.");
        return;
    }

    if (!window.DataService) {
        console.warn("DataService not found. Skipping UI realtime updates for public views.");
    }

    console.log("Initializing Realtime Subscriptions...");

    // Create a single channel for all public table changes
    const realtimeChannel = window.supabaseClient.channel('public-site-updates');

    // --- Subscription Handlers ---

    // 1. Announcements
    realtimeChannel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'announcements' },
        (payload) => {
            console.log('Realtime Update: Announcements', payload);
            if (window.DataService && typeof window.DataService.renderBannerAnnouncement === 'function') {
                window.DataService.renderBannerAnnouncement();
            }
            if (typeof triggerAdminRefresh === 'function') triggerAdminRefresh(); // Hook for admin.html
        }
    );

    // 2. Events
    realtimeChannel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'events' },
        (payload) => {
            console.log('Realtime Update: Events', payload);
            if (window.DataService) {
                if (typeof window.DataService.renderEventsPreview === 'function') {
                    window.DataService.renderEventsPreview(3); // For index.html
                }
                if (typeof window.DataService.renderAllEvents === 'function' && document.getElementById('events-grid')) {
                    window.DataService.renderAllEvents('events-grid'); // For events.html
                }
            }
            if (typeof triggerAdminRefresh === 'function') triggerAdminRefresh();
        }
    );

    // 3. Programs
    realtimeChannel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'programs' },
        (payload) => {
            console.log('Realtime Update: Programs', payload);
            if (window.DataService) {
                if (typeof window.DataService.renderAllPrograms === 'function' && document.getElementById('programs-grid')) {
                    window.DataService.renderAllPrograms('programs-grid'); // For programs.html
                }
            }
            if (typeof triggerAdminRefresh === 'function') triggerAdminRefresh();
        }
    );

    // 4. Settings (Iqamah, Contact, Jummah)
    realtimeChannel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'settings' },
        (payload) => {
            console.log('Realtime Update: Settings', payload);
            if (window.DataService) {
                // Determine which setting changed to only update what's necessary, 
                // or safely re-render all settings blocks.
                const key = payload.new ? payload.new.key : null;
                
                if (key === 'iqamah_times' && typeof window.DataService.renderIqamahTimes === 'function') {
                    window.DataService.renderIqamahTimes();
                } else if (key === 'jummah_info' && typeof window.DataService.renderJummahInfo === 'function') {
                    window.DataService.renderJummahInfo();
                } else if (key === 'contact_info' && typeof window.DataService.renderContactInfo === 'function') {
                    window.DataService.renderContactInfo();
                } else {
                    // Fallback to update everything if we can't determine the key (e.g., on a strict delete event context)
                    if (typeof window.DataService.renderIqamahTimes === 'function') window.DataService.renderIqamahTimes();
                    if (typeof window.DataService.renderJummahInfo === 'function') window.DataService.renderJummahInfo();
                    if (typeof window.DataService.renderContactInfo === 'function') window.DataService.renderContactInfo();
                }
            }
            if (typeof triggerAdminRefresh === 'function') triggerAdminRefresh();
        }
    );

    // Subscribe to the channel
    realtimeChannel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
            console.log('Successfully connected to Supabase Realtime');
        } else {
            console.log('Realtime subscription status:', status);
        }
    });

});
