import React, { useEffect, useState, useContext } from 'react';
import { Box, Container, Typography, Fab, Modal, TextField, Button, Autocomplete, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CollectionCard from '../components/CollectionCard';
import { useParams, useNavigate } from 'react-router-dom';

import { AlertContext } from '../global/alert-context';

const collectionTopics = ['Lifestyle', 'Education', 'Games'];

const UserCollectionPage = () => {
    const [openCreateCollectionModal, setOpenCreateCollectionModal] = useState(false);
    const [collections, setCollections] = useState([]);
    const [collectionName, setCollectionName] = useState('');
    const [collectionTopic, setCollectionTopic] = useState('');
    const [collectionDescription, setCollectionDescription] = useState('');
    const [collectionImage, setCollectionImage] = useState('');
    const { uid } = useParams();
    const navigate = useNavigate();
    const alert = useContext(AlertContext);

    const handleModalOpen = () => {
        setOpenCreateCollectionModal(true);
    }
    const handleModalClose = () => {
        setOpenCreateCollectionModal(false);
    }

    const getCollections = async () => {
        try {
            const url1 = `https://senior-dev-website-no-joke.herokuapp.com/api/collections/user/${uid}`;
            const url2 = `http://localhost:5000/api/collections/user/${uid}`;
            const response = await fetch(url2, {
                method: 'GET'
            });
            const responseData = await response.json();
            if(responseData.error) {
                alert.setAlertMessage(responseData.error);
                alert.setAlertSeverity('error');
                alert.toggleAlert(true);
                setTimeout(() => {
                    navigate('/');
                }, 1500)
                return;
            }
            const collections = responseData.collections;
            setCollections(collections);
        } catch(err) {
            console.error(err);
        }
    }

    useEffect(() => {
        getCollections();
    }, []);

    const handleCreateCollectionForm = (e) => {
        e.preventDefault();
        const createCollection = async () => {
            const url1 = `https://senior-dev-website-no-joke.herokuapp.com/api/collections/`;
            const url2 = `http://localhost:5000/api/collections/`;
            try {
                const response = await fetch(url2, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                           name: collectionName,
                           description: collectionDescription,
                           topic: collectionTopic,
                           creator: uid,
                           image: collectionImage
                        })
                    });
                const responseData = await response.json();
                if(responseData.error) {
                    alert.setAlertMessage(responseData.error);
                    alert.setAlertSeverity('error');
                    alert.toggleAlert(true);
                    return
                }
                handleModalClose();
                setCollectionName('');
                setCollectionTopic('');
                setCollectionDescription('');
                setCollectionImage('');
                alert.setAlertMessage(responseData.message);
                alert.setAlertSeverity('success');
                alert.toggleAlert(true);
            } catch(err) {
                console.error(err);
            }
        }
        createCollection();
        setTimeout(getCollections, 1000);
    }

    return (
        <>
            {collections.length === 0 ? (
                <CircularProgress sx={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)' 
                }} />
            ) : (
                <Container maxWidth='xl'>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' } }} mt={3}>
                        <Box flex={1}>
                            <Typography variant='h4' color='text.primary' sx={{ mb: { xs: '1rem', sm: '0' } }}>
                                {}Collections
                            </Typography>
                        </Box>
                        <Box sx={{ justifySelf: 'end' }}>
                            {(localStorage.getItem('isAdmin') === 'true' || localStorage.getItem('userid') === uid) && (
                                <Fab variant="extended" color="primary" 
                                onClick={handleModalOpen}>
                                    <AddIcon sx={{ mr: 1 }} />
                                    New&nbsp;Collection
                                </Fab>
                            )}
                        </Box>
                        <Modal
                            open={openCreateCollectionModal}
                            onClose={handleModalClose}
                            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >
                            <Box width={400} bgcolor={'background.default'} p={3} color='text.primary' borderRadius={5}>
                                <Typography variant='h5' component='h2' textAlign='center' gutterBottom>
                                    Add&nbsp;Item
                                </Typography>
                                <Box component='form' onSubmit={handleCreateCollectionForm} sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <TextField variant='filled' label='Collection name' onChange={e => setCollectionName(e.target.value)} value={collectionName}/>
                                    <TextField multiline rows={3} variant='filled' onChange={e => setCollectionDescription(e.target.value)} label='Description' value={collectionDescription}/>
                                    <Autocomplete
                                        disablePortal
                                        inputValue={collectionTopic}
                                        onInputChange={(event, newValue) => setCollectionTopic(newValue)}
                                        options={collectionTopics}
                                        sx={{ width: 300 }}
                                        renderInput={(params) => <TextField {...params} variant='filled' label="Topic" />}
                                    />
                                    <TextField variant='filled' label='Image URL' onChange={e => setCollectionImage(e.target.value)} value={collectionImage} />
                                    <Button variant='contained' type='submit'>CREATE</Button>
                                </Box>
                            </Box>
                        </Modal>
                    </Box>
                    <Container maxWidth='xl' sx={{ display: 'flex', flexWrap: 'wrap', gap: '50px 30px', justifyContent: 'center', padding: '2rem 1rem 3rem 1rem' }}>
                        {collections !== undefined && collections.map(collection => (
                            <CollectionCard
                                key={collection._id}
                                image={collection.image}
                                author={collection.creator.username}
                                topic={collection.topic}
                                name={collection.name}
                                alt={collection.name}
                                id={collection._id}
                            />
                        ))}
                    </Container>
                </Container>
            )}
        </>
    )
}

export default UserCollectionPage;