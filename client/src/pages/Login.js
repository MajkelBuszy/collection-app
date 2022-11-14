import { Box, Button, Card, Container, TextField, Typography } from '@mui/material';
import React, { useState, useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Link from '@mui/material/Link';

import { AlertContext } from '../global/alert-context';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const alert = useContext(AlertContext);

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const loginUser = async () => {
            try {
                const url1 = 'https://senior-dev-website-no-joke.herokuapp.com/api/users/login';
                const url2 = 'http://localhost:5000/api/users/login';
                const response = await fetch(url2, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                        email: email,
                        password: password
                    })
                });
                const responseData = await response.json();
                if (responseData.error) {
                    setEmail('');
                    setPassword('');
                    alert.setAlertMessage(responseData.error);
                    alert.setAlertSeverity('error');
                    alert.toggleAlert(true);
                    return;
                }
                setEmail('');
                setPassword('');
                localStorage.setItem('token', responseData.token);
                localStorage.setItem('userId', responseData.userId);
                localStorage.setItem('isAdmin', responseData.isAdmin);
                localStorage.setItem('email', responseData.email);
                alert.setAlertMessage(responseData.message);
                alert.setAlertSeverity('success');
                alert.toggleAlert(true);
                navigate('/');
            } catch(err) {
                console.log(err);
            }
        }
        loginUser();
    }

    return (
        <Container component='main' maxWidth='xs' sx={{ mt: '100px' }}>
            <Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', p: '50px 30px' }} raised>
                <Typography component='h1' variant='h5' color={'text.primary'}>
                    Login
                </Typography>
                <Box component='form' onSubmit={handleSubmit} sx={{ mt: '10px' }}>
                    <TextField 
                        margin='normal'
                        required
                        fullWidth
                        id='email'
                        label="Email"
                        name='email'
                        autoComplete='email'
                        type='text'
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    />
                    <TextField
                        margin='normal'
                        required
                        fullWidth
                        id='password'
                        label="Password"
                        name='password'
                        autoComplete='current-password'
                        type='password'
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />
                    <Button
                        type='submit'
                        variant='contained'
                        fullWidth
                        sx={{ marginTop: '10px', marginBottom: '10px' }}
                    >
                        Login
                    </Button>
                    <Link component={RouterLink} to='/signup'>
                        <Typography>
                            Don't have an account? Sign Up
                        </Typography>
                    </Link>
                </Box>
            </Card>
        </Container>
    )
}

export default Login;