import React from 'react';
import { Route } from 'react-router-dom';
import AuthService from '../services/authService';
 
const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        AuthService.isAuthenticated() ? (
            <Component {...props} />
        ) : (
            <Navigate to="/login" replace />
            // <Route index element={<Navigate to="/login" replace />} />
        )
    )} />
);
 
export default PrivateRoute;