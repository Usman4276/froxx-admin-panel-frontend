import { useRoutes } from 'react-router-dom';

// project import
import { LoginRoutes, RegisterRoute } from './LoginRoutes';
import MainRoutes from './MainRoutes';
import Login from '../pages/authentication/Login';

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    const Path404 = {
        path: '*',
        element: <Login />
    };

    return useRoutes([MainRoutes, RegisterRoute, LoginRoutes, Path404]);
}
