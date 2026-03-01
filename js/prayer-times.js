/* prayer-times.js - Fetch and Display Prayer Times using AlAdhan API */

document.addEventListener('DOMContentLoaded', () => {
    const PRAYERS = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    // Adding Hijri Month names for better local representation if available.

    // Elements
    const tableContainer = document.getElementById('prayer-times-container');
    const nextPrayerEl = document.getElementById('next-prayer-name');
    const countdownEl = document.getElementById('prayer-countdown');
    const hijriDateEl = document.getElementById('hijri-date-display');
    const gregorianDateEl = document.getElementById('gregorian-date-display');

    if (!tableContainer) return; // Exit if not on a page that needs this

    // Render skeleton loaders initially
    tableContainer.innerHTML = Array(5).fill('<div class="skeleton"></div>').join('');

    // Configuration for Helsinki
    const config = {
        city: 'Helsinki',
        country: 'Finland',
        method: 3, // Muslim World League (often standard for Europe)
        school: 1  // 0 Shafii, 1 Hanafi. Helsinki often has varied communities, standard MWL uses Shafii by default, but let's stick to API default unless specified
    };

    // Helper for Helsinki current date
    const getHelsinkiDateStr = () => {
        try {
            return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Helsinki' }).format(new Date());
        } catch (e) {
            return new Date().toISOString().split('T')[0]; // Fallback
        }
    };

    // Cache key for today's date in Helsinki
    const todayStr = getHelsinkiDateStr();
    const cacheKey = `prayer_times_${config.city}_${todayStr}`;

    async function fetchPrayerTimes() {
        // Check cache first
        const cache = localStorage.getItem(cacheKey);
        if (cache) {
            try {
                const data = JSON.parse(cache);
                await processPrayerData(data);
                return;
            } catch (e) {
                console.warn("Prayer cache corrupted, fetching fresh data...");
            }
        }

        try {
            const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${config.city}&country=${config.country}&method=${config.method}`);
            if (!response.ok) throw new Error("API Network response was not ok");
            const payload = await response.json();

            if (payload.code === 200 && payload.data) {
                // Cache successfully fetched data
                localStorage.setItem(cacheKey, JSON.stringify(payload.data));
                await processPrayerData(payload.data);
            }
        } catch (error) {
            console.error("Failed to fetch prayer times:", error);
            if (tableContainer) tableContainer.innerHTML = '<p class="text-center">Could not load prayer times. Please try again later.</p>';
        }
    }

    async function processPrayerData(data) {
        const timings = data.timings;
        const dateInfo = data.date;

        // Display Dates
        if (hijriDateEl) {
            hijriDateEl.textContent = `${dateInfo.hijri.day} ${dateInfo.hijri.month.en} ${dateInfo.hijri.year} AH`;
        }
        if (gregorianDateEl) {
            gregorianDateEl.textContent = `${dateInfo.gregorian.day} ${dateInfo.gregorian.month.en} ${dateInfo.gregorian.year}`;
        }

        await renderTable(timings);
        startCountdownTracker(timings);
    }

    async function renderTable(timings) {
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
                    <th style="padding: 10px; font-family: var(--font-display);">Iqamah *</th>
                </tr>
            </thead>
            <tbody>
        `;

        const iqamahData = await window.DataService.getIqamahTimes() || null;
        const jummahData = await window.DataService.getJummahInfo() || null;

        PRAYERS.forEach(prayer => {
            let time = timings[prayer];
            let iqamahDisplay = '-';

            // 1. First, apply the fallback mock logic as a baseline
            if (prayer !== 'Sunrise') {
                const cleanStr = time.split(' ')[0];
                const parts = cleanStr.split(':');
                let h = parseInt(parts[0], 10);
                let m = parseInt(parts[1], 10) + (prayer === 'Maghrib' ? 5 : 20);
                if (m >= 60) {
                    m -= 60;
                    h++;
                }
                if (h >= 24) h -= 24; // Ensure hour wraps around if it goes past 23
                iqamahDisplay = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
            }

            // 2. Then, strongly override IF the admin explicitly saved a string
            if (iqamahData) {
                if (prayer === 'Fajr' && iqamahData.fajr) iqamahDisplay = iqamahData.fajr;
                if (prayer === 'Dhuhr' && iqamahData.dhuhr) iqamahDisplay = iqamahData.dhuhr;
                if (prayer === 'Asr' && iqamahData.asr) iqamahDisplay = iqamahData.asr;
                if (prayer === 'Maghrib' && iqamahData.maghrib) iqamahDisplay = iqamahData.maghrib;
                if (prayer === 'Isha' && iqamahData.isha) iqamahDisplay = iqamahData.isha;
            }

            // On Fridays, replace Dhuhr with Jumu'ah logic
            let prayerNameEn = prayer;
            let prayerNameAr = arabicNames[prayer];

            if (isFriday && prayer === 'Dhuhr') {
                prayerNameEn = "Jumu'ah";
                prayerNameAr = "الجمعة";

                // Try fetching jumpah specifically
                if (jummahData && jummahData.time) {
                    iqamahDisplay = jummahData.time;
                } else {
                    iqamahDisplay = "See Schedule";
                }
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
            * Iqamah times are managed by the Masjid Admin.
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

    // Helper to safely parse API time strings like "05:30 (EET)"
    const parseTimeStr = (tStr) => {
        const cleanStr = tStr.split(' ')[0];
        const parts = cleanStr.split(':');
        return {
            h: parseInt(parts[0], 10),
            m: parseInt(parts[1], 10)
        };
    };

    function startCountdownTracker(timings) {
        if (countdownInterval) clearInterval(countdownInterval);

        countdownInterval = setInterval(() => {
            // Auto-reset if day has changed (in local browser terms, sufficient for reload trigger)
            const currentHelsinkiDate = getHelsinkiDateStr();
            if (localStorage.getItem('prayer_date') && localStorage.getItem('prayer_date') !== currentHelsinkiDate) {
                clearInterval(countdownInterval);
                fetchPrayerTimes();  // Re-fetch for new day
                return;
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
                // If we've passed Isha, current is Isha, next is Fajr tomorrow
                currentPrayerIndex = PRAYERS.length - 1; // Isha
                nextPrayerIndex = 0; // Tomorrow's Fajr
                crossesMidnight = true;
            } else if (nextPrayerIndex === 0) {
                // If we are before Fajr today, current is Isha yesterday, next is Fajr today
                currentPrayerIndex = PRAYERS.length - 1;
            } else {
                currentPrayerIndex = nextPrayerIndex - 1;
            }

            const nextPrayer = PRAYERS[nextPrayerIndex];
            const currentPrayer = PRAYERS[currentPrayerIndex];

            const nTime = parseTimeStr(timings[nextPrayer]);
            let nTotalSeconds = (nTime.h * 3600) + (nTime.m * 60);

            if (crossesMidnight) {
                // Crosses midnight, add 24 hours to next prayer
                nTotalSeconds += 24 * 3600;
            }
            minDiff = nTotalSeconds - currentTotalSeconds;

            // Highlight Row - User requested "soft color yellow" as a "slide bar" for the CURRENT prayer
            PRAYERS.forEach(p => {
                const r = document.getElementById(`row-${p}`);
                if (r) {
                    if (p === currentPrayer) {
                        r.style.backgroundColor = "#FFFDE7"; // Soft yellow
                        r.style.borderLeft = "6px solid #FBC02D"; // Slightly stronger yellow sidebar
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
                countdownEl.textContent = `-${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            }

        }, 1000);
    }

    // Initialize
    fetchPrayerTimes();

    window.addEventListener('beforeunload', () => {
        if (countdownInterval) clearInterval(countdownInterval);
    });
});
