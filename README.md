# Next.js Frontend - AI Storybook Generator

A modern Next.js frontend for the AI-powered personalized children's storybook generator. This application creates custom stories and character illustrations based on child information and uploaded photos.

## 🚀 Features

- **Story Generation**: AI-powered story creation using Google Gemini API
- **Photo Upload**: Drag & drop photo upload with preview
- **Character Analysis**: Generates character prompts based on story analysis
- **PDF Creation**: Complete storybook generation with illustrations
- **Responsive Design**: Modern UI with Tailwind CSS
- **Type-Safe**: Full TypeScript implementation
- **State Management**: Zustand for global state, React Query for API state

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand + React Query
- **UI Components**: Custom components with Radix UI primitives
- **Animation**: Framer Motion

### Workflow

1. **Story Form**: Collect child details (name, age, gender, language, parent name)
2. **Story Generation**: Automatically generate personalized story using AI
3. **Photo Upload**: Upload child's photo for character generation
4. **Character Creation**: Generate character images using uploaded photo
5. **PDF Generation**: Create complete storybook with story and images

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Brajesh07/nextjs_frontend_storybook.git
cd nextjs_frontend_storybook

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your configuration
```

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_DEBUG=false

# Optional: Analytics or other services
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

## 🚀 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📱 Usage

1. **Start the backend server** (see [backend repository](https://github.com/Brajesh07/node_backend_storybook))
2. **Start the frontend**: `npm run dev`
3. **Open browser**: Navigate to `http://localhost:3000`
4. **Fill the form**: Enter child and parent details
5. **Generate story**: AI creates a personalized story automatically
6. **Upload photo**: Add child's photo for character generation
7. **Download PDF**: Get the complete storybook

## 🏛️ Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main page component
│   └── providers.tsx      # Global providers
├── components/
│   ├── steps/             # Workflow step components
│   │   ├── StoryForm.tsx           # Step 1: Story details form
│   │   ├── PhotoUploadAndGenerate.tsx  # Step 2: Upload & generate
│   │   └── ...
│   └── ui/                # Reusable UI components
├── hooks/                 # Custom React hooks
│   └── useStoryApi.ts     # API interaction hooks
├── lib/                   # Utility libraries
│   ├── api.ts             # API client configuration
│   └── utils.ts           # General utilities
├── store/                 # State management
│   └── useStoryStore.ts   # Zustand store
├── types/                 # TypeScript type definitions
│   └── index.ts           # Shared types
└── ...config files
```

## 🔗 Related Repositories

- **Backend**: [node_backend_storybook](https://github.com/Brajesh07/node_backend_storybook) - Node.js/Express API server
- **Original**: Python Flask version (legacy)

## 🧪 API Integration

This frontend communicates with the Node.js backend via REST API:

- `POST /api/story/generate` - Generate personalized story
- `POST /api/upload` - Upload and process photos
- `POST /api/character/generate` - Generate character images
- `POST /api/pdf/generate` - Create PDF storybook
- `GET /api/pdf/download/:sessionId` - Download generated PDF

## 🎨 Key Features

### Story Generation

- Automatic story creation based on child details
- Age-appropriate content generation
- Multi-language support
- Theme and character analysis

### Photo Upload

- Drag & drop interface
- File validation and preview
- Progress tracking
- Error handling

### Character Analysis

- AI-powered story analysis
- Character prompt generation
- Theme detection
- Age-appropriate styling

### PDF Generation

- Complete storybook assembly
- Character image integration
- Professional formatting
- Download functionality

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Deploy to Vercel
npm run build
# Follow Vercel deployment guide
```

### Docker

```bash
# Build Docker image
docker build -t storybook-frontend .

# Run container
docker run -p 3000:3000 storybook-frontend
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google Gemini AI for story generation
- Replicate for image generation APIs
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
