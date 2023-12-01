import { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";
import logo from "../assets/Devcast-orange.png";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { Button } from "@mui/material";

import { Card, CardContent } from "@mui/material";

import getSupabase from "../assets/api";

const supabase = getSupabase();

const Widget = styled("div")(({ theme }) => ({
  padding: 16,
  borderRadius: 16,
  width: "80vw",
  maxWidth: "100%",
  margin: "auto",
  backgroundColor: "rgba(255, 69, 0, 0.1)",
  color: "#333",

  minWidth: 200,
}));

const CoverImage = styled("div")({
  width: 250,
  height: 250,
  objectFit: "cover",
  overflow: "hidden",
  flexShrink: 0,
  borderRadius: 200,
});
const EpisodesContainer = styled("div")({
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
  overflowX: "auto",
  maxWidth: "100%",
  justifyContent: "center",
  alignItems: "center",
});

export default function PodCastPlayer(props) {
  const initialPodcastValue = {
    id: null,
    title: "",
    description: "",
    image: "",
    seasons: {},
    episodes: [],
    liked: false,
  };

  const [isLiked, setIsLiked] = useState(false);

  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();

  const {
    episode,
    selectedPodcast,
    setEpisode,
    loading,
    setLoading,
    setSelectedPodcast,
  } = props;

  const truncateLabel = (label, maxLength) => {
    if (label.length > maxLength) {
      return label.substring(0, maxLength) + "...";
    }
    return label;
  };

  const handleTabChange = (event, newValue) => {
    setExpanded(newValue);
  };

  const handleEpisodeClick = (episode) => {
    setLoading(true);
    setEpisode(episode);
    setLoading(false);
  };

  const handleLike = async () => {
    try {
      // Ensure selectedPodcast is not null or undefined
      if (!selectedPodcast) {
        console.error("Selected podcast is null or undefined.");
        return;
      }

      // Determine the new like status
      const newLikedStatus = !selectedPodcast.liked;

      // If it was liked before, perform delete
      if (!newLikedStatus) {
        const { data, error } = await supabase
          .from("podcasts")
          .delete()
          .eq("id", selectedPodcast.id);

        if (error) {
          console.error("Error performing delete:", error.message);
        } else {
          console.log("Delete operation successful:", data);
        }
      } else {
        // If it was unliked, perform upsert
        const { data, error } = await supabase.from("podcasts").upsert([
          {
            id: selectedPodcast.id,
            title: selectedPodcast.title,
            description: selectedPodcast.description,
            image: selectedPodcast.image,
            seasons: selectedPodcast.seasons,
            episodes: selectedPodcast.episodes,
            liked: newLikedStatus,
          },
        ]);

        if (error) {
          console.error("Error performing upsert:", error.message);
        } else {
          console.log("Upsert operation successful:", data);
        }
      }

      // No need to update state for isLiked
      setIsLiked(newLikedStatus);
    } catch (error) {
      console.error("Error in handleLike:", error.message);
    }
  };

  const handleClearState = () => {
    setIsLiked(false);
    setSelectedPodcast(null);
    setExpanded(false);
    setEpisode(null);
  };
  return (
    <Box
      className="player"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        width: "100%",
        height: "100%",
        p: 2,
        position: "relative",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 5,
      }}
    >
      <Widget>
        {selectedPodcast !== null && (
          <Button onClick={handleClearState} sx={{ marginTop: 2 }}>
            Clear Player
          </Button>
        )}

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",

            gap: 1,
            width: "100%",
            height: "100%",

            position: "relative",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 5,
            mb: 2,
          }}
        >
          <Typography variant="h5" color="text.secondary" fontWeight={500}>
            {selectedPodcast?.title}
          </Typography>
          <CoverImage
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {loading ? (
              <p>Loading...</p> // You can replace this with your loading indicator or component
            ) : (
              <div>
                {selectedPodcast ? (
                  <img
                    alt={selectedPodcast.title}
                    src={selectedPodcast.image}
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                ) : (
                  <img
                    className="logo"
                    src={logo}
                    alt="Devcast Logo"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                )}
              </div>
            )}
          </CoverImage>
          {selectedPodcast && (
            <IconButton onClick={handleLike} sx={{ mt: 1 }}>
              {selectedPodcast.liked ? (
                <FavoriteIcon color="primary" />
              ) : (
                <FavoriteBorderIcon color="primary" />
              )}
            </IconButton>
          )}

          <Box
            className="now-playing"
            sx={{
              ml: 1.5,
              minWidth: 0,
              mb: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
              padding: 2,
              borderRadius: 4,
            }}
          >
            {selectedPodcast && (
              <>
                <Typography>Now playing</Typography>
                <Typography noWrap>{episode?.title}</Typography>
                <Typography variant="caption" letterSpacing={-0.25}>
                  {episode?.description}
                </Typography>
              </>
            )}
          </Box>
        </Box>

        <Box className="season-controls">
          <Tabs
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTabs-indicator": {
                display: "contents",
              },
              m: 2,
            }}
          >
            {selectedPodcast && selectedPodcast.seasons
              ? Object.keys(selectedPodcast.seasons).map((seasonKey, index) => (
                  <Tab
                    key={seasonKey}
                    value={index}
                    label={truncateLabel(
                      selectedPodcast.seasons[seasonKey].title,
                      20
                    )}
                    sx={{
                      padding: "8px 16px",
                      border: "1px solid #ccc",
                      borderRadius: 10,
                      minWidth: "100px",
                    }}
                  />
                ))
              : null}
          </Tabs>
          {selectedPodcast && selectedPodcast.seasons
            ? Object.keys(selectedPodcast.seasons).map((seasonKey, index) => (
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
                            <Card
                              key={episodeIndex}
                              onClick={() => handleEpisodeClick(episode)}
                              sx={{
                                cursor: "pointer",
                                mb: 2,
                                width: "100%",
                                maxWidth: 300,
                                transition: "transform 0.3s ease", // Add a transition effect
                                "&:hover": {
                                  transform: "scale(1.05)", // Increase size on hover
                                },
                                "&:active": {
                                  transform: "scale(0.95)", // Decrease size when clicked
                                },
                              }}
                            >
                              <CardContent>
                                Episode {episodeIndex ? episodeIndex + 1 : "-"}
                                <Typography variant="subtitle1">
                                  {episode.title}
                                </Typography>
                                <Typography variant="body2">
                                  {episode.description}
                                </Typography>
                                <PlayArrowIcon
                                  sx={{
                                    color: "primary.main",
                                    mt: 1,
                                    scale: 3,
                                  }}
                                />
                              </CardContent>
                            </Card>
                          )
                        )
                      ) : (
                        <Typography>No episodes available</Typography>
                      )}
                    </EpisodesContainer>
                  )}
                </Box>
              ))
            : null}
        </Box>
      </Widget>
    </Box>
  );
}
