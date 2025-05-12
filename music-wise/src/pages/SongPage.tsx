import { useEffect, useState } from "react";
import "../styling/SongPage.css";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { LyricHighlighter } from "../components/LyricHighlighter";
import { LyricSongData, SpotifyAccessToken } from "../interfaces/interfaces";
import { SpotifyPlayer } from "../components/SpotifyPlayer";
const serverUrl = import.meta.env.VITE_API_URL;

export const SongPage = () => {
    const [loading, setLoading] = useState(true);
    const [song, setSong] = useState<LyricSongData | undefined>(undefined);
    const [analysedLyrics, setAnalysedLyrics] = useState<any>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(true);

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
                    // If we receive analysis data and don't have song data yet,
                    // it means this is a direct database response
                    if (!song) {
                        setSong({
                            id: data.data.id,
                            lyrics: data.data.lyrics,
                            fullTitle: data.data.fullTitle,
                            title: data.data.title,
                            releaseDate: data.data.releaseDate,
                            songArt: data.data.songArt,
                            artists: data.data.artists,
                            allArtists: data.data.allArtists
                        });
                    }
                    setAnalysedLyrics(data.data.analysedLyrics || data.data);
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
    }, [songId, song]);

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
                    data={analysedLyrics || {}} 
                    plainLyrics={song.lyrics}
                    isAnalyzing={isAnalyzing}
                />
            </div>
        </div>
    );
};
