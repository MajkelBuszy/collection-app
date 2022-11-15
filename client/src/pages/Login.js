import React, { useState, useContext } from 'react';
import * as yup from 'yup';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Button, Card, Container, TextField, Typography } from '@mui/material';
import Link from '@mui/material/Link';
import { Formik } from 'formik';

import { AlertContext } from '../global/alert-context';
import { loginSchema } from './FormModels/form-models';
import { margin } from '@mui/system';

const formValues = {
    email: '',
    password: ''
}

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const alert = useContext(AlertContext);
    const navigate = useNavigate();

    const handleSubmit = (values) => {
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
                        email: values.email,
                        password: values.password
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
            <Card sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    flexDirection: 'column', 
                    p: '50px 30px'
                }}
                raised
            >
                <Typography gutterBottom component='h1' variant='h5' color={'text.primary'}>
                    Login
                </Typography>
                <Formik
                    onSubmit={handleSubmit}
                    initialValues={formValues}
                    validationSchema={loginSchema}
                >
                    {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
                        <Box component='form' onSubmit={handleSubmit} sx={{ '& > div': {margin: '15px 0'} }}>
                            <TextField 
                                fullWidth
                                variant='outlined'
                                type='email'
                                label='Email'
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.email}
                                name='email'
                                error={!!touched.email && !!errors.email}
                                helperText={touched.email && errors.email}
                            />
                            <TextField 
                                fullWidth
                                variant='outlined'
                                type='password'
                                label='Password'
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.password}
                                name='password'
                                error={!!touched.password && !!errors.password}
                                helperText={touched.password && errors.password}
                            />
                            <Button
                                type='submit'
                                variant='contained'
                                fullWidth
                                sx={{ marginTop: '10px', marginBottom: '10px' }}
                            >
                                Login
                            </Button>
                        </Box>
                    )}
                </Formik>
                <Link component={RouterLink} to='/signup'>
                    <Typography>
                        Don't have an account? Sign Up
                    </Typography>
                </Link>
            </Card>
        </Container>
    )
}

export default Login;