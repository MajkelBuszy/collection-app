import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { Fab } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const DeleteButton = (props) => {
    const navigate = useNavigate();
    const deleteItemHandler = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/${props.target}/${props.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: localStorage.getItem('token')
                })
            })
            const responseData = await response.json();
            if(responseData.error) {
                alert(responseData.error);
                return
            }
            alert(responseData.message);
            navigate(0);
        } catch(err) {
            console.error(err);
        }
    }
    if (props.clickable === 'true') {
        return (
            <Fab variant="extended" color="error" 
            onClick={deleteItemHandler}>
                <DeleteIcon sx={{ mr: 1 }} />
                DELETE&nbsp;{props.text}
            </Fab>
        )
    } else {
        return (
            <Fab variant="extended" disabled>
                <DeleteIcon sx={{ mr: 1 }} />
                DELETE&nbsp;{props.text}
            </Fab>
        )
    }
}

export default DeleteButton;