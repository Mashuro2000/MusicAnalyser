import { useEffect, useState } from 'react';
import { LyricSongData, SpotifyAccessToken } from '../interfaces/interfaces';
import axios from 'axios';
import '../styling/SpotifyPlayer.css';

const serverUrl = import.meta.env.VITE_API_URL;

interface Props {
    song: LyricSongData;
    token: SpotifyAccessToken;
}

declare global {
    interface Window {
        Spotify: any;
        onSpotifyWebPlaybackSDKReady: () => void;
    }
}

export const SpotifyPlayer = ({ song, token }: Props) => {
    const [player, setPlayer] = useState<any>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const [hasToken, setHasToken] = useState(false);

    useEffect(() => {
        // Initialize Spotify Web Playback SDK
        if (!token.access_token || (new Date().getTime() - new Date(token.created_at).getTime() > 3600000)) {
            setHasToken(false);
            return;
        };

        setHasToken(true);
        
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: (cb: (token: string) => void) => {
                    cb(token.access_token || '');
                },
                volume: 0.5
            });

            setPlayer(player);

            player.addListener('ready', ({ device_id }: { device_id: string }) => {
                setDeviceId(device_id);
            });

            player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('player_state_changed', (state: any) => {
                if (state) {
                    setIsPlaying(!state.paused);
                }
            });

            player.setName("MusicWise Player").then(() => {
                console.log('Player name updated!');
            });

            player.connect();
        };

        return () => {
            document.body.removeChild(script);
            if (player) {
                player.disconnect();
            }
        };
    }, [token]);

    const playSong = async () => {
        if (!player || !token.access_token) return;

        try {
            // Search for the song on Spotify
            const params = new URLSearchParams({
                q: `${song.title} ${song.artists}`,  // filter by track name AND artist
                type: 'track',                        // we only want tracks
                limit: '1',                           // optional: max results
                market: 'US'                          // optional: limit to a market
            });

            const { data } = await axios.get(`https://api.spotify.com/v1/search?${params.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${token.access_token}`
                }
            });
            
            axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
                {
                    uris: [`spotify:track:${data.tracks.items[0].id}`],
                    position_ms: 0
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token.access_token}`
                    }
                }
            ).then(() => {
                setIsPlaying(true);
                // Add playing class to album art
                const albumArt = document.querySelector('.song-art');
                if (albumArt) {
                    albumArt.classList.add('playing');
                }
            }).catch((error) => {
                console.error('Error playing song:', error);
            });
        } catch (error) {
            console.error('Error playing song:', error);
        }
    };

    const pauseSong = () => {
        if (player) {
            player.pause();
            setIsPlaying(false);
            // Remove playing class from album art
            const albumArt = document.querySelector('.song-art');
            if (albumArt) {
                albumArt.classList.remove('playing');
            }
        }
    };

    if (!hasToken) {
        return (
            <div className="spotify-player">
                <a href={`${serverUrl}/spotify/login`}>
                    <button>Login with Spotify</button>
                </a>
            </div>
        );
    }

    return (
        <div className="spotify-player">
            <button onClick={isPlaying ? pauseSong : playSong}>
                {isPlaying ? 'Pause' : 'Play on Spotify'}
            </button>
        </div>
    );
}; 