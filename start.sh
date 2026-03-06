#!/bin/bash

echo "🔧 Handwerker Management App"
echo "============================="
echo ""
echo "Starting server..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "🚀 Server is starting on http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server
node server.js
