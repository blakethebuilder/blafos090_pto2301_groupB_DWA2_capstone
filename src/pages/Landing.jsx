import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";


import logo from "../assets/Devcast-orange.png";

export default function Landing() {
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
          Welcome to
        </Typography>
     
        {
          <img
            className="logo"
            src={logo}
            alt="Devcast Logo"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        }

        <Typography variant="h6" align="center"  paragraph>
          Join me, Blake Foster (aka BLAFOS090), as we embark on a journey
          through the latest in technology and software development. As part of
          PTO2301-B at CodeSpace, this podcast app serves as the capstone
          project for the Software Development Bootcamp. Together, let's explore
          the cutting-edge world of React and navigate the dynamic landscape of
          coding.
        </Typography>
        <Stack
          sx={{ pt: 4 }}
          direction="row"
          spacing={2}
          justifyContent="center"
        >
          <Link to="/login">
            <Button variant="contained">Login</Button>
          </Link>
          <Link to="/signup">
            <Button variant="outlined">Sign Up</Button>
          </Link>
        </Stack>
      </Container>
    </Box>
  );
}
