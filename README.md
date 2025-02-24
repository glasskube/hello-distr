# hello-distr

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

## How it works

### Frontend

**Next.js Build**

**Environment Variables**

Dynamic content of the web application, like the version of the frontend itself, can be passed to the build process 
with env variables. 

For example, we make the `VERSION` variable available in the `Dockerfile`.
