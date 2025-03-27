import {SearchResult} from './SearchResult' 

export const SearchResultsList = ({results}: any) => {

    return (
        <div className="results-list">
            {results.map((result: any, id: any) => {
                return <SearchResult key={id} result={result.result}/>
            })}
        </div>
    )
}

