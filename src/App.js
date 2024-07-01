import React, { useState, useRef, useEffect } from 'react';
import { RtcTokenBuilder, RtcRole } from 'agora-token';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import './App.css';

function App() {
  const [playerId, setPlayerId] = useState('');
  const [channelName, setChannelName] = useState('');
  const [rtmpUrl, setRtmpUrl] = useState('');
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  const appId = 'cba5df06aeb349cd9af5f1989969b253'; // Replace with your Agora App ID
  const appCertificate = '4d56df7f96ba4bff8f48f229f19f11ca'; // Replace with your Agora App Certificate
  const baseUrl = 'rtmp://your-server-ip/live'; // Replace with your RTMP server base URL

  const generateRtcToken = (playerId, channelName) => {
    const role = RtcRole.PUBLISHER;
    const expirationTimeInSeconds = 3600 * 24;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, playerId, role, privilegeExpiredTs);
    return token;
  };

  const constructRtmpUrl = (baseUrl, channelName, token, uid, appId) => {
    return `${baseUrl}/${channelName}?token=${token}&uid=${uid}&appid=${appId}`;
  };

  const handleGenerateUrl = () => {
    const token = generateRtcToken(playerId, channelName);
    const url = constructRtmpUrl(baseUrl, channelName, token, playerId, appId);
    setRtmpUrl(url);
  };

  useEffect(() => {
    if (rtmpUrl && videoRef.current) {
      playerRef.current = videojs(videoRef.current, {
        sources: [{
          src: rtmpUrl,
          type: 'rtmp/mp4'
        }],
        techOrder: ['flash']
      });
    }
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [rtmpUrl]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Agora RTMP URL Generator and Stream Player</h1>
        <input
          type="text"
          placeholder="Enter Player ID"
          value={playerId}
          onChange={(e) => setPlayerId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter Channel Name"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
        />
        <button onClick={handleGenerateUrl}>Generate RTMP URL</button>
        {rtmpUrl && (
          <div>
            <h2>Generated RTMP URL</h2>
            <p>{rtmpUrl}</p>
            <div data-vjs-player>
              <video ref={videoRef} className="video-js vjs-default-skin" controls preload="auto"></video>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
