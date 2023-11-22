import { useEffect } from "react";
import { Button, Container, Typography, Box, Stack } from "@mui/material";

import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

import logo from "../assets/Devcast-orange.png";



import { SUPABASE_API, SUPABASE_URL } from '../assets/api';




export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_API)
  

export default function Success(props) {
  const navigate = useNavigate();
  const { user, setUser } = props;

  useEffect(() => {
    async function getUserData() {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (data?.user) {
          setUser(data.user);
          console.log("User data:", data.user);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    getUserData();
  }, []); // Removed the extra closing bracket and moved it here

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
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="primary"
          gutterBottom
        >
          welcome, {user.email}
        </Typography>

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
          <Button variant="contained" onClick={() => logout()}>
            Logout
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
