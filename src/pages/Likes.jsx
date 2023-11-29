import React, { useEffect, useState } from 'react';
import fetchPodcastData from '../assets/fetchSupa'; // Adjust the path accordingly




const Likes = ({ match }) => {
  const [podcastData, setPodcastData] = useState(null);
  const podcastId = match?.params.id; // Assuming you have a route parameter for the podcast ID

  useEffect(() => {
    if (podcastId) {
      const fetchData = async () => {
        const data = await fetchPodcastData(podcastId);
        setPodcastData(data);
      };

      fetchData();
    }
  }, [podcastId]);

  if (!podcastData) {
    return <div>Save your likes here </div>;
  }

  return (
    <div>
      <h1>{podcastData.title}</h1>
      <p>{podcastData.description}</p>
      {/* Display other podcast details as needed */}
    </div>
  );
};

export default Likes;
