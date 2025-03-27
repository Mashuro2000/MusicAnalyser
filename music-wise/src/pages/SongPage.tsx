import { useEffect, useState } from "react";
import "../styling/SongPage.css";
import axios from "axios";
import { useLocation } from "react-router";

const serverUrl = 'http://localhost:3000';

export const SongPage = () => {
    const [loading, setLoading] = useState(true);
    const [lyrics, setLyrics] = useState<any>(null); // replace `any` with your data type

    const location = useLocation();
    const songData = location.state

    console.log(songData)


    useEffect(() => {
        // Simulate fetching data (replace with your actual API call)

        // setTimeout(() => {
        //     setLyrics({ title: "Song Title", artist: "Artist Name" });
        //     setLoading(false);
        // }, 400);
    }, []);

    return (
        <div className="song">
            {loading ? (
                <div className="loader">
                    <span className="stroke"></span>
                    <span className="stroke"></span>
                    <span className="stroke"></span>
                    <span className="stroke"></span>
                    <span className="stroke"></span>
                    <span className="stroke"></span>
                    <span className="stroke"></span>
                </div>
            ) : (
                <div className="song-content">
                    <h1>{songData.title}</h1>
                    <h2>{songData.artist}</h2>
                </div>
            )}
        </div>
    );
};
