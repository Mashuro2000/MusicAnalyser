import { SongSearchResult } from '../interfaces/interfaces'
import { SearchResult } from './SearchResult' 

interface Props {
    results: SongSearchResult[];
    onClick?: () => void;
}

export const SearchResultsList = ({results, onClick}: Props) => {
    return (
        <div className="results-list">
            {results.map((result: SongSearchResult, id: any) => {
                return <SearchResult key={id} result={result} onClick={onClick}/>
            })}
        </div>
    )
}

