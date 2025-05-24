# API
## Deployment
To deploy on AppEngine add the following congi files and execute the deployment command <code>gloud app deploy</code>

<b>.env</b>
<code>
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
</code>

<b>app.yaml</b>
<code>
runtime: nodejs22
env: standard
service: api
instance_class: F1
  NODE_ENV: "production"
  EXPRESS_PORT: "8080"
  INSTANCE_UNIX_SOCKET: /cloudsql/project_id:region:instance
  DB_PORT: "Port"
  DB_NAME: "Database"
  DB_USERNAME: "User"
  DB_PASSWORD: "Password"
  JWT_SECRET='A string at least 256 bits long ...'
  JWT_REFRESH_SECRET='A string at least 256 bits long ...'
  JWT_EXPIRATION='3600000' # 1 hour in milliseconds
  JWT_REFRESH_EXPIRATION='2592000000' # 30 days in milliseconds
</code>
