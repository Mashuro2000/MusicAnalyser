import "../styling/Search.css"
import { useState } from 'react';
import { VaraText } from "../components/VaraText";
import { SearchBar } from '../components/SearchBar';
import { SearchResultsList } from '../components/SearchResultsList';

export const Search = () => {
    const [results, setResults] = useState([]); 

    return (
        <div className='App'>
            <div className="logo">
                <VaraText text="Music Wise"/>
            </div>
            
            <div className='search-bar-container'>
                <SearchBar setResults={setResults}/>
                <SearchResultsList results={results}/>
            </div>
        </div>
    )
}