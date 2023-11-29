import { NavLink, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import "./styles/App.css";
import "./styles/index.css";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import { Slide, useScrollTrigger } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';

import LightModeIcon from "@mui/icons-material/LightMode";

import Fab from "@mui/material/Fab";
import { styled } from "@mui/system";
import logo from "./assets/Devcast-white.png";

import Home from "./pages/Home";
import Success from "./pages/Success";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import ErrorPage from "./pages/ErrorPage";


import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

export default function App() {
  const [mode, setMode] = useState("light");
  const [allPodcastData, setPodcastData] = useState([]);
  const [user, setUser] = useState(null);
  const [episode, setEpisode] = useState(null);

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    // Any global initialization logic can be placed here
  }, []);

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

      style={{
        maxWidth: "100%",
        width: "100%",
        height: "auto",
      }}
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
              activeClassName="active-link"
              exact
            >
            <HomeIcon />
            </NavLink>

            <NavLink
              to="/login"
              className="nav-link"
              activeClassName="active-link"
              exact
            >
              <LoginIcon/>
            </NavLink>

            <IconButton
              onClick={toggleMode}
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
          <Route path="*" element={<ErrorPage />} />
        </Routes>

        <footer>
          <HideOnScroll>
            <AppBar
              position="fixed"
              className="navbar"
              sx={{
                borderRadius: 5,
                zIndex: 1,
                top: "auto",
                bottom: 0,
                maxHeight: 60,
              }}
            >
              <Toolbar className="toolbar">
                <img src={logo} alt="devcast-logo" className="logo" />

                        <Player episode={episode} />
              </Toolbar>
            </AppBar>
          </HideOnScroll>
          ); 
        </footer>
      </main>
    </div>
  );
}
