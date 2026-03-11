/* prayer-times.js - Fetch and Display Prayer Times from MasjidBox API */

document.addEventListener('DOMContentLoaded', () => {
    const PRAYERS = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    // Elements
    const tableContainer = document.getElementById('prayer-times-container');
    const nextPrayerEl = document.getElementById('next-prayer-name');
    const countdownEl = document.getElementById('prayer-countdown');
    const hijriDateEl = document.getElementById('hijri-date-display');
    const gregorianDateEl = document.getElementById('gregorian-date-display');

    if (!tableContainer) return; // Exit if not on a page that needs this

    // Render skeleton loaders initially
    tableContainer.innerHTML = Array(5).fill('<div class="skeleton"></div>').join('');

    // MasjidBox API Configuration
    const MASJIDBOX_API = 'https://api.masjidbox.com/1.0/masjidbox/landing/athany/masjid-sunnag?get=at&days=7';
    const MASJIDBOX_KEY = 'JejYcMS7hsOsZTPDk2ZhKOAlW9IyQ6Px';

    // Helper for Helsinki current date string (YYYY-MM-DD)
    const getHelsinkiDateStr = () => {
        try {
            return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Helsinki' }).format(new Date());
        } catch (e) {
            return new Date().toISOString().split('T')[0]; // Fallback
        }
    };

    // Cache key for today's date
    const todayStr = getHelsinkiDateStr();
    const cacheKey = `prayer_times_masjidbox_${todayStr}`;

    // Extract HH:MM from ISO date string like "2026-03-11T04:28:00+02:00"
    const extractTime = (isoStr) => {
        if (!isoStr) return '--:--';
        const d = new Date(isoStr);
        const h = d.getHours().toString().padStart(2, '0');
        const m = d.getMinutes().toString().padStart(2, '0');
        return `${h}:${m}`;
    };

    // Extract hour/minute parts from ISO string for countdown math
    const parseISOTimeParts = (isoStr) => {
        const d = new Date(isoStr);
        return { h: d.getHours(), m: d.getMinutes() };
    };

    async function fetchPrayerTimes() {
        // Check cache first
        const cache = localStorage.getItem(cacheKey);
        if (cache) {
            try {
                const data = JSON.parse(cache);
                await processMasjidBoxData(data);
                return;
            } catch (e) {
                console.warn("Prayer cache corrupted, fetching fresh data...");
            }
        }

        try {
            const response = await fetch(MASJIDBOX_API, {
                headers: { 'apikey': MASJIDBOX_KEY }
            });
            if (!response.ok) throw new Error("MasjidBox API response was not ok: " + response.status);
            const payload = await response.json();

            if (payload && payload.timetable && payload.timetable.length > 0) {
                // Cache successfully fetched data
                localStorage.setItem(cacheKey, JSON.stringify(payload));
                await processMasjidBoxData(payload);
            }
        } catch (error) {
            console.error("Failed to fetch prayer times from MasjidBox:", error);
            if (tableContainer) tableContainer.innerHTML = '<p class="text-center">Could not load prayer times. Please try again later.</p>';
        }
    }

    async function processMasjidBoxData(payload) {
        // Find today's entry from the timetable array
        const todayEntry = payload.timetable.find(entry => {
            const entryDate = entry.date.split('T')[0];
            return entryDate === todayStr;
        });

        if (!todayEntry) {
            // Fallback to first entry if today not found
            console.warn("Today's date not found in MasjidBox timetable, using first entry");
            await renderFromEntry(payload.timetable[0], payload);
            return;
        }

        await renderFromEntry(todayEntry, payload);
    }

    async function renderFromEntry(entry, payload) {
        // Build timings object (HH:MM format) for countdown compatibility
        const timings = {
            Fajr: extractTime(entry.fajr),
            Sunrise: extractTime(entry.sunrise),
            Dhuhr: extractTime(entry.dhuhr),
            Asr: extractTime(entry.asr),
            Maghrib: extractTime(entry.maghrib),
            Isha: extractTime(entry.isha)
        };

        // Build iqamah object from MasjidBox data
        const iqamahTimes = {};
        if (entry.iqamah) {
            iqamahTimes.fajr = extractTime(entry.iqamah.fajr);
            iqamahTimes.dhuhr = extractTime(entry.iqamah.dhuhr);
            iqamahTimes.asr = extractTime(entry.iqamah.asr);
            iqamahTimes.maghrib = extractTime(entry.iqamah.maghrib);
            iqamahTimes.isha = extractTime(entry.iqamah.isha);
        }

        // Jumuah from MasjidBox
        let jumuahTime = null;
        let jumuahIqamah = null;
        if (entry.jumuah && entry.jumuah.length > 0) {
            jumuahTime = extractTime(entry.jumuah[0]);
        }
        if (entry.iqamah && entry.iqamah.jumuah && entry.iqamah.jumuah.length > 0) {
            jumuahIqamah = extractTime(entry.iqamah.jumuah[0]);
        }

        // Display Dates
        if (hijriDateEl && entry.hijri) {
            hijriDateEl.textContent = entry.hijri.formatted;
        }
        if (gregorianDateEl) {
            const gDate = new Date(entry.date);
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            gregorianDateEl.textContent = gDate.toLocaleDateString('en-GB', options);
        }

        await renderTable(timings, iqamahTimes, jumuahTime, jumuahIqamah, entry);
        startCountdownTracker(timings);
    }

    async function renderTable(timings, iqamahTimes, jumuahTime, jumuahIqamah, entry) {
        const arabicNames = {
            'Fajr': 'الفجر',
            'Sunrise': 'الشروق',
            'Dhuhr': 'الظهر',
            'Asr': 'العصر',
            'Maghrib': 'المغرب',
            'Isha': 'العشاء'
        };

        const today = new Date();
        const isFriday = today.getDay() === 5;

        let html = `
        <table class="prayer-table" style="width: 100%; border-collapse: collapse; text-align: left; margin-bottom: 20px;">
            <thead>
                <tr style="border-bottom: 2px solid var(--color-primary); color: var(--color-primary);">
                    <th style="padding: 10px; font-family: var(--font-display);">Prayer / الصلاة</th>
                    <th style="padding: 10px; font-family: var(--font-display);">Adhan</th>
                    <th style="padding: 10px; font-family: var(--font-display);">Iqamah</th>
                </tr>
            </thead>
            <tbody>
        `;

        PRAYERS.forEach(prayer => {
            let time = timings[prayer];
            let iqamahDisplay = '-';

            // Get iqamah from MasjidBox data
            if (prayer !== 'Sunrise') {
                const key = prayer.toLowerCase();
                if (iqamahTimes[key]) {
                    iqamahDisplay = iqamahTimes[key];
                }
            }

            // On Fridays, replace Dhuhr with Jumu'ah logic
            let prayerNameEn = prayer;
            let prayerNameAr = arabicNames[prayer];

            if (isFriday && prayer === 'Dhuhr') {
                prayerNameEn = "Jumu'ah";
                prayerNameAr = "الجمعة";
                if (jumuahTime) time = jumuahTime;
                if (jumuahIqamah) iqamahDisplay = jumuahIqamah;
            }

            html += `
                <tr id="row-${prayer}" style="border-bottom: 1px solid var(--color-border);">
                    <td style="padding: 12px 10px;">
                        <strong>${prayerNameEn}</strong><br>
                        <span class="arabic-text" style="font-size:1.1em; color: var(--color-text-muted);">${prayerNameAr}</span>
                    </td>
                    <td style="padding: 12px 10px; font-weight: bold; font-size: 1.1rem; color: var(--color-primary);">${time}</td>
                    <td style="padding: 12px 10px; color: var(--color-text-muted);">${iqamahDisplay}</td>
                </tr>
            `;
        });

        html += `</tbody></table>
        <p style="font-size:0.8rem;color:var(--color-text-muted);margin-top:8px;">
            Prayer times powered by <a href="https://masjidbox.com/prayer-times/masjid-sunnag" target="_blank" style="color:var(--color-secondary);">MasjidBox</a>
        </p>`;
        tableContainer.innerHTML = html;
    }

    let countdownInterval = null;

    // Helper to get exact current time in Helsinki
    const getHelsinkiTimeParts = () => {
        try {
            const parts = new Intl.DateTimeFormat('en-US', {
                timeZone: 'Europe/Helsinki',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: false
            }).formatToParts(new Date());

            let h = 0, m = 0, s = 0;
            parts.forEach(p => {
                if (p.type === 'hour') h = parseInt(p.value, 10);
                if (p.type === 'minute') m = parseInt(p.value, 10);
                if (p.type === 'second') s = parseInt(p.value, 10);
            });
            if (h === 24) h = 0;
            return { h, m, s };
        } catch (e) {
            const now = new Date();
            return { h: now.getHours(), m: now.getMinutes(), s: now.getSeconds() };
        }
    };

    // Helper to safely parse time strings like "05:30"
    const parseTimeStr = (tStr) => {
        const parts = tStr.split(':');
        return {
            h: parseInt(parts[0], 10),
            m: parseInt(parts[1], 10)
        };
    };

    function startCountdownTracker(timings) {
        if (countdownInterval) clearInterval(countdownInterval);

        function updateCountdown() {
            // Auto-reset if day has changed
            const currentHelsinkiDate = getHelsinkiDateStr();
            if (localStorage.getItem('prayer_date') && localStorage.getItem('prayer_date') !== currentHelsinkiDate) {
                if (countdownInterval) clearInterval(countdownInterval);
                fetchPrayerTimes();  // Re-fetch for new day
                return false;
            }
            localStorage.setItem('prayer_date', currentHelsinkiDate);

            const hTime = getHelsinkiTimeParts();
            const currentTotalSeconds = (hTime.h * 3600) + (hTime.m * 60) + hTime.s;

            let nextPrayerIndex = -1;

            for (let i = 0; i < PRAYERS.length; i++) {
                const pTime = parseTimeStr(timings[PRAYERS[i]]);
                const tTotalSeconds = (pTime.h * 3600) + (pTime.m * 60);

                if (tTotalSeconds > currentTotalSeconds) {
                    nextPrayerIndex = i;
                    break;
                }
            }

            let currentPrayerIndex;
            let minDiff = 0;
            let crossesMidnight = false;

            if (nextPrayerIndex === -1) {
                currentPrayerIndex = PRAYERS.length - 1;
                nextPrayerIndex = 0;
                crossesMidnight = true;
            } else if (nextPrayerIndex === 0) {
                currentPrayerIndex = PRAYERS.length - 1;
            } else {
                currentPrayerIndex = nextPrayerIndex - 1;
            }

            const nextPrayer = PRAYERS[nextPrayerIndex];

            const nTime = parseTimeStr(timings[nextPrayer]);
            let nTotalSeconds = (nTime.h * 3600) + (nTime.m * 60);

            if (crossesMidnight) {
                nTotalSeconds += 24 * 3600;
            }
            minDiff = nTotalSeconds - currentTotalSeconds;

            // Highlight next prayer row with soft color
            PRAYERS.forEach(p => {
                const r = document.getElementById(`row-${p}`);
                if (r) {
                    if (p === nextPrayer) {
                        r.style.backgroundColor = "#FFFDE7";
                        r.style.borderLeft = "6px solid #FBC02D";
                    } else {
                        r.style.backgroundColor = "";
                        r.style.borderLeft = "";
                    }
                }
            });

            // Update UI Counters
            if (nextPrayerEl) {
                const today = new Date();
                const isFriday = today.getDay() === 5;
                if (isFriday && nextPrayer === 'Dhuhr') {
                    nextPrayerEl.textContent = "Jumu'ah";
                } else {
                    nextPrayerEl.textContent = nextPrayer;
                }
            }

            if (countdownEl) {
                const h = Math.floor(minDiff / 3600);
                const m = Math.floor((minDiff % 3600) / 60);
                const s = minDiff % 60;
                countdownEl.textContent = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            }

            return true;
        }

        // Call immediately to prevent --:--:-- flashing
        if (updateCountdown() !== false) {
            countdownInterval = setInterval(updateCountdown, 1000);
        }
    }

    // Initialize
    fetchPrayerTimes();

    window.addEventListener('beforeunload', () => {
        if (countdownInterval) clearInterval(countdownInterval);
    });
});
