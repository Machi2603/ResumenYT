FROM node:18-alpine

# Install Python, pip, ffmpeg and yt-dlp
RUN apk add --no-cache python3 py3-pip ffmpeg curl
RUN pip3 install yt-dlp --break-system-packages

# Verify installations
RUN yt-dlp --version && ffmpeg -version

WORKDIR /app

# Copy dependencies and install
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
