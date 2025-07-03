# ncdu-server

A web-based disk usage analyzer powered by [ncdu](https://dev.yorhel.nl/ncdu), Node.js, and React. Scan and explore disk usage on a mounted drive from your browser, with a modern, interactive UI and real-time progress updates.

## Running with Docker Compose

```yaml
services:
  auth:
    image: beevelop/nginx-basic-auth
    ports:
      - "3000:80"
    environment:
      - HTPASSWD=foo:$$apr1$$odHl5EJN$$KbxMfo86Qdve2FH4owePn. # Change this
      - FORWARD_HOST=web
      - FORWARD_PORT=3000
    depends_on:
      - web
  web:
    build:
      context: https://github.com/Joshua-Beatty/ncdu-server.git
    pull_policy: build
    volumes:
      - /storage:/drive

```

## Changing the login (htpasswd)

- The default is `foo:bar` (but you should change it!)
- To make your own, run:
  ```sh
  docker run --rm httpd:2.4 htpasswd -nbB youruser yourpass
  ```
- Copy the output and replace the `HTPASSWD` line in `docker-compose.yaml`:
  ```yaml
  environment:
    - HTPASSWD=youruser:yourhashedpass
  ```
  - Remember to escape each '$' in the output by replacing them with '$$'


## How it works

- Click **Start Drive Scan** in the web UI
- Watch real-time progress as `ncdu` scans the mounted drive
- When it's done, browse directories, and drill down interactively


## Project Structure

```
backend/    # Express server, spawns ncdu, serves API
frontend/   # React app (Vite, Tailwind, Radix UI)
Dockerfile  # Multi-stage build for backend/frontend
```