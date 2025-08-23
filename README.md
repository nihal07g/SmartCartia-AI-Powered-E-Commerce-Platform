# SmartCartia - AI-Powered E-Commerce Platform

An innovative e-commerce platform powered by AI to enhance shopping experiences through intelligent product recommendations, emotion analysis, and social sentiment insights.

## 🚀 Architecture

- **Frontend**: React 19 + Vite - Modern React application with fast development server. Runs on port 3000.
- **Backend**: Express.js + Node.js - RESTful API server with AI integration. Runs on port 3001.
- **AI Integration**: Google Gemini 2.0 Flash - Server-side AI for intelligent product recommendations.

## 🚀 Features

### Core E-Commerce Features
- **Product Catalog**: Comprehensive product listings with categories (Electronics, Clothing, Books, Home & Garden, Sports)
- **Smart Search**: Advanced product search and filtering capabilities
- **Shopping Cart**: Full-featured cart and checkout system
- **User Management**: Account creation, authentication, and profile management
- **Order Processing**: Complete order management workflow

### 🤖 AI-Powered Features
- **Product Finder**: AI-powered product recommendations using Gemini 2.0 Flash based on natural language queries
- **Review Emotion Analysis**: Advanced sentiment analysis of product reviews using machine learning
- **Social Media Sentiment**: Real-time sentiment tracking from social platforms
- **Currency Support**: INR pricing with multi-currency conversion options

### 🎨 Technical Features
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Real-time Updates**: Dynamic content loading and state management
- **Theme Support**: Light/dark mode toggle
- **Performance Optimized**: Code splitting, lazy loading, and optimized builds

## 🛠️ Tech Stack

### Frontend
- **React 19**: Modern React with Vite for fast development
- **React Router**: Client-side routing
- **Tailwind CSS 4**: Utility-first CSS framework with latest features
- **Lucide React**: Beautiful and customizable icons
- **Recharts**: Data visualization and analytics

### Backend
- **Node.js + Express**: RESTful API server
- **CORS**: Cross-origin resource sharing configuration
- **dotenv**: Environment variable management

### AI Integration
- **Google Gemini 2.0 Flash**: Advanced AI for product recommendations
- **Python ML Models**: Custom machine learning for emotion analysis
- **Natural Language Processing**: Advanced text analysis capabilities

### Development Tools
- **Vite**: Fast build tool and development server
- **ESLint**: Code linting and quality assurance
- **PostCSS**: CSS processing and optimization
- **Concurrently**: Run multiple scripts simultaneously

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+ (for AI features)
- Git

### Quick Start

1. **Clone the repository:**
```bash
git clone https://github.com/nihal07g/SmartCartia-AI-Powered-E-Commerce-Platform.git
cd SmartCartia-AI-Powered-E-Commerce-Platform
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
Create a `.env.local` file in the root directory:
```env
# Server Configuration
FRONTEND_PORT=3000
BACKEND_PORT=3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001

# AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash

# Python ML Configuration
PYTHON_EXECUTABLE=python
PYTHON_ML_PATH=./ml
```

4. **Start the development servers:**
```bash
npm run dev
```

This single command starts both:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## 📁 Project Structure

```
├── frontend/               # Vite React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utilities and API client
│   │   └── assets/         # Static assets
│   ├── public/             # Public assets
│   └── package.json        # Frontend dependencies
├── server/                 # Express.js backend
│   ├── routes/             # API route handlers
│   ├── data/               # Data layer and models
│   ├── lib/                # Server utilities
│   └── index.js            # Server entry point
├── ml/                     # Python ML models
├── components/             # Shared UI components
├── lib/                    # Shared utilities
├── public/                 # Shared static assets
├── app/                    # Legacy Next.js pages (migration reference)
└── package.json            # Root package.json for scripts
```

## 🔧 Available Scripts

```bash
# Development
npm run dev                 # Start both frontend and backend
npm run dev:frontend        # Start only frontend (port 3000)
npm run dev:server          # Start only backend (port 3001)

# Production
npm run build              # Build frontend for production
npm run start              # Start both servers in production mode
npm run start:frontend     # Start frontend production server
npm run start:server       # Start backend production server
```

## 🌐 API Endpoints

### Products
- `GET /api/products` - Get all products with pagination
- `GET /api/products/:id` - Get specific product
- `GET /api/products/categories` - Get all categories
- `GET /api/products/related/:id` - Get related products

### AI Features
- `POST /api/find-my-product` - AI-powered product finder
- `POST /api/review-emotions` - Emotion analysis of reviews
- `POST /api/social-sentiment` - Social media sentiment analysis

### Health Check
- `GET /api/health` - Server health status

## 🤖 AI Features in Detail

### Product Finder
Uses Google Gemini 2.0 Flash to understand natural language queries and recommend products based on:
- User preferences and context
- Product specifications and features
- Price range and availability
- Category matching and similarity

### Emotion Analysis
Analyzes customer reviews to provide insights into:
- Overall sentiment distribution
- Dominant emotions (joy, satisfaction, frustration, etc.)
- Product-specific emotional responses
- Review authenticity indicators

### Social Sentiment Tracking
Monitors and analyzes:
- Real-time social media mentions
- Brand perception trends
- Product popularity metrics
- Community engagement levels

## 🧪 Testing the Application

### Quick API Tests (PowerShell)

```powershell
# Test server health
Invoke-RestMethod -Method Get http://localhost:3001/api/health

# Test AI product finder
$body = '{"query":"budget wireless earbuds under 5k"}'
Invoke-RestMethod -Method Post -Uri http://localhost:3001/api/find-my-product -ContentType 'application/json' -Body $body

# Test products endpoint
Invoke-RestMethod -Method Get http://localhost:3001/api/products
```

## 🎯 Key Features

- ✅ **Single Command Setup**: `npm run dev` starts everything
- ✅ **AI-Powered Search**: Natural language product discovery
- ✅ **Modern React Stack**: Latest React 19 with Vite
- ✅ **Express Backend**: RESTful API with proper CORS
- ✅ **Emotion Analysis**: ML-powered sentiment insights
- ✅ **Responsive Design**: Mobile-first responsive UI
- ✅ **Production Ready**: Optimized builds and deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Nihal Kumar**
- GitHub: [@nihal07g](https://github.com/nihal07g)
- Project: [SmartCartia](https://github.com/nihal07g/SmartCartia-AI-Powered-E-Commerce-Platform)

## 🙏 Acknowledgments

- Google Gemini team for the powerful AI capabilities
- React and Vite communities for excellent developer tools
- Tailwind CSS for the amazing utility-first framework
- Open source community for inspiration and tools

---

**⭐ If you found this project helpful, please give it a star!**
