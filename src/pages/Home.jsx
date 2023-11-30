/**
 * Renders the Home component.
 *
 * @param {Object} props - The props passed to the component.
 * @param {Array} props.allPodcastData - The array of podcast data.
 * @param {Object} props.user - The user object.
 * @param {Function} props.setPodcastData - The function to set the podcast data.
 * @param {Function} props.setUser - The function to set the user.
 * @param {Object} props.episode - The episode object.
 * @param {Function} props.setEpisode - The function to set the episode.
 * @return {JSX.Element} The Home component.
 */
import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

import Search from "../components/search";
import getUserData from "../components/getUserData.js";
import PodCastPlayer from "../components/podcastPlayer.jsx";
import Likes from "./Likes.jsx";

import "../styles/App.css";
import "../styles/index.css";


Home.propTypes = {
  allPodcastData: PropTypes.any, // Add the prop type validation for allPodcastData
  user: PropTypes.any,
  setPodcastData: PropTypes.any,
  setUser: PropTypes.any,
};



function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      key={`tabpanel-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function Home(props) {
  const { allPodcastData, user, setPodcastData, setUser, episode, setEpisode } =
    props;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [value, setValue] = useState(0);

  const [expanded, setExpanded] = useState(false);

  const [selectedPodcast, setSelectedPodcast] = useState(null);

  const handleModalChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    getUserData(setUser);
  }, []);

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


  const handlePodcastClick = (pod) => {
    console.log("Podcast clicked:", pod);
    fetchPodcastData(pod.id);
    handleOpen();
  };

  const a11yProps = (index) => ({
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  });


  async function logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error during logout:", error);
      }
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }

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
            <Button variant="Outlined" onClick={() => logout()}>
              Logout
            </Button>
          </Box>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}> 
                <Likes/>
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
