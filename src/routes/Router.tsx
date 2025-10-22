import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from './home';
import Calendar from './calendar';
import CreateWorkout from './createWorkout';
import UpdateWorkout from './updateWorkout';
import WorkoutDetail from './workoutDetail';
import Timer from './timer';

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
