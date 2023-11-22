import { useEffect, useState } from "react";
import Chip from "@mui/material/Chip";
import "../styles/App.css";
import "../styles/index.css";
import { SupabaseClient } from "@supabase/supabase-js";

import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

import BasicModal from "../components/modal";

import Search from "../components/search";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 450,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

export default function Home(props) {
  const { podcastData, user, setPodcastData } = props;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check Supabase authentication state here and update setUser accordingly
  }, []); // Dependency array depends on how you handle authentication state in your app

  useEffect(() => {
    fetch("https://podcast-api.netlify.app/shows")
      .then((res) => res.json())
      .then((data) => {
        setPodcastData(data);
        console.log(data); // Log the updated state
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching podcast data:", error);
        setError("Error fetching podcast data. Please try again later.");
        setLoading(false);
      });
  }, [setPodcastData]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const handlePodcastClick = (pod) => {
    console.log("Podcast clicked:", pod);
    // Handle podcast click logic he
  };

  return (
    <div sx={{ flexGrow: 1, p: 3, backgroundColor: "#f5f5f9", justifyContent: "center", alignItems: "center" }}>
      <h1>Home</h1>
      {user ? (
        <div>
          <p>Welcome,{user.email} !</p>
          <Search
            podcastData={podcastData}
            setPodcastData={setPodcastData}
            setLoading={setLoading}
            loading={loading}
          />
          {error ? (
            <p>{error}</p>
          ) : (
            <>
              <Grid container spacing={5} >
                {podcastData?.map((pod) => (
                  <Grid item xs={2} sm={3} md={2} key={pod.id} sx={{ marginTop: 5 }}>
                    <HtmlTooltip
                      title={
                        <Typography variant="body2" color="text.secondary">
                          {pod.description}
                        </Typography>
                      }
                    >
                      <Card
                        onClick={() => {
                          handlePodcastClick(pod);
                        }}
                        sx={{
                          width: 300,
                          height: 300,
                          borderRadius: 5,
                          backgroundImage: `url(${pod.image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          backgroundRepeat: "no-repeat",
                          cursor: "pointer",
                          transition: "transform 0.3s",
                          "&:hover": {
                            transform: "scale(1.15)",
                          },
                        }}
                      >
                        <CardContent sx={{ textAlign: "center" }}>
                          <Typography
                            sx={{
                              color: "primary",
                              backgroundColor: "primary",
                            }}
                          >
                            <h2>{pod.title}</h2>
                          </Typography>

                          <div>
                            <Chip
                              label={`Seasons: ${pod.seasons}`}
                              className="seasons"
                              color="primary"
                            />
                            <div></div>
                            <h4>Last Upload:</h4>
                            <Chip
                              label={new Date(pod.updated).toLocaleString([], {
                                hour: "numeric",
                                hour12: true,
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                              className="seasons"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </HtmlTooltip>
                  </Grid>
                ))}
              </Grid>
              <BasicModal />
            </>
          )}
        </div>
      ) : (
        <p>Please log in to access the content.</p>
      )}
    </div>
  );
}
