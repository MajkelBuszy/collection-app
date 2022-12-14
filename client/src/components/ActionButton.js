import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ActionButton = (props) => {
    const navigate = useNavigate();

    const actionHandler = async () => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${props.queryType}/${props.userId}`, {
            method: props.method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: localStorage.getItem('token')
            })
        });
        const responseData = await response.json();
        alert(responseData.message);
        if (localStorage.getItem('userId') === props.userId && (props.method === 'DELETE' || props.queryType === 'block')) {
            localStorage.removeItem('token');
            localStorage.removeItem('isAdmin');
            localStorage.removeItem('userId');
            localStorage.removeItem('email');
            navigate('/');
        }
        if (localStorage.getItem('userId') === props.userId && props.queryType === 'revokeadmin' && localStorage.getItem('isAdmin') === 'true') {
            localStorage.removeItem('isAdmin');
            navigate('/');
        }
        navigate(0);
    }

    return (
        <Button onClick={actionHandler}>{props.body}</Button>
    )
}

export default ActionButton;