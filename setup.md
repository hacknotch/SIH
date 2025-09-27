# Setup Instructions

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Adi-Deshmukh/SIH.git
   cd SIH/project_root
   ```

2. **Install dependencies**
   ```bash
   npm run install-deps
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## Manual Setup

If you prefer to set up manually:

1. **Navigate to the application directory**
   ```bash
   cd project_root/railway-map-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run install-deps` - Install all dependencies

## Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will automatically try the next available port (5174, 5175, etc.).

### Node Modules Issues
If you encounter issues with node_modules:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Railway Data Not Loading
Ensure the GeoJSON files are in the `public/` directory and accessible via HTTP.

## Features

- Interactive railway map
- Route highlighting between destinations
- Multi-state support (Karnataka, Tamil Nadu, Kerala, etc.)
- Real-time search functionality
- Responsive design

## Support

For issues or questions, please create an issue in the repository or contact the development team.
