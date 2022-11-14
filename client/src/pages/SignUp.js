import React, { useState, useContext } from 'react';
import { Box, Button, Card, Container, TextField, Typography } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Link from '@mui/material/Link';

import { AlertContext } from '../global/alert-context';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const alert = useContext(AlertContext);

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const signupUser = async () => {
            try {
                const url1 = 'https://senior-dev-website-no-joke.herokuapp.com/api/users/signup';
                const url2 = 'http://localhost:5000/api/users/signup';
                const response = await fetch(url2, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                        username: name,
                        email: email,
                        password: password
                    })
                });
                const responseData = await response.json();
                if (responseData.error) {
                    alert.setAlertMessage(responseData.error);
                    alert.setAlertSeverity('error');
                    alert.toggleAlert(true);
                    return;
                }
                setName('');
                setEmail('');
                setPassword('');
                alert.setAlertMessage(responseData.message);
                alert.setAlertSeverity('success');
                alert.toggleAlert(true);
                navigate('/login');
            } catch(err) {
                console.log(err);
            }
        }
        signupUser();
    }

    return (
        <Container component='main' maxWidth='xs' sx={{ marginTop: '100px' }}>
            <Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: '50px 30px' }} raised>
                <Typography component='h1' variant='h5' color={'text.primary'}>
                    Sign Up
                </Typography>
                <Box component='form' onSubmit={handleSubmit} sx={{ marginTop: '10px' }}>
                    <TextField 
                        margin='normal'
                        required
                        fullWidth
                        label="Username"
                        type='text'
                        autoComplete='off'
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                    />
                    <TextField 
                        margin='normal'
                        required
                        fullWidth
                        label="Email"
                        autoComplete='email'
                        type='email'
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    />
                    <TextField
                        margin='normal'
                        required
                        fullWidth
                        label="Password"
                        autoComplete='new-password'
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
                        Sign Up
                    </Button>
                    <Link component={RouterLink} to='/login'>
                        <Typography>
                            Already have an account? Login
                        </Typography>
                    </Link>
                </Box>
            </Card>
        </Container>
    )
}

export default SignUp;