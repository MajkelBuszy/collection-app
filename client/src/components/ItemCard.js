import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ItemCard = (props) => {
    const navigate = useNavigate();

    const handleItemClick = () => {
        navigate(`/item/${props.id}`);
    }

    return (
        <Card sx={{ width: '240px', cursor: 'pointer' }} raised onClick={handleItemClick}>
            <CardMedia 
                sx={{ borderRadius: '50%', width: '200px', height: '200px', margin: '10px auto 0 auto' }}
                component='img'
                image={props.image}
                alt={props.alt}
            />
            <CardContent>
                <Typography variant='h5' textAlign='center' gutterBottom>
                    {props.name}
                </Typography>
                <Typography>
                    Collection: {props.collection}
                </Typography>
                <Typography gutterBottom>
                    Author: {props.author}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default ItemCard;