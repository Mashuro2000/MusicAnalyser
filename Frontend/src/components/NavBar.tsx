import { Navbar, Container, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { SearchBar } from "./SearchBar";
import { useState, useEffect, useRef } from "react";
import { SearchResultsList } from "./SearchResultsList";
import { SongSearchResult } from "../interfaces/interfaces";

export const NavBar: React.FC = () => {
    const [results, setResults] = useState<SongSearchResult[]>([]);
    const [showResults, setShowResults] = useState(false);
    const navigate = useNavigate();
    const searchContainerRef = useRef<HTMLDivElement>(null);

    const handleResultClick = () => {
        setShowResults(false);
        setResults([]);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <Navbar className="nav-bar" expand="md">
            <Container>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="d-flex justify-content-between align-items-center w-100">
                        <div className="d-flex">
                            <Nav.Link className="nav-link" as={Link} to="/">Home</Nav.Link>
                            <Nav.Link className="nav-link" as={Link} to="/About">About</Nav.Link>
                            <Nav.Link className="nav-link" as={Link} to="https://github.com/Mashuro2000/MusicAnalyser">GitHub</Nav.Link>
                        </div>
                        <div className="search-container" ref={searchContainerRef}>
                            <SearchBar 
                                setResults={(newResults) => {
                                    setResults(newResults);
                                    setShowResults(true);
                                }} 
                                onFocus={() => setShowResults(true)} 
                            />
                            {showResults && results.length > 0 && (
                                <div className="navbar-search-results">
                                    <SearchResultsList results={results} onClick={handleResultClick} />
                                </div>
                            )}
                        </div>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};
