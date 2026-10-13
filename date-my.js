// Semua paparan dan masa baharu menggunakan waktu Malaysia, UTC+8.
'use strict';
const MALAYSIA_TIME_ZONE = 'Asia/Kuala_Lumpur';
const malaysiaFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: MALAYSIA_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
});

function validCalendarDate(year, month, day) {
    const d = new Date(Date.UTC(year, month - 1, day));
    return year >= 1000 && year <= 9999 && d.getUTCFullYear() === year &&
        d.getUTCMonth() === month - 1 && d.getUTCDate() === day;
}

function parseMalaysiaDate(value) {
    if (value === null || value === undefined || value === '') return null;
    if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
    if (typeof value === 'number') {
        const d = new Date(value);
        return Number.isNaN(d.getTime()) ? null : d;
    }
    const raw = String(value).trim();
    let m = raw.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
    if (m) {
        if (!validCalendarDate(+m[1], +m[2], +m[3])) return null;
        return new Date(`${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}T00:00:00+08:00`);
    }
    // Rekod lama dalam format DD/MM/YYYY, dengan masa pilihan.
    m = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
    if (m) {
        if (!validCalendarDate(+m[3], +m[2], +m[1]) || +(m[4] || 0) > 23 ||
            +(m[5] || 0) > 59 || +(m[6] || 0) > 59) return null;
        return new Date(`${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}T${(m[4] || '00').padStart(2, '0')}:${m[5] || '00'}:${m[6] || '00'}+08:00`);
    }
    // ISO daripada Apps Script: hormati offset asal dan tukar kepada waktu Malaysia.
    m = raw.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?)(Z|[+-]\d{2}:?\d{2})?$/i);
    if (m) {
        if (!validCalendarDate(+m[1], +m[2], +m[3])) return null;
        const zone = m[5] ? m[5].toUpperCase() : '+08:00';
        const d = new Date(`${m[1]}-${m[2]}-${m[3]}T${m[4]}${zone}`);
        return Number.isNaN(d.getTime()) ? null : d;
    }
    // Contoh: Tue Oct 13 2026 00:00:00 GMT+0800 (Singapore Standard Time).
    // Parse offset GMT yang jelas; nama zon tidak pernah dipaparkan kepada murid.
    const cleaned = raw.replace(/\s*\([^)]*\)/g, '').trim();
    if (!/(?:GMT|UTC)(?:[+-]\d{4})?/i.test(cleaned)) return null;
    const d = new Date(cleaned);
    return Number.isNaN(d.getTime()) ? null : d;
}

function malaysiaDateParts(value) {
    const d = parseMalaysiaDate(value);
    if (!d) return null;
    return Object.fromEntries(malaysiaFormatter.formatToParts(d).map(p => [p.type, p.value]));
}

function malaysiaDateKey(value) {
    const p = malaysiaDateParts(value);
    return p ? `${p.year}-${p.month}-${p.day}` : '';
}

function formatDateMY(value) {
    const p = malaysiaDateParts(value);
    return p ? `${p.day}/${p.month}/${p.year}` : '-';
}

function formatDateTimeMY(value) {
    const p = malaysiaDateParts(value);
    return p ? `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute}` : '-';
}

function malaysiaTimestamp(value = new Date()) {
    const p = malaysiaDateParts(value);
    return p ? `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}` : '';
}
