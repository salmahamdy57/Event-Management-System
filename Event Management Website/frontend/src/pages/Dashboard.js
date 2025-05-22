import React from 'react';
import { Container, Typography, Grid } from '@mui/material';
import CreateEvent from '../components/CreateEvent';

const Dashboard = () => {
    return (
        <Container>
            <div>
                <CreateEvent />
            </div>
        </Container>
    );
};

export default Dashboard;