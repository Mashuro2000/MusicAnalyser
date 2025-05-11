import "../styling/Search.css"
import { useState, useEffect } from 'react';
import { VaraText } from "../components/VaraText";
import { SearchBar } from '../components/SearchBar';
import { SearchResultsList } from '../components/SearchResultsList';
import { Login } from "../components/Login";
import { SpotifyAccessToken } from "../interfaces/interfaces";
const serverUrl = import.meta.env.VITE_API_URL;

export const Search = () => {
    const [results, setResults] = useState([]); 
    const [token, setToken] = useState<SpotifyAccessToken | null>(null);

    useEffect(() => {
        async function getSpotifyToken() {
            try {
                const response = await fetch(`${serverUrl}/spotify/getAccessToken`);
                const data = await response.json();
                setToken(data.access_token as SpotifyAccessToken);
            } catch (error) {
                console.log("Connection to Spotify failed", error);
            }
        }

        getSpotifyToken();
    }, [])


    return (
        <div className='App'>
            <div className="logo">
                <VaraText text="Music Wise"/>
            </div>
            
            <div className='search-bar-container'>
                <SearchBar setResults={setResults}/>
                <SearchResultsList results={results}/>
            </div>
            <div className="login-container">
                { (!token || token.access_token === '') ? <Login /> : <p>Logged in with Spotify</p> }
            </div>
        </div>
    )
}