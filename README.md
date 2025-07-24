# NetCognition Website

This repository contains the NetCognition website built with React and Vite.

## Project Structure

- `NetCognition/` - Main React application
  - `src/` - Source code
  - `public/` - Static assets
  - `dist/` - Build output (generated)

## Deployment

This project is configured for deployment on Vercel with the following settings:

- **Build Command**: `cd NetCognition && npm install && npm run build`
- **Output Directory**: `NetCognition/dist`
- **Framework**: Vite

## Development

To run the development server:

```bash
cd NetCognition
npm install
npm run dev
```

## Build

To build for production:

```bash
cd NetCognition
npm run build
```

The built files will be in `NetCognition/dist/`.