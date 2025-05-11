import spotifyLogo from '../assets/Spotify_Logo.png';

const apiUrl = import.meta.env.VITE_API_URL;

export const Login = () => {
    return (
        <div className="login-container">
            <a href={`${apiUrl}/spotify/login`} >
                <img className="spotify-logo" src={spotifyLogo} alt="Spotify Logo" />
            </a>
            <p id='login-text'>Connect Spotify</p>
        </div>
    );
}

