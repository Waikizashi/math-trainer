import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AuthService from '../service/AuthService';
import UserService, { UserDTO } from '../service/UserService';
import { useNotification } from './NotificationContext';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
    user: UserDTO | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserDTO | null>(null);
    const { addNotification } = useNotification();
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            await AuthService.getCurrentUser()
                .then((currentUser) => {
                    if (currentUser) {
                        setUser(currentUser);
                        addNotification('Welcome back ' + currentUser.username, 'session synchronize success', 'info')
                    } else {
                        addNotification('GUEST', 'session synchronize success', 'warning')
                    }
                })
                .catch((err) => {
                    addNotification('Failed', 'session synchronize falied: ' + err, 'danger')
                })
        }
        checkAuth()
    }, []);

    const login = async (username: string, password: string) => {
        await AuthService.login(username, password)
            .then((loggedUser) => {
                setUser(loggedUser);
                addNotification('Success', 'Login successful', 'success')
                navigate('/profile')
            })
            .catch((err) => {
                addNotification('Error', 'Login failed: ' + err, 'danger')
            })
    };

    const logout = async () => {
        await AuthService.logout()
            .then(() => {
                setUser(null);
                addNotification('Done', 'Logout successful', 'warning')
                navigate('/login')
            })
            .catch((err) => {
                addNotification('Error', 'Logout failed: ' + err, 'danger')
            })
    };

    // const value = { user, login, logout };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
