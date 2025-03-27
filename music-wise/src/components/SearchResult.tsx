import { Link } from 'react-router-dom';

export const SearchResult = (result: any) => {

    let song = result.result
    console.log(song)
    return (
        <Link 
            id='link'
            to={`/${song.id}`}
            state={song}>
            <div className="search-result">
                <img src={song.song_art_image_thumbnail_url}/>
                
                <div className='search-result-text'>
                    <h4>{song.title}</h4>
                    <p>{song.artist_names}</p>
                </div>
            </div>
        </Link>
    )
}
