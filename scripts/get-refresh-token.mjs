import http from 'http';
import { URL } from 'url';
import crypto from 'crypto';

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = 'http://localhost:8888/callback';

if (!client_id || !client_secret) {
  console.error('Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET environment variables');
  process.exit(1);
}

const state = crypto.randomBytes(16).toString('hex');
const scope = 'user-read-recently-played';

const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host}`);
  
  if (reqUrl.pathname === '/login') {
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirect_uri)}&state=${state}`;
    res.writeHead(302, { Location: authUrl });
    res.end();
  } else if (reqUrl.pathname === '/callback') {
    const code = reqUrl.searchParams.get('code');
    const returnedState = reqUrl.searchParams.get('state');

    if (state !== returnedState) {
      res.end('State mismatch');
      return;
    }

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
        },
        body: new URLSearchParams({
          code: code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code'
        })
      });

      const data = await response.json();
      res.end(`Success! Your refresh token is: \n\n${data.refresh_token}\n\nSave this in your repository secrets as SPOTIFY_REFRESH_TOKEN.`);
      server.close();
    } catch (err) {
      res.end('Error fetching token: ' + err.message);
    }
  } else {
    res.end('Go to http://localhost:8888/login to authenticate with Spotify');
  }
});

server.listen(8888, () => {
  console.log('Server running. Visit http://localhost:8888/login to authenticate.');
});
