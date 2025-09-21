import { writeFileSync } from 'fs';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config({ path: new URL('../.env', import.meta.url) });

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectUri = 'http://127.0.0.1:8888/callback';

if (!clientId || !clientSecret) {
    console.error('Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in your .env file');
    // process.exit(1);
}

const app = express();
const port = 8888;

app.get('/login', (req, res) => {
    const scope = 'user-read-currently-playing user-read-recently-played';
    res.redirect('https://accounts.spotify.com/authorize?' +
        new URLSearchParams({
            response_type: 'code',
            client_id: clientId,
            scope: scope,
            redirect_uri: redirectUri,
        }).toString()
    );
});

app.get('/callback', async (req, res) => {
    const code = req.query.code;

    if (!code) {
        res.send('No code provided');
        return;
    }

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
            },
            body: new URLSearchParams({
                code: code,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code'
            })
        });

        const data = await response.json();

        if (data.error) {
            res.send('Error getting tokens');
            console.error('Error:', data.error);
            return;
        }

        // Update .env file with the refresh token
        const envContent = `SPOTIFY_CLIENT_ID=${clientId}\nSPOTIFY_CLIENT_SECRET=${clientSecret}\nSPOTIFY_REFRESH_TOKEN=${data.refresh_token}`;
        writeFileSync('.env', envContent);

        res.send('Successfully got refresh token! You can close this window.');
        setTimeout(() => process.exit(0), 1000);
    } catch (error) {
        console.error('Error:', error);
        res.send('Error getting tokens');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log('Visit http://localhost:8888/login to start the authorization process');
});
