
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

export type Line = Segment[];

export interface AnalysedVerse {
    lines: Line[];
    section: string;
}

export interface LyricsData {
    sections: AnalysedVerse[];
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

export interface SpotifyAccessToken {
    access_token: string;
    created_at: string | Date;
}

export interface GetSongOptions {
    title: string;
    optimiseQuery?: boolean;
    authHeader?: boolean;
} 