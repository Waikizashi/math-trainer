import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AuthService from '../service/AuthService';
import UserService, { UserDTO } from '../service/UserService';

interface AuthContextType {
    user: UserDTO | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserDTO | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const currentUser = await UserService.getCurrentUser();
            console.log("CURRENT USER: ", currentUser)
            if (currentUser) {
                setUser(currentUser);
            }
        }
        checkAuth()
    }, []);

    const login = async (username: string, password: string) => {
        const loggedUser = await AuthService.login(username, password);
        setUser(loggedUser);
    };

    const logout = async () => {
        await AuthService.logout();
        setUser(null);
    };

    const value = { user, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
