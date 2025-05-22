import React, { useEffect } from 'react';
import EventList from '../components/EventList';
import { useNavigate } from 'react-router-dom';

const Home = ({isAdmin}) => {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    useEffect(() => {
        if(!token){
           navigate("/login");
        }
    }, []);

    return (
        <div>
            {token && <EventList isAdmin={isAdmin}/>}
        </div>
    );
};

export default Home;