FROM ubuntu:22.04

WORKDIR /code

RUN apt-get update && apt-get install -y curl

RUN curl -fsSL https://deb.nodesource.com/setup_23.x -o nodesource_setup.sh && \
    bash nodesource_setup.sh && \
    apt-get install -y nodejs && \
    echo node -v

COPY . .

RUN npm install -g @anthropic-ai/claude-code