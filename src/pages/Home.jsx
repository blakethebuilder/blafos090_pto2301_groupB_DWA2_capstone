import { useEffect, useState } from "react";
import Chip from "@mui/material/Chip";
import "../styles/App.css";
import "../styles/index.css";
import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import Modal from '@mui/material/Modal';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { styled } from "@mui/material/styles";
import BasicModal from "../components/modal";
import Search from "../components/search";
import getUserData from "../components/getUserData.js.JS";

// Add PropTypes for better documentation
Home.propTypes = {
  podcastData: PropTypes.array,
  user: PropTypes.object,
  setPodcastData: PropTypes.func,
  setUser: PropTypes.func,
};

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

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  color: 'black',
};

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
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
  const { podcastData, user, setPodcastData, setUser } = props;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [value, setValue] = useState(0); // Initialize value state

  useEffect(() => {
    getUserData(setUser);
  }, []);

  useEffect(() => {
    try {
      fetch("https://podcast-api.netlify.app/shows")
        .then((res) => res.json())
        .then((data) => {
          setPodcastData(data);
          console.log(data);
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

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const handlePodcastClick = (pod) => {
    console.log("Podcast clicked:", pod);
    fetchPodcastData(pod.id);
    handleOpen(true);
  };

  const fetchPodcastData = (id) => {
    fetch(`https://podcast-api.netlify.app/id/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setModalData(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching podcast data:", error);
      });
  };

  const a11yProps = (index) => ({
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <h1>Home</h1>
      {user ? (
        <div>
          <Box sx={{ flexGrow: 1, p: 3, backgroundColor: "secondary", justifyContent: "center", alignItems: "center" }}>
            <h2>Welcome, {user.user_metadata.full_name}!</h2>
            <img src={user.user_metadata.avatar_url} alt="Avatar" style={{ borderRadius: "50%", maxWidth: "100%", height: "auto" }} />
          </Box>
         
          <Box sx={{ flexGrow: 1, p: 3, backgroundColor: "#f5f5f9", justifyContent: "center", alignItems: "center" }}>
            <Search
              podcastData={podcastData}
              setPodcastData={setPodcastData}
              setLoading={setLoading}
              loading={loading}
            />
          </Box>

          {error ? (
            <p>{error}</p>
          ) : (
            <>
              <Grid container spacing={5}>
                {podcastData?.map((pod) => (
                  <Grid item xs={8} sm={6} md={2} key={pod.id} sx={{ marginTop: 5, justifyContent: "center", alignItems: "center" }}>
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
              <div>
                {podcastData && modalData && (
                  <Modal
                    open={modalOpen}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style}>
                      {modalData.image && (
                        <img style={{ maxWidth: "50%", height: "auto" }} src={modalData.image} alt={modalData.title} />
                      )}
                      <Typography id="modal-modal-title" variant="h6" component="h2">
                        {modalData.title}
                      </Typography>
                      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {modalData.description}
                      </Typography>
                      {modalData.seasons && modalData.seasons.map((season, seasonIndex) => (
                        <div key={seasonIndex}>
                          <Card index={seasonIndex}>
                            {season.episodes.map((episode, episodeIndex) => (
                              <Chip key={episodeIndex}>
                                {episode.title}
                              </Chip>
                            ))}
                          </Card>
                        </div>
                      ))}
                      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                          {modalData.seasons.map((season, index) => (
                            <div key={index}>
                              <Tab label={`Season ${index + 1}`} {...a11yProps(index)} />
                            </div>
                          ))}
                        </Tabs>
                      </Box>
                    </Box>
                  </Modal>
                )}
              </div>
              <BasicModal modalData={modalData} setModalData={setModalData} modalOpen={modalOpen} setModalOpen={setModalOpen} />
            </>
          )}
        </div>
      ) : (
        <p>Please log in to access the content.</p>
      )}
    </div>
  );
}
