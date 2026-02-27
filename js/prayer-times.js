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

    // Cache key for today's date
    const todayStr = new Date().toISOString().split('T')[0];
    const cacheKey = `prayer_times_${config.city}_${todayStr}`;

    async function fetchPrayerTimes() {
        // Check cache first
        const cache = localStorage.getItem(cacheKey);
        if (cache) {
            try {
                const data = JSON.parse(cache);
                processPrayerData(data);
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
                processPrayerData(payload.data);
            }
        } catch (error) {
            console.error("Failed to fetch prayer times:", error);
            if (tableContainer) tableContainer.innerHTML = '<p class="text-center">Could not load prayer times. Please try again later.</p>';
        }
    }

    function processPrayerData(data) {
        const timings = data.timings;
        const dateInfo = data.date;

        // Display Dates
        if (hijriDateEl) {
            hijriDateEl.textContent = `${dateInfo.hijri.day} ${dateInfo.hijri.month.en} ${dateInfo.hijri.year} AH`;
        }
        if (gregorianDateEl) {
            gregorianDateEl.textContent = `${dateInfo.gregorian.day} ${dateInfo.gregorian.month.en} ${dateInfo.gregorian.year}`;
        }

        renderTable(timings);
        startCountdownTracker(timings);
    }

    function renderTable(timings) {
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

        PRAYERS.forEach(prayer => {
            // Note: Sunrise has no Iqamah
            let time = timings[prayer];

            // Format time: add slightly offset iqamah +15/+20 mins (mocking unless real schedule provided)
            let iqamahDisplay = '-';
            if (prayer !== 'Sunrise') {
                const parts = time.split(':');
                let h = parseInt(parts[0], 10);
                let m = parseInt(parts[1], 10) + (prayer === 'Maghrib' ? 5 : 20); // Maghrib usually +5, others +20
                if (m >= 60) {
                    m -= 60;
                    h += 1;
                }
                if (h === 24) h = 0;
                iqamahDisplay = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
            }

            // On Fridays, replace Dhuhr with Jumu'ah logic
            let prayerNameEn = prayer;
            let prayerNameAr = arabicNames[prayer];

            if (isFriday && prayer === 'Dhuhr') {
                prayerNameEn = "Jumu'ah";
                prayerNameAr = "الجمعة";
                // Fixed generic Jumuah time for Finland usually around 13:00 / 14:00 depending on DST
                iqamahDisplay = "See Schedule";
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
            * Iqamah times are approximate. Please confirm with the Masjid for exact times.
        </p>`;
        tableContainer.innerHTML = html;
    }

    let countdownInterval = null;

    function startCountdownTracker(timings) {
        if (countdownInterval) clearInterval(countdownInterval);

        countdownInterval = setInterval(() => {
            const now = new Date();

            // Auto-reset if day has changed
            const todayStr = now.toISOString().split('T')[0];
            if (localStorage.getItem('prayer_date') && localStorage.getItem('prayer_date') !== todayStr) {
                clearInterval(countdownInterval);
                fetchPrayerTimes();  // Re-fetch for new day
                return;
            }
            localStorage.setItem('prayer_date', todayStr);

            const currentHours = now.getHours();
            const currentMinutes = now.getMinutes();
            const currentSeconds = now.getSeconds();
            const currentTotalSeconds = (currentHours * 3600) + (currentMinutes * 60) + currentSeconds;

            let nextPrayer = null;
            let minDiff = Infinity;

            PRAYERS.forEach(prayer => {
                const timeStrs = timings[prayer].split(':');
                const tH = parseInt(timeStrs[0], 10);
                const tM = parseInt(timeStrs[1], 10);
                const tTotalSeconds = (tH * 3600) + (tM * 60);

                // Assuming prayer is today and hasn't happened yet
                if (tTotalSeconds > currentTotalSeconds) {
                    const diff = tTotalSeconds - currentTotalSeconds;
                    if (diff < minDiff) {
                        minDiff = diff;
                        nextPrayer = prayer;
                    }
                }
            });

            // If no next prayer today, Next is tomorrow's Fajr
            if (!nextPrayer) {
                nextPrayer = 'Fajr';
                const fTimeStrs = timings['Fajr'].split(':');
                const fH = parseInt(fTimeStrs[0], 10);
                const fM = parseInt(fTimeStrs[1], 10);
                const fTotalSeconds = (fH * 3600) + (fM * 60);
                minDiff = ((24 * 3600) - currentTotalSeconds) + fTotalSeconds;
            }

            // Highlight Row
            PRAYERS.forEach(p => {
                const r = document.getElementById(`row-${p}`);
                if (r) {
                    if (p === nextPrayer) {
                        r.style.backgroundColor = "rgba(212, 175, 55, 0.1)"; // Gold highlight
                        r.style.borderLeft = "4px solid var(--color-secondary)";
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
