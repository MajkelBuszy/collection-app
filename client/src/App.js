import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, createTheme, Snackbar, ThemeProvider } from '@mui/material';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AdminPanel from './pages/AdminPanel';
import UserCollectionPage from './pages/UserCollectionPage';
import CollectionPage from './pages/CollectionPage';
import ItemPage from './pages/ItemPage';
import SnackbarAlert from './global/Snackbar';
import { AlertProvider } from './global/alert-context';

function App() {
  const themeCheck = localStorage.getItem('appmode');
  if(!themeCheck) {
    localStorage.setItem('appmode', 'light');
  }

  const [appMode, setAppMode] = useState(themeCheck);

  const darkTheme = createTheme({
    palette: {
      mode: appMode,
    }
  });

  return (
    <ThemeProvider theme={ darkTheme }>
      <Box bgcolor={'background.default'} sx={{ minHeight: '100vh' }}>
        <Router>
          <AlertProvider>
            <Navbar setAppMode={setAppMode} appMode={appMode} />
            <Box>
              <Routes>
                <Route exact path='/' element={ <Home /> } />
                <Route exact path='/login' element={ <Login /> } />
                <Route exact path='/signup' element={ <SignUp /> } />
                {localStorage.getItem('isAdmin') === 'true' && (
                  <Route exact path='/adminpanel' element={ <AdminPanel /> } />
                )}
                <Route exact path='/:uid/collections' element={ <UserCollectionPage /> } />
                <Route exact path='/collection/:cid' element={ <CollectionPage /> } />
                <Route exact path='/item/:itemid' element={ <ItemPage /> } />
                <Route path='*' element={ <Navigate to="/" /> } />
              </Routes>
              <SnackbarAlert />
            </Box>
          </AlertProvider>
        </Router>
      </Box>
    </ThemeProvider>
  );
}

export default App;
