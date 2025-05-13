import "../styling/Search.css"
import { useState, useEffect } from 'react';
import { VaraText } from "../components/VaraText";
import { SearchBar } from '../components/SearchBar';
import { SearchResultsList } from '../components/SearchResultsList';
import { Login } from "../components/Login";
import { SpotifyAccessToken } from "../interfaces/interfaces";
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import fire_icon from "../assets/fire_icon.png";
import { Link } from "react-router-dom";

const serverUrl = import.meta.env.VITE_API_URL;
const queryClient = new QueryClient();

const SearchContent = () => {
    const [results, setResults] = useState([]);
    const [token, setToken] = useState<SpotifyAccessToken>({ access_token: "", created_at: new Date() });

    useEffect(() => {
        async function getSpotifyToken() {
            try {
                const response = await fetch(`${serverUrl}/spotify/getAccessToken`);
                const data = await response.json();
                console.log("Token data received:", data);
                if (data && typeof data === 'object' && 'access_token' in data) {
                    console.log("Setting token with data:", data);
                    setToken(data as SpotifyAccessToken);
                } else {
                    console.log("Invalid token data received:", data);
                    setToken({ access_token: "", created_at: new Date() });
                }
            } catch (error) {
                console.log("Connection to Spotify failed", error);
                setToken({ access_token: "", created_at: new Date() });
            }
        }
        getSpotifyToken();
    }, [])

    // Monitor token changes
    useEffect(() => {
        console.log("Token state updated:", token);
        if (token) {
            console.log("Token object:", token);
            console.log("Token access_token:", token.access_token);
            console.log("Token access_token type:", typeof token.access_token);
            console.log("Token access_token length:", token.access_token.length);
        }
        console.log("Login condition evaluation:", token.access_token === "");
    }, [token]);

    const { isLoading, data: mostSearchedData } = useQuery({
        queryKey: ['popular-songs'],
        queryFn: async () => {
            const response = await fetch(
                `${serverUrl}/genius/getMostVisited`,
            )
            const data = await response.json() as any[];
            console.log(data);
            return data;
        },
    });

    return (
        <div className='App'>
            <div className="logo">
                <VaraText text="Music Wise" />
            </div>

            <div className='search-bar-container'>
                <SearchBar setResults={setResults} />
                <SearchResultsList results={results} />
            </div>
            <div className="popular-songs-container">
                <h2>Most Searched</h2>
                <div className="popular-songs-list">
                    {isLoading ? (
                        <div className="most-searched-loader">
                        </div>
                    ) : null}
                    {mostSearchedData?.map((song: any) => (
                        <Link key={song.id} className="link" to={`/songLyrics/${song.id}`}>
                            <div className="popular-song-item">
                                <img src={song.song_art} alt={song.title} />
                                <div>
                                    <h3>{song.title}</h3>
                                    <p>{song.artists}</p>
                                </div>
                                <p>{song.visits}</p>
                                <img src={fire_icon} alt="fire" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="login-container">
                {token.access_token === "" || token.access_token === null ? <Login /> : <p>Logged in with Spotify</p>}
            </div>
        </div>
    )
}

export const Search = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <SearchContent />
        </QueryClientProvider>
    );
}