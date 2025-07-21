"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const geniusapi_1 = require("../../geniusapi");
const openai_1 = __importDefault(require("openai"));
const db_1 = __importDefault(require("../db"));
const router = (0, express_1.Router)();
require('dotenv').config();
const buildPrompt = (lyrics) => {
    const systemMsg = `You are an expert lyric analyst specializing in rhyme detection. Your task is to convert lyrics to phonetics, detect EVERY rhyme, and return JSON for word-level highlighting.\n

CRITICAL RULES FOR RHYME DETECTION:\n
• A rhyme occurs when words share the same sound from the last stressed vowel to the end of the word\n
• Treat "-ing" and its colloquial forms ("-in', -in, -in'") as the same sound\n
• Strip plural / possessive endings (-s, -z) ONLY when they don't affect the stressed vowel\n
• Ignore differences caused by punctuation or capitalization\n
• Each different rhyme MUST have a unique color\n
• Make sure to use DISTINCT colors for each rhyme\n
• Be EXTREMELY thorough - don't miss any rhymes\n
• Common rhyme patterns to look for:\n
  - Perfect rhymes (e.g., "cat/hat", "light/night")\n
  - Slant rhymes (e.g., "love/move", "time/mind")\n
  - Internal rhymes within lines\n
  - Multi-syllable rhymes (e.g., "happily/snappily")\n

PROCESSING INSTRUCTIONS:\n
1. Use standard American English phonemes (CMU style) with the above normalizations\n
2. Process verse-by-verse (never match across verses)\n
3. For each word, identify the rhyme part (from last stressed vowel to end)\n
4. Group ALL words with identical rhyme parts and assign a unique HEX color\n
5. Be exhaustive - words like "drivin', survivin', hidin', excitin'" MUST share a color\n
6. Double-check your work to ensure no rhymes are missed\n

Output EXACTLY this JSON shape (no markdown, no commentary):\n
{
  "[Verse …]": [
    [ { "text": "Word", "color": "#AABBCC" }, … ],   ← line = Segment[]
    …
  ],
  …
}\n

A Segment MUST be one contiguous token (word or punctuation). Tokens that
don't belong to any rhyme group have "color": null.`;
    const userMsg = `Lyrics to process:\n${lyrics}`;
    return {
        model: "gpt-4.1",
        temperature: 0.1,
        stream: true,
        response_format: { type: "json_object" },
        messages: [
            { role: "system", content: systemMsg },
            { role: "user", content: userMsg }
        ]
    };
};
async function highlightLyrics(lyrics, res) {
    const openai = new openai_1.default({
        apiKey: process.env.OPENAI_API_KEY
    });
    const params = buildPrompt(lyrics);
    try {
        const stream = await openai.chat.completions.create(params);
        let accumulatedContent = '';
        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                accumulatedContent += content;
                try {
                    // Try to parse the accumulated content as JSON
                    const parsed = JSON.parse(accumulatedContent);
                    // If successful, send it to the client
                    res.write(`data: ${JSON.stringify({ type: 'analysis', data: parsed })}\n\n`);
                    return parsed;
                }
                catch (e) {
                    // If parsing fails, continue accumulating
                    continue;
                }
            }
        }
        // Send a final message to indicate completion
        res.write('data: [DONE]\n\n');
    }
    catch (err) {
        console.error("Error in streaming response:", err);
        res.write(`data: ${JSON.stringify({ error: "Error processing lyrics" })}\n\n`);
        res.write('data: [DONE]\n\n');
    }
}
router.get('/search/:songName', async function (req, res) {
    // In future search the database first 
    const options = {
        title: req.params.songName,
        optimiseQuery: true
    };
    const songQuery = await (0, geniusapi_1.SearchSongs)(options);
    res.json(songQuery);
});
router.get('/getlyrics/:songId', async function (req, res) {
    try {
        // Set headers for SSE
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        // First, check if the song exists in the database
        console.log("Checking if song exists in database");
        const dbResult = await db_1.default.query('SELECT * FROM songs WHERE id = $1', [req.params.songId]);
        if (dbResult.rows.length > 0) {
            console.log("Song exists in database");
            await db_1.default.query('UPDATE songs SET visits = visits + 1 WHERE id = $1', [req.params.songId]);
            // Song exists in database, send basic data immediately
            const songData = dbResult.rows[0];
            const data = {
                id: songData.id,
                lyrics: songData.lyrics,
                fullTitle: songData.full_title,
                title: songData.title,
                releaseDate: songData.release_date,
                songArt: songData.song_art,
                artists: songData.artists,
                allArtists: songData.all_artists,
                analysedLyrics: songData.analysed_lyrics
            };
            res.write(`data: ${JSON.stringify({ type: 'analysis', data: data })}\n\n`);
            res.write('data: [DONE]\n\n');
            return;
        }
        console.log("Song not in database, fetching from Genius");
        // Song not in database, fetch from Genius
        const geniusResponse = await (0, geniusapi_1.GetSongById)(req.params.songId);
        // Send basic data immediately
        const basicData = {
            id: geniusResponse.id,
            lyrics: geniusResponse.lyrics,
            fullTitle: geniusResponse.fullTitle,
            title: geniusResponse.title,
            releaseDate: geniusResponse.releaseDate,
            songArt: geniusResponse.songArt,
            artists: geniusResponse.artists,
            allArtists: geniusResponse.allArtists
        };
        res.write(`data: ${JSON.stringify({ type: 'basic', data: basicData })}\n\n`);
        // Start streaming the analysis
        const analysedLyrics = await highlightLyrics(geniusResponse.lyrics, res);
        // Save to database after analysis is complete
        console.log("Saving to database");
        await db_1.default.query(`INSERT INTO songs (
                id, lyrics, full_title, title, release_date, 
                song_art, artists, all_artists, analysed_lyrics
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, [
            geniusResponse.id,
            geniusResponse.lyrics,
            geniusResponse.fullTitle,
            geniusResponse.title,
            geniusResponse.releaseDate,
            geniusResponse.songArt,
            geniusResponse.artists,
            geniusResponse.allArtists,
            analysedLyrics
        ]);
    }
    catch (error) {
        console.error('Error in getlyrics endpoint:', error);
        res.write(`data: ${JSON.stringify({ error: 'Internal server error' })}\n\n`);
        res.write('data: [DONE]\n\n');
    }
});
router.get('/getMostVisited', async function (req, res) {
    const dbResult = await db_1.default.query('SELECT * FROM songs ORDER BY visits DESC LIMIT 5');
    res.json(dbResult.rows);
});
exports.default = router;
//# sourceMappingURL=genius.js.map