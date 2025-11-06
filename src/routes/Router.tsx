import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from './Home';
import Calendar from './Calendar';
import CreateWorkout from './CreateWorkout';
import UpdateWorkout from './UpdateWorkout';
import WorkoutDetail from './WorkoutDetail';
import Timer from './Timer';

const Router: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/calendar',
      element: <Calendar />,
    },
    {
      path: '/workout/create',
      element: <CreateWorkout />,
    },
    {
      path: '/workout/:id',
      element: <WorkoutDetail />,
    },
    {
      path: '/workout/update/:id',
      element: <UpdateWorkout />,
    },
    {
      path: '/workout/timer/:id',
      element: <Timer />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
