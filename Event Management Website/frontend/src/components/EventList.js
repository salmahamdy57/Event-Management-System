import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, Grid } from '@mui/material';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './EventList.css';
import { deleteEvent, getEvents, rsvpEvent } from '../services/eventService';
import RSVPFeedback from './RSVPFeedback';

const EventList = ({isAdmin}) => {
    const [events, setEvents] = useState([]);
    const [open, setOpen] = useState(false);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        getEvents().then(events => setEvents(events));
    }, [refresh]);

    function handleRSVP(eventId){
        rsvpEvent(eventId).then( () => {setOpen(true); setRefresh(prev => !prev)});
    }

    function handleDelete(eventId){
        deleteEvent(eventId).then(() => setRefresh(prev => !prev));
    }

    if(events.length === 0){
        return (
            <div style={{height: "80vh", display: "flex", justifyContent: "center", alignItems: "center"}}>
                <Card style={{ padding: '20px', textAlign: 'center', width:"50%" }}>
                    <Typography>No Events Found</Typography>
                </Card> 
            </div>
        );
    }

    return (
        <Grid container spacing={3}>
            <RSVPFeedback open={open} handleClose={() => setOpen(false)}/>
            <TransitionGroup component={null}>
                {events.map((event) => (
                    <CSSTransition key={event.id} timeout={500} classNames="fade">
                        <Grid item xs={12} sm={6} md={4}>
                            <Card sx={{ minHeight: 200 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {event.name}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" gutterBottom>
                                        {event.description}
                                    </Typography>
                                    <Typography variant="subtitle2" color="primary">
                                        {event.date.split("T")[0]}
                                    </Typography>
                                    {(!(isAdmin == true) && event.rsvped) &&
                                    <Typography variant="body2" color="primary">
                                        You have RSVPed to this event.
                                    </Typography>}
                                </CardContent>
                                {(!(isAdmin == true) && !event.rsvped) && <Button
                                    variant="contained"
                                    sx={{ m: 2 }}
                                    onClick={() => handleRSVP(event.id)}
                                >
                                    RSVP
                                </Button>}
                                {isAdmin == true && <Button
                                    variant="contained"
                                    style={{backgroundColor: "#b53f4b"}}
                                    sx={{ m: 2 }}
                                    onClick={() => handleDelete(event.id)}
                                >
                                    Delete
                                </Button>}
                            </Card>
                        </Grid>
                    </CSSTransition>
                ))}
            </TransitionGroup>
        </Grid>
    );
};

export default EventList;