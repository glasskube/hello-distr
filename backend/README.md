# hello-distr backend

This is the Python backend server of `hello-distr`. 
It connects to the postgres database and offers two JSON API endpoints
* `GET /latest-message`
* `POST /message`

## Local development

To create virtual envrionment, run the following command in terminal:

```
python -m venv .venv
```

To install dependencies, run the following command in terminal:

```shell
pip install -r requirements.txt
```

Make sure to have a postgres instance running, e.g. by starting the one given in the [root docker compose file](../docker-compose.yaml), with

```shell
docker compose up -d
```

To run the application locally

```
flask --app app --env-file .env.development run
```

The server will be available at [http://127.0.0.1:5000](). 

**Create a message**

```shell
curl -X POST http://127.0.0.1:5000/messages -d '{"text": "hello distr"}'  -H 'Content-Type: application/json'
```

**Read latest message**

```shell
curl http://127.0.0.1:5000/latest-message
```

## Build and Deploy
