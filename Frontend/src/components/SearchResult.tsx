import { Link } from 'react-router-dom';
import { SongSearchResult } from '../interfaces/interfaces';

interface Props {
    result: SongSearchResult;
    onClick?: () => void;
}

export const SearchResult = ({result, onClick}: Props) => {
    
    return (
        <Link 
            className='link'
            to={`/songLyrics/${result.id}`}
            onClick={onClick}>
            <div className="search-result">
                <img src={result.albumArt}/>
                
                <div className='search-result-text'>
                    <h4>{result.title}</h4>
                    <p>{result.artistsNames}</p>
                </div>
            </div>
        </Link>
    )
}
