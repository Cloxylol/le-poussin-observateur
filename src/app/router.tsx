import { createHashRouter, Navigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import HomePage from '../features/home/pages/HomePage';
import ObservationsPage from '../features/observations/pages/ObservationsPage';
import AddObservationPage from '../features/observations/pages/AddObservationPage';
import EditObservationPage from '../features/observations/pages/EditObservationPage';
import ObservationDetailPage from '../features/observations/pages/ObservationDetailPage';
import SpeciesPage from '../features/species/pages/SpeciesPage';
import SpeciesDetailPage from '../features/species/pages/SpeciesDetailPage';
import OutingsPage from '../features/outings/pages/OutingsPage';
import AddOutingPage from '../features/outings/pages/AddOutingPage';
import OutingDetailPage from '../features/outings/pages/OutingDetailPage';
import SettingsPage from '../features/settings/pages/SettingsPage';

export const router = createHashRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'observations',
        children: [
          {
            index: true,
            element: <ObservationsPage />
          },
          {
            path: 'add',
            element: <AddObservationPage />
          },
          {
            path: 'edit/:id',
            element: <EditObservationPage />
          },
          {
            path: ':id',
            element: <ObservationDetailPage />
          }
        ]
      },
      {
        path: 'species',
        children: [
          {
            index: true,
            element: <SpeciesPage />
          },
          {
            path: ':id',
            element: <SpeciesDetailPage />
          }
        ]
      },
      {
        path: 'outings',
        children: [
          {
            index: true,
            element: <OutingsPage />
          },
          {
            path: 'add',
            element: <AddOutingPage />
          },
          {
            path: ':id',
            element: <OutingDetailPage />
          }
        ]
      },
      {
        path: 'settings',
        element: <SettingsPage />
      },
      {
        path: '*',
        element: <Navigate to="/" replace />
      }
    ]
  }
]);

export default router;
