import React, { useState, useContext } from 'react';
import { Box, Button, Card, Container, TextField, Typography } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Link from '@mui/material/Link';
import { Formik } from 'formik';

import { AlertContext } from '../global/alert-context';
import { signupSchema, signupFormDefaults } from './FormModels/form-models';

const SignUp = () => {
    const alert = useContext(AlertContext);
    const navigate = useNavigate();

    const handleSubmit = (values) => {
        const signupUser = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                        username: values.username,
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
                <Formik
                    onSubmit={handleSubmit}
                    initialValues={signupFormDefaults}
                    validationSchema={signupSchema}
                >
                    {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
                        <Box component='form' onSubmit={handleSubmit} sx={{ '& > div': {margin: '15px 0 0 0'} }}>
                            <TextField 
                                fullWidth
                                variant='outlined'
                                type='text'
                                label='Username'
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.username}
                                name='username'
                                error={!!touched.username && !!errors.username}
                                helperText={touched.username && errors.username}
                            />
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
                                Sign&nbsp;up
                            </Button>
                        </Box>
                    )}
                </Formik>
                <Link component={RouterLink} to='/login'>
                    <Typography>
                        Already have an account? Login
                    </Typography>
                </Link>
            </Card>
        </Container>
    )
}

export default SignUp;