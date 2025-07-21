import { Link } from 'react-router-dom';

export const NotFound = () => {
    return (
        <div className="not-found-container" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            textAlign: 'center'
        }}>
            <h1>404s and Heartbreaks</h1>
            <p>Oops! Looks like this page doesn't exist.</p>
            <Link to="/" style={{
                color: 'inherit',
                textDecoration: 'none',
                marginTop: '1rem'
            }}>
                Return to Home
            </Link>
        </div>
    );
}

export default NotFound;
