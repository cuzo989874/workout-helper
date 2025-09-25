import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('workout/:id', 'routes/WorkoutDetail.tsx'),
  route('workout/create', 'routes/createWorkout.tsx'),
  route('workout/update/:id', 'routes/updateWorkout.tsx'),
] satisfies RouteConfig;
