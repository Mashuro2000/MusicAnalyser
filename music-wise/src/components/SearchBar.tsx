import { FaSearch } from "react-icons/fa";

export const SearchBar = () => {
    return (
        <div className="seach-bar">
            <FaSearch id="search-icon"/>
            <input placeholder="Search a song..."/>
        </div>
    )
}

