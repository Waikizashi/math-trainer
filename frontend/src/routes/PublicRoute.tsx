import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

interface PublicRouteProps {
    component: React.ComponentType<any>;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ component: Component }) => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error('AuthContext must be used within an AuthProvider');
    }

    const { user } = authContext;

    return user ? <Navigate to="/home" /> : <Component />;
};

export default PublicRoute;
