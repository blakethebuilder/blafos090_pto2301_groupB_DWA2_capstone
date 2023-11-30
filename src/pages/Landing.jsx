/**
 * Renders the Landing component.
 *
 * @return {JSX.Element} The rendered Landing component.
 */

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";

import logo from "../assets/Devcast-orange.png";

import Carousel from "../components/carousel";


export default function Landing() {
  return (
    <Box
      sx={{
        pt: 2,
        pb: 1,
      }}
    >
      <Container maxWidth="md">
        <Typography component="h1" variant="h3" align="center" color="primary">
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
        <Carousel />
        <Stack
          sx={{ pt: 2, mb: 3 }}
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
