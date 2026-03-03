FROM node:18-alpine

# Install Python, pip, ffmpeg and yt-dlp
RUN apk add --no-cache python3 py3-pip ffmpeg curl
RUN pip3 install yt-dlp --break-system-packages

# Install Deno (JS runtime for yt-dlp n-challenge solving)
RUN apk add --no-cache unzip && \
    wget -q https://dl.deno.land/release/v2.1.4/deno-x86_64-unknown-linux-gnu.zip \
         -O /tmp/deno.zip && \
    unzip /tmp/deno.zip -d /usr/local/bin/ && \
    rm /tmp/deno.zip && \
    chmod +x /usr/local/bin/deno

# Verify installations
RUN yt-dlp --version && ffmpeg -version && deno --version

WORKDIR /app

# Copy dependencies and install
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

EXPOSE 3000

COPY start.sh /start.sh
RUN chmod +x /start.sh

CMD ["/start.sh"]
