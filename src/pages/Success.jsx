import { useEffect } from "react";
import { Button, Container, Typography, Box, Stack } from "@mui/material";

import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

import logo from "../assets/Devcast-orange.png";

import getUserData from "../components/getUserData.js.JS";



import { SUPABASE_API, SUPABASE_URL } from '../assets/api';




export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_API)
  

export default function Success(props) {
  const navigate = useNavigate();
  const { user, setUser } = props;

  useEffect(() => {
    getUserData(setUser);
  }, []); 

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
      sx={{
        pt: 8,
        pb: 6,
      }}
    >
      <Container>


          <h2>Welcome, {user.user_metadata.full_name} !</h2>
       
       <img src={user.user_metadata.avatar_url} alt="Avatar" style={{ borderRadius: "50%", maxWidth: "100%", height: "auto" }} ></img>
            
     


        <img
          className="logo"
          src={logo}
          alt="Devcast Logo"
          style={{ maxWidth: "100%", height: "auto" }}
        />

        <Stack
          sx={{ pt: 4 }}
          direction="row"
          spacing={2}
          justifyContent="center"
        >
          <Button variant="Outlined" onClick={() => logout()}>
            Logout
          </Button>
          <Button variant="Contained" onClick={() => navigate("/Home")}>
            Home
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
