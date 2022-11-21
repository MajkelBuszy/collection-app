import React, { useEffect, useState } from 'react';
import { Container, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import ActionButton from '../components/ActionButton';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users`, {
                method: 'GET'
            });
            const data = await response.json();
            const users = data.users;
            setUsers(users);
        }
        fetchUsers();
    }, []);

    return (
        <Container maxWidth='xl' sx={{ display: 'felx', justifyContent: 'center', marginTop: '20px' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>USERNAME</TableCell>
                        <TableCell>EMAIL</TableCell>
                        <TableCell>SERVER ROLE</TableCell>
                        <TableCell>STATUS</TableCell>
                        <TableCell align='center'>ACTIONS</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users !== undefined && users.map(user => (
                        <TableRow hover key={user._id}>
                            <TableCell>{user._id}</TableCell>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.isAdmin ? 'Admin' : 'User'}</TableCell>
                            <TableCell>{user.active ? 'Active' : 'Blocked'}</TableCell>
                            <TableCell align='center'>
                                {user.active ? (
                                    <ActionButton body='BLOCK' queryType='block' method='PATCH' userId={user._id} />
                                ) : (
                                    <ActionButton body='UNBLOCK' queryType='unblock' method='PATCH' userId={user._id} />
                                )}
                                {user.isAdmin ? (
                                    <ActionButton body='REVOKE ADMIN' queryType='revokeadmin' method='PATCH' userId={user._id} />
                                ) : (
                                    <ActionButton body='GRANT ADMIN' queryType='grantadmin' method='PATCH' userId={user._id} />
                                )}
                                <ActionButton body='DELETE' queryType='delete' method='DELETE' userId={user._id} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Container>
    )
}

export default AdminPanel;