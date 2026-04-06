import { Navigate } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';

const routes = [
    { path: '/', element: <Navigate to="/dashboard" replace /> },
    { path: '/dashboard', element: <Dashboard /> },
];

export default routes;
