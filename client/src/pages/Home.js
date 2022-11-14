import React from 'react';
import { Container, Typography, Box } from '@mui/material';

import CollectionList from '../components/CollectionList';
import ItemList from '../components/ItemList';

const Home = () => {

    return (
        <Container maxWidth='xl' sx={{ paddingBottom: '3rem' }}>
            <Typography variant='h4' color={'text.primary'} gutterBottom mt={2} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                Recent Items
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '30px' }}>
                <ItemList />
            </Box>
            <Typography variant='h4' color={'text.primary'} gutterBottom mt={2} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                Biggest Collections
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '30px' }}>
                <CollectionList />
            </Box>
        </Container>
    )
}

export default Home;