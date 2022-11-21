import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Accordion, Fab, AccordionDetails, AccordionSummary, Box, Chip, Container, Typography, CircularProgress, Card, CardMedia, CardContent, Button, Modal, TextField, Select, OutlinedInput, MenuItem, InputLabel } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

import { AlertContext } from '../global/alert-context';

const tagList = ['Cars', 'Food', 'Drinks', 'Logic'];

const ItemPage = () => {
    const [openEditItem, setOpenEditItem] = useState(false);
    const [item, setItem] = useState(null);
    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState('');
    const [itemImage, setItemImage] = useState('');
    const [itemTags, setItemTags] = useState([]);
    const { itemid } = useParams();
    const alert = useContext(AlertContext);
    const navigate = useNavigate();

    const fetchItem = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/items/${itemid}`, {
                method: 'GET'
            });
            const responseData = await response.json();
            if (responseData.error) {
                alert.setAlertMessage('Could not find item.');
                alert.setAlertSeverity('error');
                alert.toggleAlert(true);
                setTimeout(() => {
                    navigate('/');
                }, 1500)
                return;
            }
            const itemData = responseData.item;
            setItem(itemData);
        } catch(err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchItem();
    }, []);

    const handleTagChange = (e) => {
        const {
            target: { value },
        } = e;
        setItemTags(
            typeof value === 'string' ? value.split(',') : value,
        );
    }

    const handleModalOpen = () => {
        setItemName(item?.name);
        setItemImage(item?.image);
        setItemTags(item?.tags);
        setDescription(item?.description);
        setOpenEditItem(true);
    }

    const handleModalClose = () => {
        setOpenEditItem(false);
        setItemName('');
        setItemImage('');
        setItemTags([]);
        setDescription('');
    }

    const handleEditItem = (e) => {
        e.preventDefault();
        const editItem = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/items/${itemid}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: itemName,
                        image: itemImage,
                        description: description,
                        tags: itemTags
                    })
                })
                const responseData = await response.json();
                if(responseData.error) {
                    alert.setAlertMessage(responseData.error);
                    alert.setAlertSeverity('error');
                    alert.toggleAlert(true);
                    return;
                }
                handleModalClose();
                setItemName('');
                setItemImage('');
                setItemTags([]);
                setDescription('');
                alert.setAlertMessage(responseData.message);
                alert.setAlertSeverity('success');
                alert.toggleAlert(true);
            } catch(err) {
                console.error(err);
            }
        }
        editItem();
        setTimeout(fetchItem, 1000);
    }
    
    return (
        <>
            {item === null ? (
                <CircularProgress sx={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)' 
                }} />
            ) : (
                <Container sx={{ paddingBottom: '3rem', mt: '2rem' }}>
                    <Card sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', flexWrap: 'wrap', overflowX: 'hidden', justifyContent: 'center' }} raised>
                        <CardMedia 
                            component='img'
                            sx={{ flex: '1', maxWidth: '500px' }}
                            image={item?.image}
                            alt={item?.name}
                        />
                        <Box sx={{ display: 'flex', flex: '2', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                <Typography variant='h4' component='h1' color='text.primary' mt={4}>
                                    {item?.name}
                                </Typography>
                                <Typography variant='h6'>
                                    Author: {item?.author?.username}
                                </Typography>
                                <Typography variant='h6' gutterBottom>
                                    Collection:&nbsp;{item?.origin?.name}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: '10px', mb: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                                    {item?.tags !== undefined && item.tags.map(tag => (
                                        <Chip key={tag} label={tag} />
                                    ))}
                                </Box>
                                {(localStorage.getItem('isAdmin') === 'true' || item?.author._id === localStorage.getItem('userId')) && (
                                    <Fab variant="extended" color="primary" sx={{ mb: '1rem' }}onClick={handleModalOpen}>
                                        <EditIcon sx={{ mr: 1 }} />Edit
                                    </Fab>
                                )}
                            </CardContent>
                        </Box>
                        
                    </Card>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                        >
                            <Typography>
                                Description
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                {item?.description}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Modal
                        open={openEditItem}
                        onClose={handleModalClose}
                        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                        <Box width={300} bgcolor={'background.default'} p={3} color='text.primary' borderRadius={5}>
                            <Typography variant='h5' component='h2' textAlign='center' gutterBottom>
                                Edit&nbsp;Item
                            </Typography>
                            <Box component='form' onSubmit={handleEditItem} sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <TextField 
                                    variant='filled' 
                                    label='Item name' 
                                    onChange={e => setItemName(e.target.value)} 
                                    value={itemName} 
                                />
                                <TextField 
                                    multiline 
                                    rows={3} 
                                    variant='filled' 
                                    onChange={e => setDescription(e.target.value)} label='Description' 
                                    value={description}/>
                                <TextField 
                                    variant='filled'
                                    label='Image URL'
                                    onChange={e => setItemImage(e.target.value)}
                                    value={itemImage} 
                                />
                                <InputLabel>Tags</InputLabel>
                                <Select
                                    variant='filled'
                                    label='Tags'
                                    multiple
                                    value={itemTags}
                                    onChange={handleTagChange}
                                    defaultValue={item?.tags}
                                    input={<OutlinedInput />}
                                >
                                {tagList.map((name) => (
                                    <MenuItem
                                    key={name}
                                    value={name}
                                    >
                                    {name}
                                    </MenuItem>
                                ))}
                                </Select>
                                <Button variant='contained' type='submit'>EDIT</Button>
                            </Box>
                        </Box>
                    </Modal>
                </Container>
            )}
        </>
        
    )
}

export default ItemPage;
