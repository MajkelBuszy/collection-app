import * as yup from 'yup';

export const loginSchema = yup.object().shape({
    email: yup.string('Invalid input.').email('Please provide a valid email.').required('Email required.'),
    password: yup.string('Invalid input.').min(6, 'Password must be at least 6 characters long.').required('Password required.')
});

export const signupSchema = yup.object().shape({
    username: yup.string('Invalid input.').min(3, 'Username must be at least 3 characters long.').required('Username required.'),
    email: yup.string('Invalid input.').email('Please provide a valid email.').required('Email required.'),
    password: yup.string('Invalid input.').min(6, 'Password must be at least 6 characters long.').required('Password required.')
});