/**
 * The App component is the main component of the application.
 * It renders the entire application and manages the state of the mode, podcast data, user, and current episode.
 *
 * @return {JSX.Element} The rendered application.
 */

import { NavLink, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import "./styles/App.css";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import { Slide, useScrollTrigger } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import LoginIcon from "@mui/icons-material/Login";

import LightModeIcon from "@mui/icons-material/LightMode";

import Home from "./pages/Home";
import Success from "./pages/Success";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import ErrorPage from "./pages/ErrorPage";
import Likes from "./pages/Likes";

import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

export default function App() {
  const [mode, setMode] = useState("light");
  const [allPodcastData, setPodcastData] = useState([]);
  const [user, setUser] = useState(null);
  const [episode, setEpisode] = useState(null);

  const toggleDarkMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };
  
  useEffect(() => {
    // Apply the mode class to the body element
    document.body.classList.remove("light", "dark");
    document.body.classList.add(mode);
  }, [mode]);

  function HideOnScroll(props) {
    const { children } = props;
    const trigger = useScrollTrigger();

    return (
      <Slide appear={false} direction="up" in={!trigger}>
        {children}
      </Slide>
    );
  }
  const Player = ({ episode }) => (
    <AudioPlayer
      src={episode?.file}
      onPlay={() => console.log("Audio is playing")}
      showSkipControls
      showJumpControls
      layout="horizontal"
      style={{
        width: "100%",
        borderRadius: "10px",

        /* add more styles here */
      }}
      className="custom-audio-player"
    />
  );
  return (
    <div className={`app ${mode}`}>
      <header>
        <AppBar
          position="static"
          className="navbar"
          sx={{ borderRadius: 5, marginBottom: 5 }}
        >
          <Toolbar className="toolbar">
            <NavLink
              to="/home"
              className="nav-link"
              activeclassname="active-link"
              exact
              sx={{ fontSize: { xs: 20, md: 30 } }}
            >
              <HomeIcon />
            </NavLink>

            <NavLink
              to="/login"
              className="nav-link"
              activeclassname="active-link"
              exact
              sx={{ fontSize: { xs: 20, md: 30 } }}
            >
              <LoginIcon />
            </NavLink>

            <IconButton
              onClick={toggleDarkMode}
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <LightModeIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/login"
            element={<Login user={user} setUser={setUser} />}
          />
          <Route
            path="/success"
            element={<Success user={user} setUser={setUser} />}
          />
          <Route
            path="/home"
            element={
              <Home
                user={user}
                allPodcastData={allPodcastData}
                setPodcastData={setPodcastData}
                setUser={setUser}
                setEpisode={setEpisode}
                episode={episode}
              />
            }
          />
          <Route path="/likes/:id" component={Likes} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>

        <footer>
          <HideOnScroll>
            <AppBar
              position="fixed"
              className="bottom-navbar"
              sx={{
                borderRadius: 5,
                zIndex: 1,
                top: "auto",
                bottom: 0,
                maxHeight: 650,
                backgroundColor: "#ffffff",
              }}
            >
              <Toolbar className="bottom-toolbar">
                <Player episode={episode} />
              </Toolbar>
            </AppBar>
          </HideOnScroll>
        </footer>
      </main>
    </div>
  );
}
