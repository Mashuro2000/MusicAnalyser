import { FaSearch } from "react-icons/fa";
import { useRef, useState } from "react";
import axios from "axios";
import { SongSearchResult } from "../interfaces/interfaces";

const serverUrl = import.meta.env.VITE_API_URL;

interface Props {
    setResults: (results: SongSearchResult[]) => void;
    onFocus?: () => void;
}

export const SearchBar = ({ setResults, onFocus }: Props) => {
    const [input, setInput] = useState("");
    const cancelTokenRef = useRef<ReturnType<typeof axios.CancelToken.source> | null>(null);
    const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchSongs = (value: string) => {
        const trimmed = value.trim();

        if (trimmed === "") {
            setResults([]);
            return;
        }

        // Cancel previous request if any
        if (cancelTokenRef.current) {
            cancelTokenRef.current.cancel("Cancelled due to new request");
        }

        cancelTokenRef.current = axios.CancelToken.source();

        axios
            .get(`${serverUrl}/genius/search/${trimmed}`, {
                cancelToken: cancelTokenRef.current.token,
            })
            .then((response) => {
                const searchResults: SongSearchResult[] = response.data.map((val: any): SongSearchResult => {
                    return {
                        id: val.id,
                        title: val.title,
                        albumArt: val.albumArt,
                        geniusUrl: val.geniusUrl,
                        artistsNames: val.artistsNames
                    };
                });

                setResults(searchResults);
            })
            .catch((error) => {
                if (axios.isCancel(error)) {
                    console.log("Request cancelled:", error.message);
                } else {
                    console.error(error);
                }
            });
    };

    const handleChange = (value: string) => {
        setInput(value);

        // Clear previous debounce timer
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        // Set new debounce timer
        debounceTimeoutRef.current = setTimeout(() => {
            fetchSongs(value);
        }, 400);
    };

    return (
        <div className="input-wrapper">
            <FaSearch id="search-icon" />
            <input
                className="search-input"
                placeholder="Search a song..."
                value={input}
                onChange={(e) => handleChange(e.target.value)}
                onFocus={onFocus}
            />
        </div>
    );
};


