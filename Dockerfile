FROM node:18-slim

RUN apt-get update && apt-get install -y \
    python3 python3-pip ffmpeg curl wget unzip \
    && rm -rf /var/lib/apt/lists/*

RUN pip3 install yt-dlp openai-whisper --break-system-packages

# Deno (para yt-dlp n-challenge solving)
RUN wget -q https://dl.deno.land/release/v2.1.4/deno-x86_64-unknown-linux-gnu.zip \
         -O /tmp/deno.zip && \
    unzip /tmp/deno.zip -d /usr/local/bin/ && \
    rm /tmp/deno.zip && \
    chmod +x /usr/local/bin/deno

RUN yt-dlp --version && ffmpeg -version && deno --version

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

EXPOSE 3000
COPY start.sh /start.sh
RUN chmod +x /start.sh
CMD ["/start.sh"]
