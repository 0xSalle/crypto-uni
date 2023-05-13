import React, { useState } from 'react';
import logo from './logo.svg';

function Home() {
  const [imageUrl, setImageUrl] = useState(null);
  const [userCount, setUserCount] = useState(null);

  const handleImageLoad = async () => {
    try {
      const response = await fetch('https://bafkreib4isu76f3ubfij6ozvcah7rqhcsl6v7fi2lrspq2bn3e234rvqmu.ipfs.nftstorage.link/');
      const data = await response.json();
      const imageTag = data.image;
      setImageUrl(imageTag);
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  const handleUserCount = async () => {
    try {
      const response = await fetch('https://localhost:3003/users/count');
      const data = await response.json();
      setUserCount(data.count);
    } catch (error) {
      console.error('Error fetching user count:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {imageUrl ? (
          <img src={imageUrl} className="App-logo" alt="logo" />
        ) : (
          <img src={logo} className="App-logo" alt="logo" />
        )}
        <p>Welcome to the home page!</p>
        <button onClick={handleImageLoad}>Desplegar NFT</button>
        {userCount !== null && <p>Registered users: {userCount}</p>}
        <button onClick={handleUserCount}>Get User Count</button>
      </header>
    </div>
  );
}

export default Home;

