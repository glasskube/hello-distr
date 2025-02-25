# hello-distr

This is a web application to demonstrate the build, deployment and release workflow for applications in Distr.
It consists of a next.js application, a Python backend and a Postgresql database. 
The containers are deployed via docker compose behind a Caddy reverse proxy, allowing access to the frontend and the
Python API.

## How it works

### Frontend

**Next.js Build**

**Environment Variables**

Dynamic content of the web application, like the version of the frontend itself, can be passed to the build process
with env variables.

For example, we make the `VERSION` variable available in the `Dockerfile`.


## Local Development

**Postgres**

You can install Postgres locally or use Docker to run it in a container.

```shell
docker compose up
```

**Frontend**

```shell
cd new_frontend
npm install
npm run dev
```

Navigate in your browser to `http://localhost:3000`.

