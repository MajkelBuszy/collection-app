import React, { useEffect, useState, useContext } from 'react';
import { Container, Box, Typography, Table, TableHead, TableRow, TableCell, Fab, Modal, TextField, Button, TableBody, MenuItem, OutlinedInput, Select, InputLabel, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useParams, useNavigate } from 'react-router-dom';

import DeleteButton from '../components/DeleteButton';
import { AlertContext } from '../global/alert-context';

const tagList = ['Cars', 'Food', 'Drinks', 'Logic'];

const CollectionPage = () => {
    const [openAddItemModal, setOpenAddItemModal] = useState(false);
    const [itemName, setItemName] = useState('');
    const [itemImage, setItemImage] = useState('');
    const [itemTags, setItemTags] = useState([]);
    const [description, setDescription] = useState('');
    const [collection, setCollection] = useState(null);
    const { cid } = useParams();
    const navigate = useNavigate();
    const alert = useContext(AlertContext);

    const handleModalOpen = () => setOpenAddItemModal(true);
    const handleModalClose = () => setOpenAddItemModal(false);

    const handleTagChange = (e) => {
        const {
            target: { value },
        } = e;
        setItemTags(
            typeof value === 'string' ? value.split(',') : value,
        );
    }

    useEffect(() => {
        const fetchCollection = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/collections/${cid}`, {
                    method: 'GET'
                });
                const responseData = await response.json();
                if(responseData.error) {
                    alert.setAlertMessage(responseData.error);
                    alert.setAlertSeverity('error');
                    alert.toggleAlert(true);
                    setTimeout(() => {
                        navigate('/')
                    }, 1500);
                    return;
                }
                setCollection(responseData.collection);
            } catch(err) {
                console.error(err);
            }
        }
        fetchCollection();
    }, []);

    const handleAddItemForm = (e) => {
        e.preventDefault();
        const createItem = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/items/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: itemName,
                        image: itemImage,
                        description: description,
                        tags: itemTags,
                        origin: cid,
                        author: collection?.creator
                    })
                })
                const responseData = await response.json();
                if(responseData.error) {
                    alert(responseData.error);
                    return
                }
                setItemName('');
                setItemImage('');
                setItemTags([]);
                setDescription('');
                alert(responseData.message);
                handleModalClose();
                navigate(0);
            } catch(err) {
                console.error(err);
            }
        }
        createItem();
    }

    return (
        <>
            {collection === null ? (
                <CircularProgress sx={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)' 
                }} />
            ) : (
                <Container maxWidth='xl' sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', mt: '2rem' }}>
                        <Typography color='text.primary' variant='h4' component='h1' textAlign='center' gutterBottom>{collection?.name}</Typography>
                        <Typography color='text.primary' variant='h5' textAlign='center' gutterBottom>{collection?.topic}</Typography>
                        {(localStorage.getItem('isAdmin') === 'true' || localStorage.getItem('userId') === collection?.creator) && (
                            <Fab variant="extended" color="primary" sx={{ maxWidth: '150px', alignSelf: 'end', m: '1rem' }} onClick={handleModalOpen}>
                                <AddIcon sx={{ mr: 1 }} />
                                Add&nbsp;Item
                            </Fab>
                        )}
                        <Modal
                            open={openAddItemModal}
                            onClose={handleModalClose}
                            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >
                            <Box width={300} bgcolor={'background.default'} p={3} color='text.primary' borderRadius={5}>
                                <Typography variant='h5' component='h2' textAlign='center' gutterBottom>
                                    Add&nbsp;Item
                                </Typography>
                                <Box component='form' onSubmit={handleAddItemForm} sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <TextField variant='filled' label='Item name' onChange={e => setItemName(e.target.value)} value={itemName} />
                                    <TextField multiline rows={3} variant='filled' onChange={e => setDescription(e.target.value)} label='Description' value={description}/>
                                    <TextField variant='filled' label='Image URL' onChange={e => setItemImage(e.target.value)} value={itemImage} />
                                    <InputLabel id="demo-multiple-chip-label">Tags</InputLabel>
                                    <Select
                                    variant='filled'
                                    label='Tags'
                                    multiple
                                    value={itemTags}
                                    onChange={handleTagChange}
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
                                    <Button variant='contained' type='submit'>ADD</Button>
                                </Box>
                            </Box>
                        </Modal>
                    </Box>
                    <Table sx={{ textTransform: 'uppercase' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Image</TableCell>
                                <TableCell>Item&nbsp;Name</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {collection?.items !== undefined && collection.items.map(item => (
                                <TableRow hover key={item._id}>
                                    <TableCell>
                                        <Box component='img' maxWidth={200} src={item.image} alt={item.name} />
                                    </TableCell>
                                    <TableCell>
                                        {item.name}
                                    </TableCell>
                                    <TableCell>
                                        {item.description}
                                    </TableCell>
                                    <TableCell>
                                        {(localStorage.getItem('isAdmin') === 'true' || localStorage.getItem('userId') === collection?.creator) ? (
                                            <DeleteButton text='ITEM' clickable='false'/>
                                        ) : (
                                            <DeleteButton text='ITEM' clickable='false' />
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Container>
            )}
        </>
    )
}

export default CollectionPage;