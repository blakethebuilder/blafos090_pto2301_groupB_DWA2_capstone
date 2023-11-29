import * as React from 'react';
import { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import {Button} from '@mui/material';

import { createClient } from "@supabase/supabase-js";
import { SUPABASE_API, SUPABASE_URL } from "../assets/api";

export const supabase = createClient(SUPABASE_URL, SUPABASE_API);

import { Card, CardContent } from '@mui/material';

const Widget = styled('div')(({ theme }) => ({
    
    padding: 16,
    borderRadius: 16,
    width: '800px',

    margin: 'auto',
    
    zIndex: 1,
    backgroundColor:
      theme.palette.mode === 'dark' ? 'primary-bg' : '#fff',
    backdropFilter: 'blur(40px)',
    background: 'rgba(255,255,255,0.4)',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden',
    },
  }));

const CoverImage = styled('div')({
  width: 100,
  height: 100,
  objectFit: 'cover',
  overflow: 'hidden',
  flexShrink: 0,
  borderRadius: 8,
  backgroundColor: 'rgba(0,0,0,0.08)',
  '& > img': {
    width: '100%',
  },
});



const EpisodesContainer = styled("div")({

    alignItems: "center",
    overflowY: "scroll",
    gap: 10,
    maxHeight: "50vh",
    width: "80%",
    margin: "auto",
    cursor: "pointer",
  });

export default function PodCastPlayer(props) {
  const [isLiked, setIsLiked] = useState(false);


    const {
        episode,
        selectedPodcast,
        setSelectedPodcast,
        setEpisode,
        podcastData,
        loading,
        setLoading
      } = props;


      const [expanded, setExpanded] = useState(false);

  const theme = useTheme();
  
  
  const mainIconColor = theme.palette.mode === 'dark' ? '#fff' : '#000';
  const lightIconColor =
    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';



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

      if (!selectedPodcast) {
        return <div>Select Podcast</div>;
      }

      const truncateLabel = (label, maxLength) => {
        if (label.length > maxLength) {
          return label.substring(0, maxLength) + "...";
        }
        return label;
      };

      const handleLike = async (id, title, description, image, seasons, episodes) => {
        try {
          // Determine the new like status
          const newLikedStatus = !isLiked;
      
          // If it was liked before, perform delete
          if (!newLikedStatus) {
            const { data, error } = await supabase
              .from('podcasts')
              .delete()
              .eq('id', id);
      
            if (error) {
              console.error('Error performing delete:', error.message);
            } else {
              console.log('Delete operation successful:', data);
            }
          } else {
            // If it was unliked, perform upsert
            const { data, error } = await supabase
              .from('podcasts')
              .upsert([
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
              console.error('Error performing upsert:', error.message);
            } else {
              console.log('Upsert operation successful:', data);
            }
          }
      
          // Update the like status in the state after the operation
          setIsLiked(newLikedStatus);
        } catch (error) {
          console.error('Error in handleLike:', error.message);
        }
      };

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Widget>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary" fontWeight={500}>
              {selectedPodcast?.title}
            </Typography>
          <CoverImage>
            <img
              alt="can't win - Chilling Sunday"
              src={selectedPodcast?.image}
              
            />
          </CoverImage>
          <Button onClick={() => handleLike(selectedPodcast.id)}>
            {isLiked ? "Unlike" : "Like"}
          </Button>
          <Box sx={{ ml: 1.5, minWidth: 0 }}>

            <Typography noWrap>
              {episode?.title}
            </Typography>
            <Typography noWrap letterSpacing={-0.25}>
              {episode?.description}
            </Typography>
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
      mb: 2,
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
              minWidth: 100,
              whiteSpace: "nowrap",
              overflow: "auto",
              textOverflow: "ellipsis",
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
                Array.isArray(selectedPodcast.seasons[seasonKey].episodes) ? (
                  selectedPodcast.seasons[seasonKey].episodes.map(
                    (episode, episodeIndex) => (
                      <Card
                        key={episodeIndex}
                        onClick={() => handleEpisodeClick(episode)}
                      >
                        <CardContent>
                          Episode {episodeIndex + 1}
                          <Typography variant="subtitle1">
                            {episode.title}
                          </Typography>
                          <Typography variant="body2">
                            {episode.description}
                          </Typography>
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
