# SmartCartia - AI-Powered E-commerce Platform (Next.js Frontend + Express.js Backend)

A modern e-commerce platform built with a Next.js frontend and an Express.js backend, featuring AI-powered product recommendations, sentiment analysis, and smart shopping features.

## Architecture

- **Frontend**: Next.js 14 (React 18) - Handles UI rendering and user interaction. Runs on port 3000 by default.
- **Backend**: Express.js (Node.js) - Provides RESTful APIs, interacts with data sources, and executes Python ML scripts. Runs on port 3001 by default.

## Features

- 🛍️ Complete e-commerce functionality
- 🤖 AI-powered product recommendations (via backend)
- 📊 Review emotion analysis (via backend calling Python scripts)
- 📱 Social media sentiment tracking (via backend calling Python scripts)
- 🌙 Dark/Light mode support
- 💱 Multi-currency support (INR/USD)
- 📱 Fully responsive design
- 🛒 Advanced shopping cart (interacting with backend APIs)
- 💬 AI support chat (interacting with backend APIs)
- 🔍 Smart product search (interacting with backend APIs)

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn package manager
- Python 3.x installed and accessible via `python` or `python3` (or configure `PYTHON_EXECUTABLE` in `.env.local`)
- Python dependencies for ML scripts (e.g., `nltk`, `pandas` - ensure these are installed in your Python environment)

### Installation

1.  **Extract the project files**
    \`\`\`bash
    # Extract the SmartCartia_nihal.zip file to your desired location
    cd smartcartia-nihal-express # Or your extracted folder name
    \`\`\`

2.  **Install dependencies** (for both frontend and backend)
    \`\`\`bash
    npm install
    # or
    yarn install
    \`\`\`

3.  **Set up environment variables**
    - Copy `.env.example` to `.env.local`
      \`\`\`bash
      cp .env.example .env.local
      \`\`\`
    - Edit `.env.local` if you need to change default ports or Python paths.

4.  **Run the development servers** (Frontend and Backend concurrently)
    \`\`\`bash
    npm run dev
    # or
    yarn dev
    \`\`\`
    This will start:
    - Next.js frontend on `http://localhost:3000`
    - Express.js backend on `http://localhost:3001`

5.  **Open your browser**
    Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Available Scripts

- `npm run dev:next` - Start only the Next.js development server
- `npm run dev:express` - Start only the Express.js development server (with nodemon)
- `npm run dev` - Start both Next.js and Express development servers concurrently
- `npm run build` - Build the Next.js application for production
- `npm run start:next` - Start the Next.js production server
- `npm run start:express` - Start the Express.js production server
- `npm run start` - Start both Next.js and Express production servers concurrently
- `npm run lint` - Run ESLint for code linting

## Project Structure

\`\`\`
smartcartia-nihal-express/
├── app/                    # Next.js app directory (Frontend)
├── components/             # React components (Frontend)
├── lib/                    # Frontend utility functions
├── public/                 # Static assets (Frontend)
├── server/                 # Express.js backend
│   ├── data/               # Backend data sources (e.g., product data)
│   ├── routes/             # Express API route handlers
│   └── index.js            # Express server entry point
├── ml/                     # Python ML scripts
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── .env.example            # Environment variable template
└── README.md               # This file
\`\`\`

## Technologies Used

- **Frontend**: Next.js 14, React 18
- **Backend**: Express.js, Node.js
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Language**: JavaScript/JSX (Frontend & Backend)
- **ML**: Python (scripts in `ml/` directory)

## Important Notes for Development

- **Data Fetching**: All frontend data fetching now goes through the Express backend via `fetchFromBackend` utility which calls `http://localhost:3001/api/...`.
- **Python Scripts**: Ensure your Python environment is set up correctly and the path in `.env.local` (`PYTHON_ML_PATH`, `PYTHON_EXECUTABLE`) is correct if your Python setup differs.
- **Product Data**: Product data is currently hardcoded in `server/data/products.js`. For a production app, this would be a database.
- **Reviews Data**: Dummy reviews are in `server/routes/review-emotions.js`. This would also be from a database.

## Deployment

Deploying this setup typically involves:
1.  Building the Next.js frontend (`npm run build`).
2.  Deploying the Next.js frontend (e.g., on Vercel, Netlify, or as static files served by Express or another web server).
3.  Deploying the Express.js backend (e.g., on a Node.js hosting platform like Heroku, Render, or a VPS).
4.  Configuring environment variables on both deployment platforms, ensuring the frontend knows the URL of the deployed backend.

## Support

For support and questions, refer to the documentation or open an issue if this were a shared project.

## License

This project is for educational and demonstration purposes.
