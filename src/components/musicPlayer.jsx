import { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

const CoverImage = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 150,
  height: 150,
  objectFit: "cover",
  overflow: "hidden",
  borderRadius: 8,
  backgroundColor: "rgba(0,0,0,0.08)",
  "& > img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  marginBottom: (theme) => theme.spacing(2),
});

const CustomCardContainer = styled("div")({
  display: "flex",
  gap: "16px",
  flexWrap: "wrap", // Add this property
});

const CustomCard = styled("div")({
  flex: "0 0 auto", // Allow cards to shrink if needed
  width: "200px", // Set a fixed width for the cards
  cursor: "pointer",
  transition: "transform 0.3s",
  "&:hover": {
    transform: "scale(1.05)",
  },
});

const EpisodesContainer = styled("div")({
  display: "flex",

  gap: (theme) => theme.spacing(2),
  overflowY: "auto",
  maxHeight: "400px",
  maxWidth: "100%",
  margin: "auto",
  justifyContent: "center",
});

const Description = styled(Typography)({
  maxHeight: 80, // Adjust the maxHeight as needed
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
});

const MediaPlayerBox = styled(Box)({
  // Add your styling for the MediaPlayerBox here
  padding: (theme) => theme.spacing(2),
  border: "1px solid #ccc",
  borderRadius: (theme) => theme.spacing(2),
  maxWidth: "80%", // Adjust the maxWidth as needed
  margin: "auto", // Center the media player
});

export default function MusicPlayerSlider(props) {
  const {
    selectedPodcast,
    episode,
    setEpisode,
    setLoading,
  } = props;
  const [expanded, setExpanded] = useState(0);
  const theme = useTheme();

  const handleTabChange = (event, newValue) => {
    setExpanded(newValue);
  };

  const handleEpisodeClick = (episode) => {
    setLoading(true);
    setEpisode(episode);
    console.log(episode);
    setLoading(false);
    // Handle episode click logic
    // You can set the selected episode or navigate to the episode page
  };

  const Player = ({ episode }) => (
    <AudioPlayer
      src={episode?.file}
      onPlay={() => console.log("Audio is playing")}
      // Add other necessary props here
      showSkipControls
      showJumpControls
      autoPlay
    />
  );

  return (
    <MediaPlayerBox sx={{ display: "flex", flexDirection: "column" }}>
      {selectedPodcast ? (
        <>
          {/* Display podcast image */}
          <CoverImage>
            <img alt="podcast-image" src={selectedPodcast.image} />
          </CoverImage>
          <Typography variant="h6">{selectedPodcast?.title}</Typography>
          {episode && (
            <>
              <Typography variant="h8">{episode?.title}</Typography>
              <Typography variant="h8">{episode?.description}</Typography>
            </>
          )}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {Player({ episode })}
          </Box>
          <Tabs
            value={0} // Update the value to match one of the valid values
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {selectedPodcast.seasons &&
              Object.keys(selectedPodcast.seasons).map((seasonKey, index) => (
                <Tab key={index} label={selectedPodcast.seasons[seasonKey].title} />
              ))}
          </Tabs>

          {selectedPodcast.seasons &&
            Object.keys(selectedPodcast.seasons).map((seasonKey, index) => (
              <Box
                key={index}
                role="tabpanel"
                hidden={expanded !== index}
                id={`tabpanel-${index}`}
                aria-labelledby={`tab-${index}`}
              >
                {expanded === index && (
                  <EpisodesContainer>
                    {selectedPodcast.seasons[seasonKey].episodes &&
                      Array.isArray(selectedPodcast.seasons[seasonKey].episodes) ? (
                        selectedPodcast.seasons[seasonKey].episodes.map(
                          (episode, episodeIndex) => (
                            // Render clickable cards for each episode
                            <CustomCard
                              key={episodeIndex}
                              onClick={() => handleEpisodeClick(episode)}
                            >
                              <CardContent>
                                Episode {episodeIndex + 1}
                                <Typography variant="subtitle1">{episode.title}</Typography>
                                <Description variant="body2">{episode.description}</Description>
                              </CardContent>
                            </CustomCard>
                          )
                        )
                      ) : (
                        <Typography>No episodes available</Typography>
                      )}
                  </EpisodesContainer>
                )}
              </Box>
            ))}
        </>
      ) : (
        <Typography>Please Select a Podcast</Typography>
      )}
    </MediaPlayerBox>
  );
}
