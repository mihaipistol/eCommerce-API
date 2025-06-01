# API

## Architecture Overview

- **App Engine**: A fully managed platform for building and deploying web applications.
- **Cloud SQL**: A managed relational database service (MySQL).

### Key Concepts

**App Engine**:

- Use **Standard**.

**Cloud SQL**:

- Choose the database type MySQL.
- Configure the instance with appropriate CPU, memory, and storage.
- Create a user and store the credentials for the env config.

**Connections**:

- **Use the same region for GAE and CloudSQL**

- **Networking**:
  -- **Add a network**: `local 89.165.201.10` or `all 0.0.0.0/0`
  Note: `all` should be done only for setting up dev, don't leave it there.

### API's you need to enable

Cloud SQL Admin API

### Steps to implement

#### Step 0: CCP CLI

    gcloud init

#### Step 1: Set Up Cloud SQL

- Create a Cloud SQL **instance** in the same region as your App Engine **application**.
- Configure database users and set strong passwords.

#### Step 2: Configure App Engine

Update the `.env` and `app.yaml` files, special attention to **Cloud SQL instance connection name**
INSTANCE_UNIX_SOCKET: /cloudsql/project_id:region:instance

#### Step 3: Configure Database

Create the database and generate the tables:

    npm run db:migrate

#### Step 4: Secure the Connection

- Use **IAM roles** to grant App Engine access to Cloud SQL.

#### Step 5: Deploy and Monitor

Build your application for production and deploy to App Engine:

    npm run build
    gcloud app deploy

#### Step 6: Cloud Secrets

##### Step A: Create Secrets in Google Cloud Secret Manager

Enable the Secret Manager API

    gcloud services enable secretmanager.googleapis.com --project=PROJECT_ID

Create the secrets

    gcloud secrets create api-db-name --replication-policy="automatic" --project=PROJECT_ID
    echo -n "YOUR_DB_NAME_VALUE_HERE" | gcloud secrets versions add api-db-name --data-file=- --project=PROJECT_ID

    gcloud secrets create api-db-username --replication-policy="automatic" --project=PROJECT_ID
    echo -n "YOUR_DB_USERNAME_VALUE_HERE" | gcloud secrets versions add api-db-username --data-file=- --project=PROJECT_ID

    gcloud secrets create api-db-password --replication-policy="automatic" --project=PROJECT_ID
    echo -n "YOUR_DB_PASSWORD_VALUE_HERE" | gcloud secrets versions add api-db-password --data-file=- --project=PROJECT_ID

    gcloud secrets create api-jwt-secret --replication-policy="automatic" --project=PROJECT_ID
    echo -n "YOUR_JWT_SECRET_VALUE_HERE" | gcloud secrets versions add api-jwt-secret --data-file=- --project=PROJECT_ID

    gcloud secrets create api-jwt-refresh-secret --replication-policy="automatic" --project=PROJECT_ID
    echo -n "YOUR_JWT_REFRESH_SECRET_VALUE_HERE" | gcloud secrets versions add api-jwt-refresh-secret --data-file=- --project=PROJECT_ID

##### Step B: Grant Access to App Engine Service Account

Grant the "Secret Manager Secret Accessor" (roles/secretmanager.secretAccessor) role to this service account for each secret you created:

    gcloud secrets add-iam-policy-binding api-db-name --member="serviceAccount:PROJECT_ID@appspot.gserviceaccount.com" --role="roles/secretmanager.secretAccessor" --project=PROJECT_ID

    gcloud secrets add-iam-policy-binding api-db-username --member="serviceAccount:PROJECT_ID@appspot.gserviceaccount.com" --role="roles/secretmanager.secretAccessor" --project=PROJECT_ID

    gcloud secrets add-iam-policy-binding api-db-password --member="serviceAccount:PROJECT_ID@appspot.gserviceaccount.com" --role="roles/secretmanager.secretAccessor" --project=PROJECT_ID

    gcloud secrets add-iam-policy-binding api-jwt-secret --member="serviceAccount:PROJECT_ID@appspot.gserviceaccount.com" --role="roles/secretmanager.secretAccessor" --project=PROJECT_ID

    gcloud secrets add-iam-policy-binding api-jwt-refresh-secret --member="serviceAccount:PROJECT_ID@appspot.gserviceaccount.com" --role="roles/secretmanager.secretAccessor" --project=PROJECT_ID

#### Step 7:Cloud Build

Initialize the worker pool.

    gcloud builds worker-pools create api-build-pool-ew3 --project=PROJECT_ID --region=europe-west3

Use **Cloud Monitoring** and **Cloud Logging** to track performance and troubleshoot issues.

## Best Practices

- **Regional Placement**: Ensure both App Engine and Cloud SQL are in the same region to reduce latency.
- **Scaling**: Use App Engine's autoscaling and configure Cloud SQL connection limits accordingly.
- **Backups**: Enable automated backups and point-in-time recovery for Cloud SQL.

This architecture ensures a secure, scalable, and efficient connection between App Engine and Cloud SQL, suitable for modern web applications.

## Environment

**.env**

    NODE_ENV='development'
    EXPRESS_PORT='8080'
    INSTANCE_CONNECTION_NAME='project_id:region:instance'
    DB_PORT='Port'
    DB_HOST='Public ip'
    DB_NAME='Database'
    DB_USERNAME='User'
    DB_PASSWORD='Password'
    JWT_SECRET='A string at least 256 bits long ...'
    JWT_REFRESH_SECRET='A string at least 256 bits long ...'
    JWT_EXPIRATION='3600000' # 1 hour in milliseconds
    JWT_REFRESH_EXPIRATION='2592000000' # 30 days in milliseconds

**app.yaml** for deployment from local machine

    runtime: nodejs22
    env: standard
    service: api
    instance_class: F1
    env_variables:
      NODE_ENV: 'production'
      EXPRESS_PORT: '8080'
      INSTANCE_UNIX_SOCKET: '/cloudsql/project_id:region:instance'
      DB_PORT: 'Port'
      DB_NAME: 'Database'
      DB_USERNAME: 'User'
      DB_PASSWORD: 'Password'
      JWT_SECRET: 'A string at least 256 bits long ...'
      JWT_REFRESH_SECRET: 'A string at least 256 bits long ...'
      JWT_EXPIRATION: '3600000' # 1 hour in milliseconds
      JWT_REFRESH_EXPIRATION: '2592000000' # 30 days in milliseconds

## References

[Connect from App Engine standard environment | Cloud SQL for MySQL | Google Cloud](https://cloud.google.com/sql/docs/mysql/connect-app-engine-standard)
