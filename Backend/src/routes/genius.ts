import { Router, Request, Response } from "express";
import { GetSongById, SearchSongs } from "../../geniusapi";
import { GetSongOptions, LyricSongData, SongSearchResult, LyricsData, AnalysedVerse } from "../../../common/interfaces";
import OpenAI from "openai";
import { ChatCompletion, ChatCompletionChunk } from "openai/resources/chat";
import { mergeGroups } from "../../helper";
import pool from "../db";

const router = Router();
require('dotenv').config();

const buildPrompt = (lyrics: string): OpenAI.Chat.ChatCompletionCreateParams => {
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
      "sections": [
        {
          "section": "The name of the section (e.g., [Verse 1], [Chorus])",
          "lines": [
            [ { "text": "Word", "color": "#AABBCC" }, ... ],
            ...
          ]
        }
      ]
    }\n
    
    A Segment MUST be one contiguous token (word or punctuation). Tokens that
    don't belong to any rhyme group have "color": null.`;

    const userMsg = `Lyrics to process:\n${lyrics}`;

    return {
        model: "gpt-4.1",
        temperature: 1,
        stream: true,
        response_format: { type: "json_object" },
        messages: [
            { role: "system", content: systemMsg },
            { role: "user", content: userMsg }
        ]
    } as const;
};

async function highlightLyrics(lyrics: string, res: Response): Promise<LyricsData> {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    const params = buildPrompt(lyrics);

    try {
        const stream = await openai.chat.completions.create(params) as AsyncIterable<ChatCompletionChunk>;

        let accumulatedContent = '';

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                accumulatedContent += content;
                try {
                    // Try to parse the accumulated content as JSON
                    const parsed = JSON.parse(accumulatedContent) as LyricsData;
                    // If successful, send it to the client
                    res.write(`data: ${JSON.stringify({ type: 'analysis', data: { analysedLyrics: parsed } })}\n\n`);

                    return parsed;
                } catch (e) {
                    // If parsing fails, continue accumulating
                    continue;
                }
            }
        }

        // Send a final message to indicate completion
        res.write('data: [DONE]\n\n');

        // After the loop, if we haven't returned, it means the stream ended
        // without a complete JSON object.
        throw new Error("Invalid JSON response from OpenAI");
    } catch (err) {
        console.error("Error in streaming response:", err);
        res.write(`data: ${JSON.stringify({ error: "Error processing lyrics" })}\n\n`);
        res.write('data: [DONE]\n\n');
        throw err;
    }
}

router.get('/search/:songName', async function (req, res) {
    // In future search the database first 

    const options: GetSongOptions = {
        title: req.params.songName,
        optimiseQuery: true
    };

    const songQuery: SongSearchResult[] | null = await SearchSongs(options);

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
        const dbResult = await pool.query(
            'SELECT * FROM songs WHERE id = $1',
            [req.params.songId]
        );

        if (dbResult.rows.length > 0) {
            console.log("Song exists in database");
            await pool.query(
                'UPDATE songs SET visits = visits + 1 WHERE id = $1',
                [req.params.songId]
            );
            // Song exists in database, send basic data immediately
            const songData = dbResult.rows[0];
            const data: LyricSongData = {
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

            res.write(`data: ${JSON.stringify({ type: 'analysis', data })}\n\n`);

            res.write('data: [DONE]\n\n');
            return;
        }

        console.log("Song not in database, fetching from Genius");
        // Song not in database, fetch from Genius
        const geniusResponse: LyricSongData = await GetSongById(req.params.songId);

        // Send basic data immediately
        const basicData: LyricSongData = {
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
        await pool.query(
            `INSERT INTO songs (
                id, lyrics, full_title, title, release_date, 
                song_art, artists, all_artists, analysed_lyrics
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [
                geniusResponse.id,
                geniusResponse.lyrics,
                geniusResponse.fullTitle,
                geniusResponse.title,
                geniusResponse.releaseDate,
                geniusResponse.songArt,
                geniusResponse.artists,
                geniusResponse.allArtists,
                JSON.stringify(analysedLyrics)
            ]
        );

    } catch (error) {
        console.error('Error in getlyrics endpoint:', error);
        res.write(`data: ${JSON.stringify({ error: 'Internal server error' })}\n\n`);
        res.write('data: [DONE]\n\n');
    }
});

router.get('/getMostVisited', async function (req, res) {
    const dbResult = await pool.query(
        'SELECT * FROM songs ORDER BY visits DESC LIMIT 5'
    );
    res.json(dbResult.rows);
});

export default router