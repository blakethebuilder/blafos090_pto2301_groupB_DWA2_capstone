import { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import Likes from "./Likes.jsx";
import Search from "../components/search";
import getUserData from "../components/getUserData.js";
import PodCastPlayer from "../components/podcastPlayer.jsx";
import getSupabase from "../assets/api";
import "../styles/App.css";

Home.propTypes = {
  allPodcastData: PropTypes.any,
  user: PropTypes.any,
  setPodcastData: PropTypes.any,
  setUser: PropTypes.any,
};
const supabase = getSupabase();

export default function Home(props) {
  const { allPodcastData, user, setPodcastData, setUser, episode, setEpisode } =
    props;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPodcast, setSelectedPodcast] = useState(null);

  useEffect(() => {
    getUserData(setUser);
  }, []);

  async function logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error during logout:", error);
      }
      Navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }

  useEffect(() => {
    try {
      fetch("https://podcast-api.netlify.app/shows")
        .then((res) => res.json())
        .then((data) => {
          setPodcastData(data);
          console.log(`All podcast data:`, data);
          console.log(allPodcastData);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching podcast data:", error);
          setError("Error fetching podcast data. Please try again later.");
          setLoading(false);
        });
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  }, [setPodcastData]);

  useEffect(() => {
    console.log(allPodcastData);
  }, [allPodcastData]);

  return (
    <Box
      className="home"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      {user ? (
        <div className="home">
          <Box
            className="navbar2"
            sx={{
              display: "flex",
              flexGrow: 1,
              p: 3,
              backgroundColor: "secondary",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={user.user_metadata.avatar_url}
              alt="Avatar"
              style={{
                borderRadius: "50%",
                maxWidth: "100%",
                height: "auto",
                marginRight: "15px",
              }}
            />
            <h2>Welcome, {user.user_metadata.full_name}!</h2>
            <Button variant="outlined" onClick={() => logout()}>
              Logout
            </Button>
          </Box>
          <Box
            sx={{
              border: 1,
              borderColor: "divider",
              p: 2,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Likes />
          </Box>
          <PodCastPlayer
            episode={episode}
            selectedPodcast={selectedPodcast}
            setSelectedPodcast={setSelectedPodcast}
            setEpisode={setEpisode}
            podcastData={allPodcastData}
            loading={loading}
            setLoading={setLoading}
          />
          <Box className="search-box">
            <Search
              allPodcastData={allPodcastData}
              setLoading={setLoading}
              loading={loading}
              setEpisode={setEpisode}
              selectedPodcast={selectedPodcast}
              setSelectedPodcast={setSelectedPodcast}
            />
          </Box>
          {error ? <Typography>{error}</Typography> : <div></div>}
        </div>
      ) : (
        <p>Please log in to access the content.</p>
      )}
    </Box>
  );
}
