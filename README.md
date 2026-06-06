# Work Pulse

A full-stack application for productivity and workflow management with an Express API backend and Next.js frontend.

## Features

- Modern web interface for productivity tracking
- RESTful API with Express.js
- Real-time state management with Redux Toolkit
- Data fetching with React Query
- Secure authentication with JWT
- Responsive design with Tailwind CSS and shadcn UI
- Dark mode support with next-themes
- Form validation with React Hook Form and Zod

## Tech Stack

### Frontend
- **Framework**: Next.js 16.2.7
- **UI**: React 19.2.4 with shadcn UI
- **Styling**: Tailwind CSS 4 with custom animations
- **State Management**: Redux Toolkit & React Redux
- **Data Fetching**: TanStack React Query 5
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Backend
- **Framework**: Express.js 5.2.1
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcryptjs
- **Security**: Helmet, CORS, Cookie Parser
- **Language**: TypeScript

## Project Structure

```
work-pulse/
├── api/                 # Express backend
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
├── web/                 # Next.js frontend
│   ├── app/
│   ├── components/
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB running locally or MongoDB Atlas connection string

### Installation

1. Clone the repository
```bash
git clone https://github.com/rianhz/work-pulse.git
cd work-pulse
```

2. Install backend dependencies
```bash
cd api
npm install
```

3. Install frontend dependencies
```bash
cd ../web
npm install
```

### Environment Setup

Create `.env.local` files in both `api` and `web` directories with necessary configurations:

**api/.env**
```
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

**web/.env.local**
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Running the Application

**Start the backend:**
```bash
cd api
npm run dev
```
The API will be available at `http://localhost:4000`

**Start the frontend (in a new terminal):**
```bash
cd web
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

### Backend
- `npm run dev` - Start development server with Nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

### Frontend
- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC
