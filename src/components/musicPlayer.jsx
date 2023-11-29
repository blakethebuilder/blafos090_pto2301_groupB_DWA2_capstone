import  { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import CardContent from "@mui/material/CardContent";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

const CoverImage = styled("div")({
  "& > img": {
    width: "10%",
    height: "auto",
    borderRadius: 8,
  },
  marginBottom: "16px",
});

const CustomCard = styled("div")({
  flex: "0 0 0",
  width: "80%",
  cursor: "pointer",
  transition: "transform 0.3s",
  "&:hover": {
    transform: "scale(1.05)",
  },
  border: "1px solid #ccc",
  borderRadius: 15,

  margin: "5px",
});

const EpisodesContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  overflowY: "scroll",
  gap: 10,
  maxHeight: "500px",
  width: "80%",
  margin: "auto",
});

const Description = styled(Typography)({
  maxHeight: 80,
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
});

const MediaPlayerBox = styled(Box)({
  padding: (theme) => theme.spacing(2),
  border: "1px solid #ccc",
  borderRadius: 8,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  width: "100%",
});

export default function MusicPlayerSlider(props) {
  const { selectedPodcast, episode, setEpisode, setLoading } = props;
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
      showSkipControls
      showJumpControls
      autoPlay
    />
  );

  const truncateLabel = (label, maxLength) => {
    if (label.length > maxLength) {
      return label.substring(0, maxLength) + "...";
    }
    return label;
  };

  return (
    <MediaPlayerBox >
      {selectedPodcast ? (
        <>
          <Typography variant="h5">{selectedPodcast?.title}</Typography>
          <CoverImage>
            <img alt="podcast-image" src={selectedPodcast.image} />
          </CoverImage>

          {episode && (
            <>
              <Typography variant="h8">{episode?.title}</Typography>
              <Typography  variant="caption">{episode?.description}</Typography>
            </>
          )}
          <Box >
            {Player({ episode })}
          </Box>
          <Tabs
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {selectedPodcast.seasons &&
              Object.keys(selectedPodcast.seasons).map((seasonKey, index) => (
                <Tab
                  key={index}
                  label={truncateLabel(
                    selectedPodcast.seasons[seasonKey].title,
                    20
                  )}
                  sx={{
    
                    padding: "8px 16px",
                    border: "1px solid #ccc",
                    borderRadius: 10,
                    minWidth: 100,
                    whiteSpace: "nowrap",
                    overflow: "auto",
                    textOverflow: "ellipsis",
                  }}
                />
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
                      Array.isArray(
                        selectedPodcast.seasons[seasonKey].episodes
                      ) ? (
                        selectedPodcast.seasons[seasonKey].episodes.map(
                          (episode, episodeIndex) => (
                            <CustomCard
                              key={episodeIndex}
                              onClick={() => handleEpisodeClick(episode)}
                            >
                              <CardContent>
                                Episode {episodeIndex + 1}
                                <Typography variant="subtitle1">
                                  {episode.title}
                                </Typography>
                                <Description variant="body2">
                                  {episode.description}
                                </Description>
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
