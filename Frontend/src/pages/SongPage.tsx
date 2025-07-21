import { useEffect, useState } from "react";
import "../styling/SongPage.css";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { LyricHighlighter } from "../components/LyricHighlighter";
import { LyricSongData, SpotifyAccessToken, Line, AnalysedVerse } from "../../../common/interfaces";
import { SpotifyPlayer } from "../components/SpotifyPlayer";

const mergeVerses = (prev: AnalysedVerse[], incoming: AnalysedVerse[]): AnalysedVerse[] => {
    const result = [...prev];
    incoming.forEach((verse, idx) => {
        if (!result[idx]) {
            result[idx] = { section: verse.section, lines: [] };
        }
        const existingLines = result[idx].lines.length;
        const newLines = verse.lines.slice(existingLines);
        if (newLines.length > 0) {
            result[idx] = {
                section: verse.section,
                lines: [...result[idx].lines, ...newLines],
            };
        }
    });
    return result;
};

const serverUrl = import.meta.env.VITE_API_URL;

export const SongPage = () => {
    const [loading, setLoading] = useState(true);
    const [song, setSong] = useState<LyricSongData | undefined>(undefined);
    const [isAnalyzing, setIsAnalyzing] = useState(true);
    const [visibleVerses, setVisibleVerses] = useState<AnalysedVerse[]>([]);

    const { songId } = useParams();
    const [token, setToken] = useState<SpotifyAccessToken | null>(null);

    useEffect(() => {
        async function getToken() {
            const response = await axios.get(`${serverUrl}/spotify/getAccessToken`);
            setToken(response.data.access_token as SpotifyAccessToken);
        }
        getToken();
    }, []);


    useEffect(() => {
        const eventSource = new EventSource(`${serverUrl}/genius/getlyrics/${songId}`);

        eventSource.onmessage = (event) => {
            if (event.data === '[DONE]') {
                eventSource.close();
                return;
            }

            try {
                const data = JSON.parse(event.data);

                if (data.type === 'basic') {
                    setSong(data.data);
                    setVisibleVerses([]);
                    setLoading(false);
                } else if (data.type === 'analysis') {
                    const receivedData = data.data as Partial<LyricSongData>;

                    // This is a migration step to handle the old data format.
                    if (receivedData.analysedLyrics && !Array.isArray(receivedData.analysedLyrics.sections)) {
                        receivedData.analysedLyrics = {
                            sections: Object.entries(receivedData.analysedLyrics.sections).map(([section, lines]) => ({
                                section,
                                lines: lines as Line[]
                            }))
                        };
                    }

                    setSong(prevSong => {
                        if (!prevSong) {
                            return receivedData as LyricSongData;
                        }
                        return {
                            ...prevSong,
                            ...(receivedData as Partial<LyricSongData>),
                        };
                    });

                    if (receivedData.analysedLyrics) {
                        setVisibleVerses(prev => mergeVerses(prev, receivedData.analysedLyrics!.sections));
                    }

                    setIsAnalyzing(false);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error parsing SSE data:', error);
            }
        };

        eventSource.onerror = (error) => {
            console.error('EventSource error:', error);
            eventSource.close();
            setLoading(false);
        };

        return () => {
            eventSource.close();
        };
    }, []);

    if (loading || !song) {
        return (
            <div className="loading-screen">
                <div className="loader">
                    <span className="stroke"></span>
                    <span className="stroke"></span>
                    <span className="stroke"></span>
                    <span className="stroke"></span>
                    <span className="stroke"></span>
                    <span className="stroke"></span>
                    <span className="stroke"></span>
                </div>
                <div className="loader-text">
                    <p>Loading song...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="song-page-container">
            <div className="sidebar-container">
                <div className="song-info">
                    <div className="song-art-container">
                        <img src={song.songArt} alt={`${song.title} cover art`} className="song-art" />
                    </div>
                    <div className="song-details">
                        <h1 className="song-title">{song.title}</h1>
                        <h2 className="song-artists">{song.allArtists?.length !== 0 ? song.allArtists : song.artists}</h2>
                        <div className="song-metadata">
                            <p className="release-date">Released: {song.releaseDate}</p>
                        </div>
                    </div>
                </div>
                {token && (
                    <div className="spotify-player-container">
                        <SpotifyPlayer song={song} token={token} />
                    </div>
                )}
            </div>
            <div className="lyrics-container">
                {isAnalyzing ? (
                    <div className="analyzing-indicator">
                        <p>Analyzing rhymes...</p>
                    </div>
                ) : null}
                <LyricHighlighter 
                    data={{ sections: visibleVerses }}
                    plainLyrics={song.lyrics}
                    isAnalyzing={isAnalyzing}
                />
            </div>
        </div>
    );
};