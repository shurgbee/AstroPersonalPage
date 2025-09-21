const clientId = import.meta.env.SPOTIFY_CLIENT_ID;
const clientSecret = import.meta.env.SPOTIFY_CLIENT_SECRET;
const refreshToken = import.meta.env.SPOTIFY_REFRESH_TOKEN;

async function getAccessToken() {
    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${basic}`
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        })
    });

    const data = await response.json();
    if (data.error) {
        throw new Error(`Failed to get access token: ${data.error}`);
    }
    return data.access_token;
}

export async function getCurrSong() {
    const accessToken = await getAccessToken();

    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });

    console.log(response);
    if (response.status === 204 || response.status > 400) {
        return 'No song is currently playing.';
    }

    const data = await response.json();
    return data.item.external_urls.spotify;
}
