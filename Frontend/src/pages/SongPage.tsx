import { useEffect, useState } from "react";
import "../styling/SongPage.css";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { LyricHighlighter } from "../components/LyricHighlighter";
import { LyricSongData, SpotifyAccessToken, Line, AnalysedVerse } from "../../../common/interfaces";
import { SpotifyPlayer } from "../components/SpotifyPlayer";

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
        if (!song?.analysedLyrics?.sections) {
            setVisibleVerses([]);
            return;
        }

        const allLines: { verseIndex: number; line: Line }[] = [];
        song.analysedLyrics.sections.forEach((verse, verseIndex) => {
            verse.lines.forEach(line => {
                allLines.push({ verseIndex, line });
            });
        });

        const initialVerses = song.analysedLyrics.sections.map(v => ({
            ...v,
            lines: [],
        }));
        setVisibleVerses(initialVerses);

        let lineIndex = 0;
        const intervalId = setInterval(() => {
            if (lineIndex >= allLines.length) {
                clearInterval(intervalId);
                return;
            }

            const { verseIndex, line } = allLines[lineIndex];
            setVisibleVerses(prev => {
                const newVerses = [...prev];
                newVerses[verseIndex] = {
                    ...newVerses[verseIndex],
                    lines: [...newVerses[verseIndex].lines, line],
                };
                return newVerses;
            });

            lineIndex++;
        }, 100); // Adjust delay as needed

        return () => clearInterval(intervalId);

    }, [song?.analysedLyrics]);

    useEffect(() => {
        const eventSource = new EventSource(`${serverUrl}/genius/getlyrics/${songId}`);

        eventSource.onmessage = (event) => {
            console.log(event.data);
            if (event.data === '[DONE]') {
                eventSource.close();
                setLoading(false);
                return;
            }

            try {
                const data = JSON.parse(event.data);
                console.log(data);
                
                if (data.type === 'basic') {
                    setSong(data.data);
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
                            analysedLyrics: receivedData.analysedLyrics,
                        };
                    });

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