import { createContext, useState } from "react";

export const AlertContext = createContext({
    alertOpen: false, 
    toggleAlert: () => {}, 
    alertMessage: '',
    setAlertMessage: () => {},
    alertSeverity: '',
    setAlertSeverity: () => {}
});

export const AlertProvider = ({ children }) => {
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('');

    return (
        <AlertContext.Provider value={{
            alertOpen: alertOpen,
            toggleAlert: setAlertOpen,
            alertMessage: alertMessage,
            setAlertMessage: setAlertMessage,
            alertSeverity: alertSeverity,
            setAlertSeverity: setAlertSeverity
        }}>
            {children}
        </AlertContext.Provider>
    )
}