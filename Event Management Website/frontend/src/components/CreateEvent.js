import { useState } from "react";
import { TextField, Button, Container, Typography, Box, Grid, InputLabel, MenuItem, Select, FormControl } from "@mui/material";
import { createEvent } from "../services/eventService";
import ErrorBar from "./ErrorBar";
import { useNavigate } from "react-router-dom";

export default function CreateEvent() {
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    location: "",
  });


  function handleSubmit(e){
    e.preventDefault();
    createEvent(eventData)
    .then(() => navigate("/"))
    .catch(() => setError("Something went wrong"));
  }

  function handleChange(e){
    setEventData({
      ...eventData,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <Container maxWidth="sm">
        <ErrorBar error={error} />
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create New Event
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Event Name"
                variant="outlined"
                fullWidth
                name="name"
                value={eventData.name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                name="description"
                value={eventData.description}
                onChange={handleChange}
                required
                multiline
                rows={4}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Date"
                variant="outlined"
                fullWidth
                type="date"
                name="date"
                value={eventData.date}
                onChange={handleChange}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Time"
                variant="outlined"
                fullWidth
                type="time"
                name="time"
                value={eventData.time}
                onChange={handleChange}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Location"
                variant="outlined"
                fullWidth
                name="location"
                value={eventData.location}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" color="primary" fullWidth type="submit">
                Create Event
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
}