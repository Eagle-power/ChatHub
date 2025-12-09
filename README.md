# Real-Time Chat Application with Typescript

A modern real-time chat application built with TypeScript, React, and Socket.IO.

## Features

- Real-time messaging
- TypeScript support
- Modern React components
- Socket.IO for bidirectional communication
- Clean and intuitive user interface

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v20.0.0 or higher)
- npm (comes with Node.js)

## How to Use (If Downloaded from GitHub)

### 1. Clone the Repository

```bash
git clone https://github.com/Eagle-power/ChatHub.git
cd chat-app-ts
```

### 2. Backend Setup

```bash
cd server
npm install
npm run dev
```

This will start the backend server on `http://localhost:8080`.

### 3. Frontend Setup

```bash
cd ../client
npm install
npm run dev
```

This will start the React frontend on `http://localhost:5173`.

 

## Project Structure

```
ChatHub/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/      # API and service
│   │   ├── assets/       # Static assets
│   │   ├── interfaces.ts  # TypeScript interfaces
│   │   ├── helpers.tsx   # Helper functions
│   │   ├── App.tsx      # Main App component
│   │   └── main.tsx     # Entry point
│   ├── public/          # Public assets
│   ├── package.json     # Frontend dependencies
│   └── tsconfig.json    # TypeScript configuration
│
└── server/              # Node.js backend
    ├── src/
    │   ├── index.ts    # Server entry point
    │   └── interfaces.ts # TypeScript interfaces
    ├── package.json    # Backend dependencies
    └── tsconfig.json   # TypeScript configuration
```

## Tech Stack

### Frontend

- React with TypeScript
- Socket.IO Client
- TailwindCSS

### Backend

- Node.js
- Express
- TypeScript
- Socket.IO
 

### Running the Application

1. Start the server:

   ```bash
   cd server
   npm run dev
   ```

2. In a new terminal, start the client:
   ```bash
   cd client
   npm start
   ```

The application will be running with:

- Client: http://localhost:5173
- Server: http://localhost:8080

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

If you have any questions or need help with setup, please open an issue in the repository.