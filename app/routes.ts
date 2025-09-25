import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('workout/create', 'routes/createWorkout.tsx'),
] satisfies RouteConfig;
