import { useEffect, useState } from "react";
import "../styling/SongPage.css";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { LyricHighlighter } from "../components/LyricHighlighter";
import { LyricSongData } from "../interfaces/interfaces";

const serverUrl = import.meta.env.VITE_API_URL;;

export const SongPage = () => {

    const [loading, setLoading] = useState(true)
    const [song, setSong] = useState<LyricSongData | undefined>(undefined);

    const { songId } = useParams()

    const requestUrl = `${serverUrl}/genius/getlyrics/${songId}`

    useEffect(() => {
        console.log("getting song lyrics and higlights")
        axios.get(requestUrl)
            .then((res) => {
                setSong(res.data as LyricSongData);
                console.log(res.data)
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
            <div className="lyrics-container">
                <LyricHighlighter data={song.analysedLyrics || {}} />
            </div>
        </div>
    );
};
