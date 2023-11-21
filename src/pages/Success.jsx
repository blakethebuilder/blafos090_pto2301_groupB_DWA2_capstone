import { useEffect } from "react";
import { Button, Container, Typography, Box, Stack } from "@mui/material";


import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { SUPABASE_URL, SUPABASE_API } from "../assets/api";
import logo from "../assets/Devcast-orange.png";

import supabase from "./Login"


export default function Success(props) {
  const navigate = useNavigate();
  const { user, setUser } = props;

    useEffect(() => {
      async function getUserData() {
        await supabase.auth.getUser().then((value) => {
          if(value.data?.user) {
            setUser(value.data.user);
          }
        }) 
      }
      getUserData();
    }, []);

    async function logout() {
      const { error } =  await supabase.auth.signOut();
      navigate("/login");                                                                                                  
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

        <Stack sx={{ pt: 4 }} direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" onClick={() => logout()}>
            Logout
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
