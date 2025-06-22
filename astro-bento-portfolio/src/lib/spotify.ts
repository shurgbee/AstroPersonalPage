const clientId = 'YOUR_SPOTIFY_CLIENT_ID';
const clientSecret = 'YOUR_SPOTIFY_CLIENT_SECRET';
const refreshToken = 'YOUR_SPOTIFY_REFRESH_TOKEN';

async function getAccessToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        })
    });

    const data = await response.json();
    return data.access_token;
}

async function getCurrentlyPlayingSongUrl() {
    const accessToken = await getAccessToken();

    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });

    if (response.status === 204 || response.status > 400) {
        return 'No song is currently playing.';
    }

    const data = await response.json();
    return data.item.external_urls.spotify;
}

getCurrentlyPlayingSongUrl().then(url => console.log(url)).catch(err => console.error(err));