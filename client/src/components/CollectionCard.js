import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CollectionCard = (props) => {
    const navigate = useNavigate();
    
    const handleCardClick = () => {
        navigate(`/collection/${props.id}`);
    }

    return (
        <Card sx={{ width: '240px', cursor: 'pointer' }} raised onClick={handleCardClick}>
            <CardMedia 
                component='img'
                height='220'
                image={props.image}
                alt={props.alt}
            />
            <CardContent>
                <Typography variant='h5' textAlign='center'>
                    {props.name}
                </Typography>
                <Typography>
                    Author: {props.author}
                </Typography>
                <Typography>
                    Topic: {props.topic}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default CollectionCard;