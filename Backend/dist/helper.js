"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeGroups = mergeGroups;
const CMUDict = require('cmudict').CMUDict;
/* -----   CMU dictionary (once per process)   --------------------------- */
const dict = new CMUDict();
/**
 * Helper: strip punctuation & apostrophes, upper-case for dict lookup.
 */
const sanitize = (word) => word.replace(/[^A-Za-z]/g, "").toUpperCase();
/**
 * Return pronunciation tail from the last primary-stressed vowel onward.
 * e.g.  "ROTATION"   -> "EY1 SH AH0 N"
 *       "SURVIVIN"   -> "AY1 V IH0 N"
 */
function rhymeTail(word) {
    const entry = dict[sanitize(word)]?.[0]; // take first pronunciation
    if (!entry)
        return null;
    const phones = entry.split(" ");
    for (let i = phones.length - 1; i >= 0; i--) {
        if (/1/.test(phones[i])) // primary stress digit "1"
            return phones.slice(i).join(" ");
    }
    return null; // shouldn’t happen, but be safe
}
/* ----------------------------------------------------------------------- *
 * mergeGroups                                                             *
 *   Ensures every token with the same rhyme tail shares one unique colour *
 * ----------------------------------------------------------------------- */
function mergeGroups(data) {
    const tailColor = new Map(); // tail → hex
    // ---------- 1st pass: establish canonical colour for each tail --------
    for (const verse of Object.values(data))
        for (const line of verse)
            for (const seg of line) {
                if (!seg.color)
                    continue;
                const tail = rhymeTail(seg.text);
                if (tail && !tailColor.has(tail))
                    tailColor.set(tail, seg.color);
            }
    // ---------- 2nd pass: repaint missing / conflicting tokens ------------
    for (const verse of Object.values(data))
        for (const line of verse)
            for (const seg of line) {
                const tail = rhymeTail(seg.text);
                if (!tail)
                    continue;
                const canonical = tailColor.get(tail);
                if (canonical)
                    seg.color = canonical;
            }
    return data;
}
//# sourceMappingURL=helper.js.map