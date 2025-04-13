import { useEffect, useState } from "react";
import "../styling/SongPage.css";
import axios from "axios";
import { useParams } from 'react-router-dom';
import LyricHighlighter from "../components/LyricHighlighter";

const serverUrl = 'http://localhost:3000';

export const SongPage = () => {

    const [loading, setLoading] = useState(true)
    const [song, setSong] = useState<any>(null)

    const { songId } = useParams()

    const requestUrl = `${serverUrl}/genius/getlyrics/${songId}`

    // useEffect(() => {
    //     console.log("getting song lyrics and higlights")
    //     axios.get(requestUrl)
    //         .then((res) => {
    //             console.log(res.data)
    //             setSong(res.data);
    //             setLoading(false)
    //         })
    //         .catch((errorMessage) => {
    //             setLoading(false)
    //             console.log(errorMessage);
    //         })
    // }, []);

    useEffect(() => {
        // Simulate fetching data (replace with your actual API call)
        setTimeout(() => {
            setLoading(false);
        }, 2000);
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
                <LyricHighlighter/>
            )}
        </div>
    );
};
