import "../styling/Search.css"
import { useState, useEffect } from 'react';
import { VaraText } from "../components/VaraText";
import { SearchBar } from '../components/SearchBar';
import { SearchResultsList } from '../components/SearchResultsList';
import { Login } from "../components/Login";
import { SpotifyAccessToken, SongSearchResult } from "../../../common/interfaces";
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import fire_icon from "../assets/fire_icon.png";
import { Link } from "react-router-dom";
import axios from "axios";

const serverUrl = import.meta.env.VITE_API_URL;
const queryClient = new QueryClient();

const SearchContent = () => {
    const [results, setResults] = useState<SongSearchResult[]>([]);
    const [token, setToken] = useState<SpotifyAccessToken | null>(null);
    const [hasToken, setHasToken] = useState(false);

    useEffect(() => {
        async function getToken() {
            const response = await axios.get(`${serverUrl}/spotify/getAccessToken`);
            setToken(response.data.access_token as SpotifyAccessToken);
        }
        getToken();
    }, []);

    useEffect(() => {
        if (!token || !token.access_token || (new Date().getTime() - new Date(token.created_at).getTime() > 3600000)) {
            setHasToken(false);
            return;
        };

        setHasToken(true);
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
                {!hasToken ? <Login /> : <p>Logged in with Spotify</p>}
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