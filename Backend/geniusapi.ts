import { GetSongOptions, SongSearchResult, LyricSongData } from "../common/interfaces";

const axios = require('axios');
require('dotenv').config();
const cheerio = require('cheerio-without-node-native');
const searchUrl = 'https://api.genius.com';
const geniusApiKey = process.env.GENIUS_API_KEY;

/**
 * Check the GetSongOptions interface.
 * @param options The song search options.
 */
function checkOptions(options: GetSongOptions) {
    if (!options.title)
        throw '"title" property is missing from options';
};

/** 
 * Formates the title to a more usable format.
 * @param title - The title of the song.
 * @param artist - The name of the artist.
 */
function getTitle(title: string) {
    return `${title}`
        .toLowerCase()
        .replace(/ *\([^)]*\) */g, '')
        .replace(/ *\[[^\]]*]/, '')
        .replace(/feat.|ft./g, '')
        .replace(/\s+/g, ' ')
        .trim();
};

async function extractLyrics(url: string) {
    let urlToUse = url;

    if (process.env.ENVIRONMENT === 'production') {
        const scraper_url = process.env.SCRAPER_URL;
        const scraper_api_key = process.env.SCRAPER_API_KEY;
        urlToUse = `${scraper_url}/?api_key=${scraper_api_key}&url=${encodeURI(url)}`;
    }
    else {
        urlToUse = url;
    }

    try {
        let { data } = await axios.get(urlToUse);
        const $ = cheerio.load(data);
        let lyrics = $('div[class="lyrics"]').text().trim();
        if (!lyrics) {
            lyrics = '';
            $('div[class^="Lyrics__Container"]').each((i: any, elem: any) => {
                if ($(elem).text().length !== 0) {
                    let snippet = $(elem)
                        .html()
                        .replace(/<br>/g, '\n')
                        .replace(/<(?!\s*br\s*\/?)[^>]+>/gi, '');
                    lyrics += $('<textarea/>').html(snippet).text().trim();
                }
            });
        }
        if (!lyrics) return null;

        // Remove uneeded words at the start of the lyrics string.
        const firstBracketIndex = lyrics.indexOf('[');
        if (firstBracketIndex !== -1) {
            lyrics = lyrics.substring(firstBracketIndex);
        } else {
            console.log("No formatting requried.");
        }

        return lyrics.trim();
    } catch (e) {
        throw e;
    }
};

/**
 * Returns a list of songs based on the search song options.
 * @param options - The search song options.
 * @returns A list of objects containing the songs.
 */
export async function SearchSongs(options: GetSongOptions) {
    try {
        checkOptions(options);

        const song = options.optimiseQuery ? getTitle(options.title) : `${options.title}`;
        const reqUrl = `${searchUrl}/search?q=${encodeURIComponent(song)}`;
        const headers = {
            Authorization: 'Bearer ' + geniusApiKey
        };
        let { data } = await axios.get(
            options.authHeader ? reqUrl : `${reqUrl}&access_token=${geniusApiKey}`,
            options.authHeader && { headers }
        );

        if (data.response.hits.length === 0) return null;

        const results: SongSearchResult[] = data.response.hits.map((val: any): SongSearchResult => {
            return {
                id: val.result.id.toString(),
                title: val.result.title,
                albumArt: val.result.song_art_image_url,
                geniusUrl: val.result.url,
                artistsNames: val.result.artist_names
            };
        });

        return results;
    }
    catch (e) {
        throw e;
    }
};

/**
 * Gets the song lyrics and metadata from the id.
 * @param id - The song id.
 * @param apiKey - The genius API key.
 * @returns 
 */
export async function GetSongById(id: string) {
    if (!id) throw 'No id was provided';
    try {
        let {
            data: {
                response: { song }
            }
        } = await axios.get(`${searchUrl}/songs/${id}?access_token=${geniusApiKey}`);
        let lyrics = await extractLyrics(song.url);

        const featuredArtists: string[] = [];

        const result: LyricSongData = {
            id: song.id,
            lyrics: lyrics,
            fullTitle: song.full_title,
            title: song.title,
            releaseDate: song.release_date_for_display,
            songArt: song.song_art_image_url,
            artists: song.primary_artist_names,
            allArtists: featuredArtists
        }

        return result;
    } catch (e) {
        throw e;
    }
};

