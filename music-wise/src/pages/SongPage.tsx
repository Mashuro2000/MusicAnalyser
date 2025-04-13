import { useEffect, useState } from "react";
import "../styling/SongPage.css";
import axios from "axios";
import { useParams } from 'react-router-dom';

const serverUrl = 'http://localhost:3000';

export const SongPage = () => {

    const [loading, setLoading] = useState(true)
    const [song, setSong] = useState<any>(null)

    const { songId } = useParams()

    const requestUrl = `${serverUrl}/genius/getlyrics/${songId}`

    useEffect(() => {
        console.log("getting song lyrics and higlights")
        axios.get(requestUrl)
            .then((res) => {
                console.log(res.data)
                setSong(res.data);
                setLoading(false)
            })
            .catch((errorMessage) => {
                setLoading(false)
                console.log(errorMessage);
            })
    }, []);

    return (
        <div className="song">
            {loading ? (
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

            ) : (
                <div className="song-content">
                    <h1>{song.songData.title}</h1>
                    <h2>{song.songData.artist_names}</h2>
                    <div style={{ whiteSpace: 'pre-line' }}>
                        <p>{song.lyrics}</p>
                    </div>
                </div>
            )}
        </div>
    );
};
