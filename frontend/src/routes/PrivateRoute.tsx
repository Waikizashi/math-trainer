import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

interface PrivateRouteProps {
    component: React.ComponentType<any>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component }) => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error('AuthContext must be used within an AuthProvider');
    }

    const { user } = authContext;

    return user ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;
