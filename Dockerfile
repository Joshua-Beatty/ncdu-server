FROM node:24-alpine

# Install system dependencies
RUN apk add --no-cache curl util-linux

# Install ncdu
RUN curl -L https://dev.yorhel.nl/download/ncdu-2.8.1-linux-x86_64.tar.gz | tar -xz -C /usr/local/bin
RUN chmod +x /usr/local/bin/ncdu
RUN ncdu --version

WORKDIR /usr/src/app

# Copy backend package files and install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy backend source code
COPY backend/ ./backend/

# Copy frontend package files and install frontend dependencies
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# Copy frontend source code
COPY frontend/ ./frontend/

# Copy any remaining root files (if any)
COPY . .

# Build the application
RUN npm run build

EXPOSE 3000
ENV PORT=3000
CMD ["npm", "start"]