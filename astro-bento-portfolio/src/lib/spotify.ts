const clientId = import.meta.env.SPOTIFY_CLIENT_ID;
const clientSecret = import.meta.env.SPOTIFY_CLIENT_SECRET;
const refreshToken = import.meta.env.SPOTIFY_REFRESH_TOKEN;

async function getAccessToken() {
  const basic = btoa(`${clientId}:${clientSecret}`)

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basic}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(`Failed to get access token: ${data.error}`);
  }
  return data.access_token;
}

export async function getRecentlyPlayed() {
  const accessToken = await getAccessToken();

  const response = await fetch(
    "https://api.spotify.com/v1/me/player/recently-played?limit=1",
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    },
  );

  if (response.status !== 200) {
    throw new Error(`Failed to get recently played tracks: ${response.status}`);
  }

  const data: any = await response.json();
  console.log(data);
  return data.items[0]; // Return the most recent track
}

export async function getCurrSong() {
  const accessToken = await getAccessToken();

  const response = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    },
  );

  if (response.status === 204 || response.status > 400) {
    return null; // Return null instead of string for easier handling
  }

  const data = await response.json();
  return data;
}

export async function getSpotifyStatus() {
  try {
    const currentSong = await getCurrSong();
    // console.log("Current Song: ",currentSong);
    if (currentSong && currentSong.is_playing) {
      return {
        isPlaying: true,
        track: currentSong.item,
        progress_ms: currentSong.progress_ms,
        timestamp: new Date().toISOString(),
      };
    } else {
      // Get the most recently played track
      const recentTrack = await getRecentlyPlayed();
      return {
        isPlaying: false,
        track: recentTrack.track,
        played_at: recentTrack.played_at,
        timestamp: new Date().toISOString(),
      };
    }
  } catch (error) {
    console.error("Error getting Spotify status:", error);
    return {
      isPlaying: false,
      error: "Failed to load Spotify data",
      timestamp: new Date().toISOString(),
    };
  }
}
