import { Router, Request, Response } from "express";
import * as request from 'request';
import { SpotifyAccessToken } from "../../../common/interfaces";
require('dotenv').config();

const router = Router();

let access_token: SpotifyAccessToken = {
    access_token: "",
    created_at: new Date()
};

const spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
const spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const spotify_redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

const generateRandomString = function (length: number) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

router.get('/login', (req: Request, res: Response) => {
    const scope = "streaming \
    user-read-email \
    user-read-private \
    app-remote-control \
    user-modify-playback-state";

    const state = generateRandomString(16);

    const auth_query_parameters = new URLSearchParams({
        response_type: "code",
        client_id: spotify_client_id || '',
        scope: scope,
        redirect_uri: spotify_redirect_uri || '',
        state: state
    });

    res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
});

router.get('/callback', (req: Request, res: Response) => {
    const code = req.query.code;

    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: spotify_redirect_uri || '',
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
        'Content-Type' : 'application/x-www-form-urlencoded'
      },
      json: true
    };

    request.post(authOptions, function(error: any, response: any, body: any) {
      if (!error && response.statusCode === 200) {
        access_token.access_token = body.access_token;
        access_token.created_at = new Date(Date.now());
        res.redirect(process.env.CLIENT_SIDE || '');
      }
    });
});

router.get('/getAccessToken', (req: Request, res: Response) => {
    res.json({ access_token });
});

export default router;
