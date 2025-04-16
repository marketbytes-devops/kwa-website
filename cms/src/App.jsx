import React, { useState, useEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  useLocation,
} from 'react-router-dom';
import Login from './pages/Auth/Login';
import ForgotPassword from './pages/Auth/ForgotPassword';
import OTPVerification from './pages/Auth/OTPVerification';
import ResetPassword from './pages/Auth/ResetPassword';
import apiClient from './api/apiClient';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import UserRoles from './pages/Auth/UserRoles';
import Roles from './pages/Auth/Roles';
import Permissions from './pages/Auth/Permissions';
import AddComplaint from './pages/Main/Complaint/AddComplaint';
import ViewComplaint from './pages/Main/Complaint/ViewComplaint';
import Area from './pages/Main/Area/Area';
import { AlertProvider } from './context/AlertContext';
import Consumer from './pages/Main/Bluebrigade/Consumer';
import General from './pages/Main/Bluebrigade/General';
import Flows from './pages/Main/Flows';
import AddValves from './pages/Main/Valves/AddValves';
import RCconsumer from './pages/Main/Runningcontract/RCconsumer';
import RCgeneral from './pages/Main/Runningcontract/RCgeneral';
import ViewValves from './pages/Main/Valves/ViewValves';

const DashboardPage = () => (
  <div className="mt-14">
    <Dashboard />
  </div>
);

const ProfilePage = () => (
  <div className="mt-14">
    <Profile />
  </div>
);

const UserRolesPage = () => (
  <div className="mt-14">
    <UserRoles />
  </div>
);

const RolesPage = () => (
  <div className="mt-14">
    <Roles />
  </div>
);

const PermissionsPage = () => (
  <div className="mt-14">
    <Permissions />
  </div>
);

const PrivateRoute = ({ element, requiredPage, requiredAction = 'view' }) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token =
        localStorage.getItem('access_token') ||
        sessionStorage.getItem('access_token');

      if (!token) {
        console.log('No token found, redirecting to /login');
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await apiClient.get('/auth/profile/');
        setIsAuthenticated(true);
        const user = response.data;
        console.log('User Data:', user);
        console.log('Required Page:', requiredPage, 'Required Action:', requiredAction);

        if (user.is_superuser) {
          console.log('User is superadmin, granting access');
          setHasPermission(true);
          return;
        }

        if (!requiredPage) {
          console.log('No required page, granting access');
          setHasPermission(true);
          return;
        }

        const roleId = user.role?.id;
        if (!roleId) {
          console.log('No role ID, denying access');
          setHasPermission(false);
          return;
        }

        try {
          const roleResponse = await apiClient.get(`/auth/roles/${roleId}/`);
          const permissions = roleResponse.data.permissions || [];
          console.log('Permissions:', permissions);
          const perm = permissions.find((p) => p.page === requiredPage);
          console.log('Found Permission:', perm);
          const hasPerm = perm && perm[`can_${requiredAction}`];
          console.log('Has Permission:', hasPerm);
          setHasPermission(hasPerm);
        } catch (error) {
          console.error('Role fetch error:', error.response?.status, error.response?.data);
          if (error.response?.status === 403 || error.response?.status === 401) {
            setHasPermission(false);
          } else {
            throw error;
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('refresh_token');
      }
    };

    checkAuth();
  }, [requiredPage, requiredAction, location.pathname]);

  if (isAuthenticated === null || hasPermission === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-[#00334d] text-sm">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to /login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasPermission) {
    console.warn(`Permission denied for page: ${requiredPage}, action: ${requiredAction}`);
    // Redirect to /profile for Bluebrigade role if dashboard is inaccessible
    if (requiredPage === 'dashboard') {
      return <Navigate to="/profile" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return element;
};

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/otp-verification',
    element: <OTPVerification />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <PrivateRoute element={<DashboardPage />} requiredPage="dashboard" />,
      },
      {
        path: '/complaints/add-complaints',
        element: (
          <PrivateRoute element={<AddComplaint />} requiredPage="complaints" requiredAction="add" />
        ),
      },
      {
        path: '/complaints/view-complaints',
        element: (
          <PrivateRoute
            element={<ViewComplaint />}
            requiredPage="complaints"
            requiredAction="view"
          />
        ),
      },
      {
        path: '/valves/view-valves',
        element: (
          <PrivateRoute element={<ViewValves />} requiredPage="valves" requiredAction="view" />
        ),
      },
      {
        path: '/valves/add-valves',
        element: <PrivateRoute element={<AddValves />} requiredPage="valves" requiredAction="add" />,
      },
      {
        path: 'profile',
        element: <PrivateRoute element={<ProfilePage />} requiredPage="profile" />,
      },
      {
        path: 'area',
        element: <PrivateRoute element={<Area />} requiredPage="area" />,
      },
      {
        path: 'flows',
        element: <PrivateRoute element={<Flows />} requiredPage="flows" />,
      },
      {
        path: '/bluebrigade/consumer',
        element: <PrivateRoute element={<Consumer />} requiredPage="bluebrigade" />,
      },
      {
        path: '/bluebrigade/general',
        element: <PrivateRoute element={<General />} requiredPage="bluebrigade" />,
      },
      {
        path: '/runningcontract/rcconsumer',
        element: <PrivateRoute element={<RCconsumer />} requiredPage="runningcontract" />,
      },
      {
        path: '/runningcontract/rcgeneral',
        element: <PrivateRoute element={<RCgeneral />} requiredPage="runningcontract" />,
      },
      {
        path: '/user-roles',
        element: <PrivateRoute element={<UserRolesPage />} requiredPage="user_management" />,
      },
      {
        path: '/roles',
        element: <PrivateRoute element={<RolesPage />} requiredPage="role" />,
      },
      {
        path: '/permissions',
        element: <PrivateRoute element={<PermissionsPage />} requiredPage="permission" />,
      },
    ],
  },
]);

const App = () => {
  return (
    <AlertProvider>
      <RouterProvider router={router} />
    </AlertProvider>
  );
};

export default App;