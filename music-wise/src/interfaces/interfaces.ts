export interface SongSearchResult {
    id: string;
    title: string;
    albumArt: string;
    geniusUrl: string;
    artistsNames: string;
}

export interface Segment {
    text: string;
    color: string | null;
}

export interface LyricSongData {
    id: string;
    lyrics: string;
    fullTitle: string;
    title: string;
    releaseDate: string;
    songArt: string;
    artists: string;
    allArtists?: string[];
    analysedLyrics?: LyricsData;
}

export interface Segment {
    text: string;
    color: string | null;
}

export interface SpotifyAccessToken {
    access_token: string;
    created_at: string | Date;
}

export type Line = Segment[];
export type Verse = Line[];
export type LyricsData = Record<string, Verse>;