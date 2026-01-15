# hello-distr

This is a web application to demonstrate the build, deployment and release workflow for applications in Distr.
It consists of a next.js application, a Python backend and a Postgresql database. 
The containers are deployed via docker compose behind a Caddy reverse proxy, allowing access to the frontend and the
Python API.

Feel free to fork it, tinker around a bit and find out what Distr can offer for your on premises software. 

## Tools

We make use of: 
* GitHub Actions/Workflows
* GitHub Registry (`ghcr.io`)
* [Release Please](https://github.com/googleapis/release-please-action)
* [`distr-create-version-action`](https://github.com/distr-sh/distr-create-version-action)

## Repository Structure

Apart from a directory for the code, config and `Dockerfile` of each the applications' components (`backend`, `frontend`, `proxy`), 
there are the following deployment specific files/directories:

* `.github/workflows/*.yaml`: These specify the GitHub action workflows.
* `deploy/`: Contains the [production docker compose file](deploy/docker-compose.yaml) and an [environment template](deploy/env.template). 
These will be uploaded to distr using the [`distr-create-version-action`](https://github.com/distr-sh/distr-create-version-action), 
as defined in the [push-distr workflow](.github/workflows/push-distr.yaml).
* `release-please-config.json`: Contains the config for the release please action.

## How it works

The GitHub workflows behave differently in different scenarios. For example, when opening a PR after or during feature development, 
we want the docker build to run, but of course the built image should not be published or released yet.

### On Pull Request

When opening a PR, the `build-*` jobs are run, i.e. each part of the application is built with docker. The corresponding
`Dockerfile`s can be found inside each components' directory.

### On Push to main

When pushing to `main`, e.g. by merging a PR, the docker images are built again.

Additionally, the `release-please` workflow is run. For that to work, the corresponding GitHub action needs permissions on the repository.
We set a GitHub secret in this repository and give it the name `RELEASE_GITHUB_TOKEN`. 

For more information about the Release Please token, please [check their docs](https://github.com/googleapis/release-please-action?tab=readme-ov-file#github-credentials).

### On Push Tag (Release)

Once there is at least one commit to `main` since the last release, Release Please will open a new PR or update its existing one.
The changeset will mostly include version changes and adding relevant information to the `CHANGELOG`.

After testing and making sure everything is ready to release, you can approve and merge the Release Please PR. This will
push a tag with the new version name to the repository.
However you can also push a tag by yourself – it will also start the defined workflows. 

The `build-*` workflows are started again, however this time, as the triggering event is a tag push, they will also log in to
the GitHub registry before the build, and afterwards push the resulting images to the registry.

#### Releasing a new Distr application version 

On release, additionally, the [`push-distr`](.github/workflows/push-distr.yaml) workflow is started, 
which uploads the artifacts in `deploy/` (`docker-compose.yaml` and `env.template`)to the Distr Hub, 
and makes the new version available to you and your customers. The used version name is the pushed git Tag. 

This GitHub action needs to authenticate itself against the Distr Hub, and it needs additional information as to which application the new
version should be added to. Therefore follow these one-time setup steps: 
* Create a Distr Personal Access Token in your account, as described [here](https://distr.sh/docs/integrations/personal-access-token/). 
* Add the Distr PAT to your GitHub repo's secrets and call it `DISTR_TOKEN`. 
* Make sure to have a Distr application in place, to which the newly released version can be attached. If the application does not exist yet,
create it via the Distr Web interface, by giving it a name (like `hello-distr`) and setting the type to `docker`. 
Once created, copy the ID of the application from the web interface (click on the left-most column in the application list).
* Add the copied application ID as a variable to your GitHub repository and call it `DISTR_APPLICATION_ID`. Alternatively you can also 
directly paste it into the `push-distr.yaml` workflow file (but please never directly paste any tokens/secrets!). 

See [distr-create-version-action docs](https://github.com/distr-sh/distr-create-version-action/blob/main/README.md#usage) for further information regarding
this GitHub action. 

Note that in this example repo, we set the `api-base` to `https://demo.distr.sh/api/v1`. In order to make use of this in production, 
you should remove this line to use the default Distr Hub (`app.distr.sh`) instead. 

### Common Requirements

#### Showing the build version in the frontend

We often want to display the software's own version in the user interface. 
To that end we can pass the version name (i.e. the git tag) to the environment of the frontend docker build, which itself
writes this version into a `version.json` file inside the app. The version defined in this file will then be displayed in a 
frontend component. 

To add the argument to the docker build (see `.github/workflows/build-frontend.yaml`):
```yaml
build-args: |
  VERSION=${{ github.ref_name }}
```

To accept this `VERSION` environment variable (see `frontend/Dockerfile`):
```
ARG VERSION
ENV VERSION=${VERSION}
```

To write the version file inside the frontend repo, there is the `frontend/hack/update-frontend-version.js` script:
```javascript
const out = JSON.stringify({version: env['VERSION'] || 'snapshot'}, null, 2)
await writeFile('buildconfig/version.json', out);
```

This script is hooked into the next.js build process as `prebuild`, see `frontend/package.json`:
```json
"prebuild": "npm run buildconfig",
"buildconfig": "node hack/update-frontend-version.js"
```

### Production docker compose file and environment variables

So far we have managed to build and release a new version of `hello-distr` and to publish the deploy artifacts to Distr Hub.
Let's now take a look at these artifacts.

You can find the production compose file at [`deploy/docker-compose.yaml`](deploy/docker-compose.yaml). For all the services to start up and run correctly,
some environment variables need to be passed from the outside. You or your customer (depending on the deployment environment)
will have to set these variables, when deploying the `hello-distr` application via the Distr web interface. 

In order to make this process easier for you and your customers, you can define an optional environment template 
(see [`deploy/env.template`](deploy/env.template)) and upload it to Distr with the `template-file` parameter of the GitHub action. 

This template is a simple text file with `KEY=VALUE` lines. Note: This template is only for the user to set the possible environment
values when deploying the app via Distr – and it will only be shown at the **first** deployment of this app. When later updating
to a newer version, the deploy modal in the Distr web interface will show the previously set variables, not the template!

You can use this template to set recommended values and to leave additional comments. 

## `hello-distr` in action

Once deployed, the `hello-distr` app will be available at port 80 of the given hostname (env variable `HELLO_DISTR_HOST`).
The user interface will be available at `http://<hostname>`, and the python API will be available at `http://<hostname>/api`. 
The UI consists of only one page showing the deployed version and the latest entry in the `messages` table of the postgres DB. 
To demonstrate that the API is also publicly available, you can `POST` a newer message to it:

```shell
curl -X POST http://<your-hostname>/api/messages -d '{"text": "hello distr lol"}'  -H 'Content-Type: application/json'
```

After refreshing the UI, it should display the newly added message. 

## Local Development

**Postgres**

You can install Postgres locally or use Docker to run it in a container.

```shell
docker compose up
```

To start the backend or frontend, please consult the respective `README`s in the subdirectories.
