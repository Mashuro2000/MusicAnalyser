import { SongSearchResult } from '../interfaces/interfaces'
import {SearchResult} from './SearchResult' 

interface Props {
    results: SongSearchResult[];
}

export const SearchResultsList = ({results}: Props) => {

    return (
        <div className="results-list">
            {results.map((result: SongSearchResult, id: any) => {
                return <SearchResult key={id} result={result}/>
            })}
        </div>
    )
}

