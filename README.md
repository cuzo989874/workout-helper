# Workout Helper

Welcome to Workout Helper! A modern, production-ready web application designed to help you create, track, and manage your workout routines.

## Features

- **Workout Management**: Create, update, and delete workout sessions.
- **Exercise Tracking**: Add detailed exercises to your workouts, including sets, reps, weight, and rest times.
- **Data Persistence**: Your workout data is saved locally in your browser using Local Storage.
- **Modern Tech Stack**: Built with React, React Router, Vite, and TypeScript for a fast and reliable experience.
- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR) for a smooth development experience.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Available Scripts

This project includes a set of useful scripts to help with development and maintenance:

- `npm run dev`: Starts the development server.
- `npm run build`: Creates a production-ready build of the application.
- `npm run start`: Starts the production server to serve the built application.
- `npm run test`: Runs the test suite using Vitest.
- `npm run test:watch`: Runs the tests in interactive watch mode.
- `npm run test:coverage`: Generates a test coverage report.
- `npm run lint`: Lints the codebase using ESLint to find and report potential errors.
- `npm run lint:fix`: Automatically fixes linting issues.
- `npm run format`: Formats all files using Prettier.
- `npm run typecheck`: Runs the TypeScript compiler to check for type errors.

## Styling

This project uses [Sass](https://sass-lang.com/) for styling, following a modular structure located in the `/styles` directory. This allows for organized and maintainable CSS.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
# Build the Docker image
docker build -t workout-helper .

# Run the container
docker run -p 3000:3000 workout-helper
```

The containerized application can be deployed to any platform that supports Docker.

### DIY Deployment

The built-in app server is production-ready. After running `npm run build`, deploy the following files/directories to your server:

```
├── package.json
├── package-lock.json
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

---

Built with ❤️ using React Router.
