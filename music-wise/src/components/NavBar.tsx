import { Navbar, Container, Nav } from "react-bootstrap";

export const NavBar: React.FC = () => {
    return (
        <Navbar className="nav-bar" expand="md">
            <Container>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="d-flex justify-content-end" id="nav-links">
                        <Nav.Link className="nav-link" href="/">Home</Nav.Link>
                        <Nav.Link className="nav-link" href="/About">About</Nav.Link>
                        <Nav.Link className="nav-link" href="/Contact">GitHub</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};
