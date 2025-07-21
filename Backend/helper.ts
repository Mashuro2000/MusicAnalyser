import { LyricsData } from "./interfaces";
const CMUDict = require('cmudict').CMUDict;

/* -----   CMU dictionary (once per process)   --------------------------- */
const dict: Record<string, string[]> = new CMUDict()

/**
 * Helper: strip punctuation & apostrophes, upper-case for dict lookup.
 */
const sanitize = (word: string) =>
  word.replace(/[^A-Za-z]/g, "").toUpperCase();

/**
 * Return pronunciation tail from the last primary-stressed vowel onward.
 * e.g.  "ROTATION"   -> "EY1 SH AH0 N"
 *       "SURVIVIN"   -> "AY1 V IH0 N"
 */
function rhymeTail(word: string): string | null {
  const entry = dict[sanitize(word)]?.[0];  // take first pronunciation
  if (!entry) return null;

  const phones = entry.split(" ");
  for (let i = phones.length - 1; i >= 0; i--) {
    if (/1/.test(phones[i]))        // primary stress digit "1"
      return phones.slice(i).join(" ");
  }
  return null;                      // shouldn't happen, but be safe
}

/* ----------------------------------------------------------------------- *
 * mergeGroups                                                             *
 *   Ensures every token with the same rhyme tail shares one unique colour *
 * ----------------------------------------------------------------------- */
export function mergeGroups(data: LyricsData): LyricsData {
  const tailColor = new Map<string, string>();          // tail → hex

  // ---------- 1st pass: establish canonical colour for each tail --------
  for (const verse of data)
    for (const line of verse.lines)
      for (const seg of line) {
        if (!seg.color) continue;
        const tail = rhymeTail(seg.text);
        if (tail && !tailColor.has(tail))
          tailColor.set(tail, seg.color);
      }

  // ---------- 2nd pass: repaint missing / conflicting tokens ------------
  for (const verse of data)
    for (const line of verse.lines)
      for (const seg of line) {
        const tail = rhymeTail(seg.text);
        if (!tail) continue;

        const canonical = tailColor.get(tail);
        if (canonical) seg.color = canonical;
      }

  return data;
}
