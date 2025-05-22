import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const RSVPFeedback = ({ open, handleClose }) => {
    return (
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                RSVP Confirmed!
            </Alert>
        </Snackbar>
    );
};

export default RSVPFeedback;