import React, { useState, useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Button, Card, Container, TextField, Typography } from '@mui/material';
import Link from '@mui/material/Link';
import { Formik } from 'formik';

import { AlertContext } from '../global/alert-context';
import { loginSchema, loginFormDefaults } from './FormModels/form-models';

const Login = () => {
    const alert = useContext(AlertContext);
    const navigate = useNavigate();

    const handleSubmit = (values) => {
        const loginUser = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/login`, {
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
                    alert.setAlertMessage(responseData.error);
                    alert.setAlertSeverity('error');
                    alert.toggleAlert(true);
                    return;
                }
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
                    initialValues={loginFormDefaults}
                    validationSchema={loginSchema}
                >
                    {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
                        <Box component='form' onSubmit={handleSubmit} sx={{ '& > div': {margin: '15px 0 0 0'} }}>
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
                                sx={{ marginTop: '25px', marginBottom: '10px' }}
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