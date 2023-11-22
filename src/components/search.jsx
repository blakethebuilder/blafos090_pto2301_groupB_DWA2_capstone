import Fuse from "fuse.js";
import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import { Card, Box, Button } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

import genres from "../assets/genres";

export default function Search(props) {
  const { podCastData, setSelectedPodCast, loading, setLoading } = props;
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  const fuse = new Fuse(podCastData, {
    keys: ["title", "description"],
    includeScore: true,
  });

  useEffect(() => {
    const handleSearch = () => {
      setLoading(true);

      if (podCastData) {
        const filteredResults = fuse.search(searchTerm);
        setResults(filteredResults);
      } else {
        setResults([]);
      }

      setLoading(false);
    };

    handleSearch();

    // Cleanup function if needed
    return () => {
      // Any cleanup code goes here
    };
  }, [fuse, searchTerm, setLoading, podCastData]);

  const cards = results.map((result) => (
    <Card
      key={result.item.id}
      variant="outlined"
      onClick={() => setSelectedPodCast(result.item)}
    />
  ));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f5f5f5",
        borderRadius: "50px",
        padding: "20px",
        gap: "20px",
        width: "50%",
        justifyContent: "space-between",
        alignItems: "center",

      }}
    >
      <form noValidate autoComplete="off">
        <TextField
            label="Search"
          variant="filled"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => setSearchTerm("")}>
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
        <TextField
          id="outlined-select-genre"
          select
          label="Select"
          defaultValue=""
          helperText="Please select your genre"
        >
          {Object.entries(genres).map(([key, value]) => (
            <MenuItem key={key} value={value}>
              {value}
            </MenuItem>
          ))}
        </TextField>

        <Button variant="contained">Search</Button>
        {loading ? <p>Loading...</p> : cards}
      </form>
    </Box>
  );
}
