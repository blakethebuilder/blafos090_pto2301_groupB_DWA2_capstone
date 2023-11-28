import Fuse from "fuse.js";
import { useState, useEffect, useMemo } from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import { Card, Box, Button, Typography, Grid, Chip } from "@mui/material";
import genres from "../assets/genres";

import { Select, MenuItem } from "@mui/material";

export default function Search(props) {
  const { allPodcastData, setSelectedPodcast, loading, setLoading } = props;
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState("");

  const [sortOption, setSortOption] = useState("");

  const fuse = useMemo(
    () =>
      new Fuse(allPodcastData || [], {
        keys: ["title", "description"],
        includeScore: true,
      }),
    [allPodcastData]
  );

  const handleSort = (option) => {
    setSortOption(option);

    // Handle sorting based on the selected option
    const sortedResults = [...results]; // Create a copy to avoid mutating the original array

    switch (option) {
      case "titleAsc":
        sortedResults.sort((a, b) => a.item.title.localeCompare(b.item.title));
        break;
      case "titleDesc":
        sortedResults.sort((a, b) => b.item.title.localeCompare(a.item.title));
        break;
      case "dateAsc":
        sortedResults.sort(
          (a, b) => new Date(a.item.updated) - new Date(b.item.updated)
        );
        break;
      case "dateDesc":
        sortedResults.sort(
          (a, b) => new Date(b.item.updated) - new Date(a.item.updated)
        );
        break;
      default:
        break;
    }

    setResults(sortedResults);
  };

  useEffect(() => {
    const handleSearch = async () => {
      setLoading(true);

      try {
        if (allPodcastData) {
          const filteredResults = fuse.search(searchTerm);
          setResults(filteredResults);
          console.log(`Search results:`, filteredResults);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error(`Error during search: ${error.message}`);
        setError("Error during search. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    handleSearch();
  }, [allPodcastData, searchTerm, fuse, setLoading]);


  const fetchPodcastData = (id) => {
    setLoading(true);
    fetch(`https://podcast-api.netlify.app/id/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSelectedPodcast(data);
        console.log(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching podcast data:", error);
        setLoading(false);
      });
  };


  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
    // You can add additional functionality here if needed
  };

  const handleSearchButtonClick = () => {
    // Use fuse to perform the search
    if (allPodcastData) {
      const filteredResults = fuse.search(searchTerm);
      setResults(filteredResults);
      console.log(filteredResults);
    }
  };

  const PodcastCard = ({ item }) => {
    return (
      <Card
        key={item.id}
        variant="outlined"
        onClick={() => {
          fetchPodcastData(item.id);  
        }}
        sx={{ cursor: "pointer" }}
      >
        <Box p={2}>
          <img src={item.image} alt={item.title} width="50%" />
          <Typography variant="h6">{item.title}</Typography>
          <Typography variant="body2">
            {item.description.length > 100
              ? `${item.description.slice(0, 100)}...`
              : item.description}
          </Typography>
          <Chip
            label={`Seasons: ${item.seasons}`}
            className="seasons"
            color="primary"
          />
          <h4>Last Upload:</h4>
          <Chip
            variant="filled"
            color="secondary"
            label={new Date(item.updated).toLocaleString([], {
              hour: "numeric",
              hour12: true,
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
            className="seasons"
          />
        </Box>
      </Card>
    );
  };

  const cardGrid = (cardsArray) => (
    <Grid container spacing={3}>
      {cardsArray.map((card) => (
        <Grid item key={card.key} xs={12} sm={6} md={4} lg={3}>
          {card}
        </Grid>
      ))}
    </Grid>
  );

  const cardsGrid = cardGrid(
    results.map((result) => (
      <PodcastCard key={result.item.id} item={result.item} />
    ))
  );

  const allCardsGrid = cardGrid(
    allPodcastData.map((item) => <PodcastCard key={item.id} item={item} />)
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f5f5f5",
        borderRadius: "50px",
        padding: "20px",
        gap: "20px",
        width: "80%",
        margin: "auto",
      }}
    >
      <form id="search-form" noValidate autoComplete="off">
        <TextField
          sx={{
            width: "100%",
            mb: 5,
          }}
          label="Search"
          variant="filled"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.keyCode === 13) {
              e.preventDefault();
            }
          }}
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => setSearchTerm("")}>
                <SearchIcon />
              </IconButton>
            ),
          }}
        />

        <Box>
          <Box 
          sx={{ display: "flex", flexDirection: "flex", alignItems: "center", justifyContent: "center", gap: "20px" }}>
            <Button
              sx={{ m: 3 }}
              variant="contained"
              onClick={handleSearchButtonClick}
            >
              Search
            </Button>
            <Typography variant="h6">Sort by:</Typography>
            <Select
              value={sortOption}
              onChange={(e) => handleSort(e.target.value)}
              variant="standard"
            >
              <MenuItem value="titleAsc">A-Z</MenuItem>
              <MenuItem value="titleDesc">Z-A</MenuItem>
              <MenuItem value="dateAsc">Date Asc</MenuItem>
              <MenuItem value="dateDesc">Date Desc</MenuItem>
            </Select>
          </Box>
        </Box>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : searchTerm ? (
          cardsGrid
        ) : (
          allCardsGrid
        )}
      </form>
    </Box>
  );
}
