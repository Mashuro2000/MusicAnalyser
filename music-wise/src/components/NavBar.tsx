import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
export const NavBar: React.FC = () => {
    return (
        <Navbar className="nav-bar" expand="md">
            <Container>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="d-flex justify-content-end" id="nav-links">
                        <Nav.Link className="nav-link" as={Link} to="/">Home</Nav.Link>
                        <Nav.Link className="nav-link" as={Link} to="/About">About</Nav.Link>
                        <Nav.Link className="nav-link" as={Link} to="https://github.com/Mashuro2000/MusicAnalyser">GitHub</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};
