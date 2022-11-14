import { useContext } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from '@mui/material/Alert'

import { AlertContext } from "./alert-context";

const SnackbarAlert = () => {
    const alert = useContext(AlertContext);

    const handleClose = (event, reason) => {
        if(reason === 'clickaway') {
            return;
        }
        alert.toggleAlert(false);
    }

    return (
        <Snackbar 
            open={alert.alertOpen}
            autoHideDuration={3000}
            onClose={handleClose}
        >
            <MuiAlert 
                onClose={handleClose}
                severity={alert.alertSeverity || 'success'}
                sx={{ width: '100%' }}
                elevation={6}
                variant='filled'
            >
                {alert.alertMessage}
            </MuiAlert>
        </Snackbar>
    )
}

export default SnackbarAlert;