import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InstagramLogin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  // Replace with your Instagram App ID and Redirect URI
  const clientId = '899845768790351';
  const clientSecret = '814201c8e64b4858661138d6027ca8bd';
  const redirectUri = 'http://localhost:3000/auth/instagram/callback';

  // Step 1: Redirect to Instagram for authorization
  const handleLogin = () => {
    const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user_profile,user_media&response_type=code`;
    window.location.href = authUrl;
  };

  // Step 2: Handle the callback after Instagram redirects back
  const handleCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      try {
        // Exchange the code for an access token
        const tokenResponse = await axios.post('https://api.instagram.com/oauth/access_token', null, {
          params: {
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri,
            code: code,
          },
        });

        const accessToken = tokenResponse.data.access_token;

        // Fetch user data using the access token
        const userResponse = await axios.get(`https://graph.instagram.com/me`, {
          params: {
            fields: 'id,username',
            access_token: accessToken,
          },
        });

        setIsLoggedIn(true);
        setUserData(userResponse.data);
      } catch (err) {
        console.error('Error during Instagram login:', err);
        setError('Failed to log in with Instagram. Please try again.');
      }
    }
  };

  // Call handleCallback when the component mounts
  useEffect(() => {
    handleCallback();
  }, []);

  return (
    <div>
      {!isLoggedIn ? (
        <button onClick={handleLogin}>Login with Instagram</button>
      ) : (
        <div>
          <h2>Welcome, {userData?.username}!</h2>
          <p>User ID: {userData?.id}</p>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default InstagramLogin;