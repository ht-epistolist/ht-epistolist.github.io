import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

async function getAccessToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    })
  });
  
  const data = await response.json();
  return data.access_token;
}

async function getRecentlyPlayed(token) {
  const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=3', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) return [];
  const data = await response.json();
  return data.items.map(item => ({
    name: item.track.name,
    artist: item.track.artists[0].name,
    url: item.track.external_urls.spotify
  }));
}

async function getPublicProfile(token) {
    // Just using a placeholder profile ID for the example
    const profileId = "spotify"; 
    const response = await fetch(`https://api.spotify.com/v1/users/${profileId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) return { name: "Heliot", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80" };
    const data = await response.json();
    return {
        name: data.display_name,
        avatar: data.images[0]?.url || "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80"
    };
}

async function main() {
  try {
    if (!client_id || !client_secret || !refresh_token) {
        console.log("Missing Spotify credentials, skipping fetch.");
        return;
    }
    const token = await getAccessToken();
    const recentlyPlayed = await getRecentlyPlayed(token);
    const profile = await getPublicProfile(token);
    
    // We'll keep the placeholder playlists for now
    const playlists = [
      { name: "Coding Focus", url: "https://open.spotify.com/playlist/placeholder1" },
      { name: "Late Night Drives", url: "https://open.spotify.com/playlist/placeholder2" },
      { name: "Synthwave 2025", url: "https://open.spotify.com/playlist/placeholder3" }
    ];
    
    const output = {
        user: profile,
        recentlyPlayed,
        playlists
    };
    
    fs.writeFileSync(path.join(__dirname, '../src/data/spotify.json'), JSON.stringify(output, null, 2));
    console.log("Spotify data updated successfully.");
  } catch (error) {
    console.error("Error fetching Spotify data:", error);
  }
}

main();
