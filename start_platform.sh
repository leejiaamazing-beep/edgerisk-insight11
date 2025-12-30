#!/bin/bash

# Kill ports 8000 and 5173 to ensure clean start (optional, use with caution)
lsof -t -i:8000 | xargs kill -9
lsof -t -i:5173 | xargs kill -9

echo "Starting EdgeRisk Insight Platform..."

# Start Backend
echo "Starting Backend (FastAPI)..."
cd backend
# Check if virtualenv exists, if not, maybe just run python3 directly assuming packages installed
# For now, just run python3 directly as we installed dependencies globally or in user env
python3 main.py &
BACKEND_PID=$!
cd ..

# Start Frontend
echo "Starting Frontend (Vite)..."
npm run dev &
FRONTEND_PID=$!

echo "Platform running!"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Access the platform at: http://localhost:5173"
echo "Press Ctrl+C to stop both."

# Trap SIGINT to kill both processes
trap "kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT

wait
