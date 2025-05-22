import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { register } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import ErrorBar from '../components/ErrorBar';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfimrPass] = useState('');
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
            if(!username){
              setError("Username field is required!");
              return;
            }

            if(username.length < 3){
              setError("Username field must be at least 3 characters");
              return;
            }

            if(!password){
              setError("Password field is required!");
              return;
            }

            if(password.length < 8){
              setError("Password must be at least 8 characters long!");
              return;
            }

            let numberCount = Array
              .from(password)
              .reduce((count, value) => value >= '0' && value <= '9' ? count + 1 : count, 0);

            if(numberCount < 3){
              setError("Password must have at least 3 numbers");
              return;
            }

            if(password !== confirmPass){
              setError("Passwords don't match!");
              return;
            }

        try {
            await register(username, email, password);
            navigate('/login');
        } catch (err) {
            setError("Registration failed.");
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 5 }}>
            <ErrorBar error={error} setError={setError} />
            <Typography variant="h5" gutterBottom>Register</Typography>
            <form onSubmit={handleSubmit}>
                <TextField 
                    fullWidth 
                    id="username"
                    label="Username" 
                    variant="outlined" 
                    margin="normal" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                />
                <TextField 
                    fullWidth 
                    label="Email" 
                    id="email"
                    variant="outlined" 
                    margin="normal" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                />
                <TextField 
                    fullWidth 
                    id="password"
                    label="Password" 
                    variant="outlined" 
                    margin="normal" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <TextField 
                    fullWidth 
                    label="Confirm Password" 
                    id="confirmPassword"
                    variant="outlined" 
                    margin="normal" 
                    type="password" 
                    value={confirmPass} 
                    onChange={(e) => setConfimrPass(e.target.value)} 
                />
                <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                    Register
                </Button>
            </form>
        </Container>
    );
};

export default Register;