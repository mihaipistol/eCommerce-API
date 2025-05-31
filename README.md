
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

**Connections**:
- **Networking**:
-- **Add a network**: <code>local 89.165.201.10</code> or <code>all 0.0.0.0/0</code>
Note: <code>all</code> should be done only for setting up dev, don't leave it there.

### Steps to implement
#### Step 0: CCP CLI
	gcloud init

#### Step 1: Set Up Cloud SQL
-   Create a Cloud SQL **instance** in the same region as your App Engine **application**.
-   Configure database users and set strong passwords.

#### Step 2: Configure App Engine
Update the `.env` and `app.yaml` files, special attention to **Cloud SQL instance connection name** 
	
	INSTANCE_UNIX_SOCKET: /cloudsql/project_id:region:instance

#### Step 3: Configure Database
Create the database and generate the tables:

	npm run db:migrate

#### Step 4: Secure the Connection
- Use **IAM roles** to grant App Engine access to Cloud SQL.

#### Step 5: Deploy and Monitor
Deploy your app to App Engine:

	npm run build
	gcloud app deploy

Use **Cloud Monitoring** and **Cloud Logging** to track performance and troubleshoot issues.

## Best Practices
-   **Regional Placement**: Ensure both App Engine and Cloud SQL are in the same region to reduce latency.
-   **Scaling**: Use App Engine's autoscaling and configure Cloud SQL connection limits accordingly.
-   **Backups**: Enable automated backups and point-in-time recovery for Cloud SQL.

**Security**: Use **Cloud IAM** and **VPC Service Controls** to restrict access.


This architecture ensures a secure, scalable, and efficient connection between App Engine and Cloud SQL, suitable for modern web applications.


## Environment

<b>.env</b>

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


<b>app.yaml</b>

	runtime: nodejs22
	env: standard
	service: api
	instance_class: F1
  env_variables:
	  NODE_ENV: "production"
	  EXPRESS_PORT: "8080"
	  INSTANCE_UNIX_SOCKET: /cloudsql/project_id:region:instance
	  DB_PORT: "Port"
	  DB_NAME: "Database"
	  DB_USERNAME: "User"
	  DB_PASSWORD: "Password"
	  JWT_SECRET: 'A string at least 256 bits long ...'
	  JWT_REFRESH_SECRET: 'A string at least 256 bits long ...'
	  JWT_EXPIRATION: '3600000' # 1 hour in milliseconds
	  JWT_REFRESH_EXPIRATION: '2592000000' # 30 days in milliseconds

## References
[Connect from App Engine standard environment | Cloud SQL for MySQL | Google Cloud](https://cloud.google.com/sql/docs/mysql/connect-app-engine-standard)
