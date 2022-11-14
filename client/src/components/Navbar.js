import React, { useState, useContext } from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar'
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Switch from '@mui/material/Switch';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Link from '@mui/material/Link';
import SeachIcon from '@mui/icons-material/Search';
import CollectionsBookmarkRoundedIcon from '@mui/icons-material/CollectionsBookmarkRounded';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { AlertContext } from '../global/alert-context';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.common.white,
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black,
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    },
}));

const MenuWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'flex-end',
    flex: 1,
    [theme.breakpoints.up('sm')]: {
        flex: '2',
    },
}));

const StyledLink = styled(Link)(({ theme }) => ({
    color: theme.palette.common.white
}));

const NavBar = ({ setAppMode, appMode }) => {
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [checked, setChecked] = useState(() => appMode === 'light' ? false : true);
    const menuOpen = Boolean(menuAnchor);
    const navigate = useNavigate();
    const alert = useContext(AlertContext);

    const handleMenuOpen = (e) => {
        setMenuAnchor(e.currentTarget)
    }

    const handleMenuClose = () => {
        setMenuAnchor(null);
    }

    const handleLogout = () => {
        handleMenuClose();
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('userId');
        localStorage.removeItem('email');
        alert.setAlertMessage('Logged out.');
        alert.setAlertSeverity('info');
        alert.toggleAlert(true);
        navigate('/');
    }

    const handleThemeChange = (e) => {
        if(appMode === 'light') {
            setAppMode('dark');
            localStorage.setItem('appmode', 'dark');
            setChecked(true);
        } else {
            setAppMode('light');
            localStorage.setItem('appmode', 'light');
            setChecked(false);
        }
        
    }

    return (
        <AppBar position='sticky'>
            <Toolbar sx={{ display: 'flex', gap: '10px'}}>
                <Box sx={{ display: 'flex', alignItems: 'center' }} flex={{ xs: '1', sm: '2' }} gap={1}>
                    <StyledLink component={RouterLink} to='/'>
                        <CollectionsBookmarkRoundedIcon />
                    </StyledLink>
                    <StyledLink component={RouterLink} to='/' underline='none'>
                        <Typography variant='h6' sx={{ display: { xs: 'none', sm: 'block' } }}>
                            Collection&nbsp;App
                        </Typography>
                    </StyledLink>
                </Box>
                <Box flex={{ xs: '6', sm: '4' }}>
                    <Search>
                        <SearchIconWrapper>
                            <SeachIcon />
                        </SearchIconWrapper>
                        <StyledInputBase 
                            placeholder='Search...'
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>
                </Box>
                <MenuWrapper>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant='h6' sx={{ marginRight: '12px', display: { xs: 'none', sm: 'block' } }}>Menu</Typography>
                                <IconButton
                                    id='menu-button'
                                    size='large'
                                    edge='start'
                                    color='inherit'
                                    aria-label='menu'
                                    onClick={handleMenuOpen}
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={menuAnchor}
                                    open={menuOpen}
                                    onClose={handleMenuClose}
                                    MenuListProps={{
                                        'aria-labelledby': 'menu-button',
                                    }}
                                >
                                    <Link component={RouterLink} to='/' underline='none' color={'text.primary'}>
                                        <MenuItem onClick={handleMenuClose}>
                                            Home
                                        </MenuItem>
                                    </Link>
                                    {!localStorage.getItem('token') && (
                                        <Link component={RouterLink} to='/login' underline='none' color={'text.primary'}>
                                            <MenuItem onClick={handleMenuClose}>
                                                Login
                                            </MenuItem>
                                        </Link>
                                    )}
                                    {!localStorage.getItem('token') && (
                                        <Link component={RouterLink} to='/signup' underline='none' color={'text.primary'}>
                                            <MenuItem onClick={handleMenuClose}>
                                                Sign&nbsp;Up
                                            </MenuItem>
                                        </Link>
                                    )}
                                    {localStorage.getItem('token') && (
                                        <Link component={RouterLink} to={`/${localStorage.getItem('userId')}/collections`} underline='none' color={'text.primary'}>
                                            <MenuItem onClick={handleMenuClose}>
                                                    My&nbsp;Collections
                                            </MenuItem>
                                        </Link>
                                    )}
                                    {localStorage.getItem('isAdmin') === 'true' && (
                                        <Link component={RouterLink} to='/adminpanel' underline='none' color={'text.primary'}>
                                            <MenuItem onClick={handleMenuClose}>
                                                    Admin&nbsp;Panel
                                            </MenuItem>
                                        </Link>
                                    )}
                                    {localStorage.getItem('token') && (
                                        <Link underline='none' color={'text.primary'}>
                                            <MenuItem onClick={handleLogout}>
                                                    Logout
                                            </MenuItem>
                                        </Link>
                                    )}
                                    <MenuItem>
                                        Darkmode 
                                        <Switch color='default' 
                                            onChange={handleThemeChange}
                                            checked={checked}
                                            />
                                    </MenuItem>
                                </Menu>
                            </Box>
                </MenuWrapper>
            </Toolbar>
        </AppBar>
    )
}

export default NavBar;