import { useEffect, useState } from "react";
import "../styling/SongPage.css";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { LyricHighlighter } from "../components/LyricHighlighter";
import { LyricSongData, SpotifyAccessToken } from "../interfaces/interfaces";
import { SpotifyPlayer } from "../components/SpotifyPlayer";
const serverUrl = import.meta.env.VITE_API_URL;

export const SongPage = () => {

    const [loading, setLoading] = useState(true)
    const [song, setSong] = useState<LyricSongData | undefined>(undefined);

    const { songId } = useParams()

    const [token, setToken] = useState<SpotifyAccessToken | null>(null);

    useEffect(() => {
        async function getToken() {
            const response = await axios.get(`${serverUrl}/spotify/getAccessToken`);
            setToken(response.data.access_token as SpotifyAccessToken);
        }

        getToken();

    }, []);

    const requestUrl = `${serverUrl}/genius/getlyrics/${songId}`

    useEffect(() => {
        axios.get(requestUrl)
            .then((res) => {
                setSong(res.data as LyricSongData);
                setLoading(false)
            })
            .catch((errorMessage) => {
                setLoading(false)
                console.log(errorMessage);
            })
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
                    <p>Highlighting Ryhmes...</p>
                </div>
            </div>
        )
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
                <LyricHighlighter data={song.analysedLyrics || {}} />
            </div>
        </div>
    );
};
