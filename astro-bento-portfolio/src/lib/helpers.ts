export function trimText(input: string, maxLength: number = 100): string {
  if (input.length <= maxLength) return input;
  return input.substring(0, maxLength - 3) + "...";
}
export function getDallasTime(): Date {
  // Create a date object with the current UTC time
  const now = new Date();

  // Convert the UTC time to Dallas's time
  const offsetDallas = -6; // Dallas is (UTC-6)
  now.setHours(now.getUTCHours() + offsetDallas);

  return now;
}

export function formatTimeForUS(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // This will format the time in 12-hour format with AM/PM
    timeZone: "America/Chicago",
  };

  let formattedTime = new Intl.DateTimeFormat("en-US", options).format(date);

  formattedTime += " CT";

  return formattedTime;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
}

export async function getSpotifyCurrentlyListeningSong(): Promise<string>{
  const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: {
      Authorization: `Bearer ${process.env.SPOTIFY_ACCESS_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.item.name;
};
