
import "../styling/Search.css";

export const About = () => {
    return (
        <div className="about-container">

            <h1 className="text-center mb-5">About Music Wise</h1>

            <section className="mb-4">
                <h2>What is Music Wise?</h2>
                <p>
                    Music Wise is a web application designed to enhance your music discovery experience.
                    It combines the power of Spotify's extensive music library with an intuitive interface
                    to help you explore and learn more about your favorite music.
                </p>
            </section>

            <section className="mb-4">
                <h2>Features</h2>
                <h3>Smart Search</h3>
                <p>
                    Our intelligent search functionality allows you to search for songs, artists, and albums.
                    The search results are powered by Genius's API, ensuring you get accurate and up-to-date
                    information about your queries.
                </p>

                <h3>Spotify Integration</h3>
                <p>
                    Music Wise seamlessly integrates with Spotify, allowing you to:
                </p>
                <ul>
                    <li>Access Spotify's vast music library</li>
                    <li>View detailed information about tracks and artists</li>
                    <li>Connect with your Spotify account for a personalized experience</li>
                </ul>
            </section>

            <section className="mb-4">
                <h2>Technology Stack</h2>
                <p>
                    Music Wise is built using modern web technologies:
                </p>
                <ul>
                    <li>React.js for the frontend interface</li>
                    <li>TypeScript for type-safe code</li>
                    <li>Bootstrap for responsive design</li>
                    <li>Spotify Web API for music data</li>
                    <li>Genius API for lyrics and song information</li>
                    <li>OpenAI API for song analysis</li>
                    <li>PostgreSQL for database</li>
                    <li>Node.js and Express for the backend</li>
                </ul>
            </section>

            <section className="mb-4">
                <h2>How to Use</h2>
                <ol>
                    <li>Start by logging in with your Spotify account</li>
                    <li>Use the search bar to look for your favorite music</li>
                    <li>Click on search results to view detailed information</li>
                    <li>Explore and discover new music!</li>
                </ol>
            </section>

            <section>
                <h2>Privacy & Security</h2>
                <p>
                    Music Wise takes your privacy seriously. We only request necessary permissions
                    from Spotify to provide our services. Your personal data is never stored or
                    shared with third parties.
                </p>
            </section>
        </div>
    );
};
