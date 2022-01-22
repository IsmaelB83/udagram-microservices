# udagram (microservices version)
Instagram type application refactored to a microservices architecture with kubernetes. Deployed to AWS EKS service.

The project  has two four microservices:
* udagram-api-feed: REST api microservice to interact with feeds (a feed is an image with a title)
* udagram-api-user: REST api microservice to interact with user model (authenticate, create, etc.)
* udagram-reverseproxy: nginx microservice to reverseproxy requests to the endpoints pods.
* Frontend: ionic application frontend

This version of udagram is an evolution from original https://github.com/IsmaelB83/udagram.git, the backend is served trough a kubernetes cluster using a microservices architecture. By contrast with first version of udagram, where all the REST api was running in the same elastick beanstalk application.

Appart from that, this application makes usage of the following AWS Services:
* RDS: The database is a postgres instance deployed as an RDS service in AWS.
* S3: As a file storage the application uses S3 buckets to store the images in the cloud.

## CONTENTS

- [ARCHITECTURE](#ARCHITECTURE)
- [INSTRUCTIONS TO LOCAL INSTALLATION](#INSTRUCTIONS-TO-LOCAL-INSTALLATION)

## ARCHITECTURE

From a high level perspective logical architecture is as shown in below image:
![AWS_Architecture](screenshots/logical_architecture.png)

## INSTRUCTIONS TO LOCAL INSTALLATION

To download the repository

```bash
./downloads/git clone https://github.com/IsmaelB83/udagram-microservices.git
```
> _tip_: it's recommended that you start with getting the backend API running since the frontend web application depends on the API.

### Prerequisite
1. The depends on the Node Package Manager (NPM). You will need to download and install Node from [https://nodejs.com/en/download](https://nodejs.org/en/download/). This will allow you to be able to run `npm` commands.
2. Environment variables will need to be set. These environment variables include database connection details that should not be hard-coded into the application code. For that the backend code relies on .env files. You need to copy/paste the .env.example file to an .env file and modiy accordingly to your config (database credentials, AWS ARNs, etc.).

### 1. Database
Create a PostgreSQL database either locally or on AWS RDS. The database is used to store the application's metadata.

* We will need to use password authentication for this project. This means that a username and password is needed to authenticate and access the database.
* The port number will need to be set as `5432`. This is the typical port that is used by PostgreSQL so it is usually set to this port by default.

Once your database is set up, set the config values for environment variables in the .env file (see .env.example for reference)
* If you set up a local database, your `POSTGRES_HOST` is most likely `localhost`
* If you set up an RDS database, your `POSTGRES_HOST` is most likely in the following format: `***.****.us-west-1.rds.amazonaws.com`. You can find this value in the AWS console's RDS dashboard.

### 2. S3
Create an AWS S3 bucket. The S3 bucket is used to store images that are displayed in Udagram.

Set the config values for environment variables in the .env file.

### 3. Backend API

Launch the backend API locally. The API is the application's interface to S3 and the database.

Enter in directory restapi and follow below instructions:

* To download all the package dependencies, run the command from the directory `udagram-api/`:
    ```bash
    npm install .
    ```
* To run the application locally, run:
    ```bash
    npm run dev
    ```
* You can visit `http://localhost:8080/api/v0/feed` in your web browser to verify that the application is running. You should see a JSON payload. Feel free to play around with Postman to test the API's. There is a restapi.postman_collection.json file within restapi for your reference.

### 4. Frontend App
Launch the frontend app locally.

Enter in directory frontend, and follow below instructions:

* To download all the package dependencies, run the command from the directory `udagram-frontend/`:
    ```bash
    npm install .
    ```
* Install Ionic Framework's Command Line tools for us to build and run the application:
    ```bash
    npm install -g ionic
    ```
* Prepare your application by compiling them into static files.
    ```bash
    ionic build
    ```
* Run the application locally using files created from the `ionic build` command.
    ```bash
    ionic serve
    ```
* You can visit `http://localhost:8100` in your web browser to verify that the application is running. You should see a web interface.

## IMPORTANT Remarks
1. The `.dockerignore` file is included for your convenience to not copy `node_modules`. Copying this over into a Docker container might cause issues if your local environment is a different operating system than the Docker image (ex. Windows or MacOS vs. Linux).
3. It's useful to "lint" your code so that changes in the codebase adhere to a coding standard. This helps alleviate issues when developers use different styles of coding. `eslint` has been set up for TypeScript in the codebase for you. To lint your code, run the following:
    ```bash
    npx eslint --ext .js,.ts src/
    ```
    To have your code fixed automatically, run
    ```bash
    npx eslint --ext .js,.ts src/ --fix
    ```
4. To test in local you will need to revie and execute the file `set_env.example.sh`. To persist env variables execute `source set_env.example.sh`.
5. To `build images with .env variables injected` refer to docker-compose.yaml where it relays on .env variables already existing in local shell. Created trough previouse source command.