import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

type EnvironmentType = {
  NODE_ENV: string;
  EXPRESS_PORT: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_EXPIRATION: number;
  JWT_REFRESH_EXPIRATION: number;
  JWT_COOKIE_EXPIRATION: number;
};

export type EnvironmentDevelopment = EnvironmentType & {
  NODE_ENV: 'development';
  DB_HOST: string;
};

export type EnvironmentProduction = EnvironmentType & {
  NODE_ENV: 'production';
  INSTANCE_UNIX_SOCKET: string;
};

const client = new SecretManagerServiceClient();

async function loadSecret(secretIdentifier: string): Promise<string> {
  const [version] = await client.accessSecretVersion({
    name: secretIdentifier,
  });
  const payload = version?.payload?.data?.toString();
  if (!payload) {
    throw new Error(`Secret ${secretIdentifier} not found`);
  }
  return payload;
}

async function loadEnvironmentVariables(): Promise<EnvironmentType> {
  if (
    !process.env.NODE_ENV ||
    !process.env.EXPRESS_PORT ||
    !process.env.DB_PORT ||
    !process.env.DB_NAME ||
    !process.env.DB_USERNAME ||
    !process.env.DB_PASSWORD ||
    !process.env.JWT_SECRET ||
    !process.env.JWT_REFRESH_SECRET ||
    !process.env.JWT_EXPIRATION ||
    !process.env.JWT_REFRESH_EXPIRATION ||
    !process.env.JWT_COOKIE_EXPIRATION
  ) {
    throw new Error('Missing environment variables');
  }
  const DB_PORT = parseInt(process.env.DB_PORT, 10);
  const JWT_EXPIRATION = parseInt(process.env.JWT_EXPIRATION, 10);
  const JWT_REFRESH_EXPIRATION = parseInt(
    process.env.JWT_REFRESH_EXPIRATION,
    10,
  );
  const JWT_COOKIE_EXPIRATION = parseInt(process.env.JWT_COOKIE_EXPIRATION, 10);
  return {
    NODE_ENV: process.env.NODE_ENV,
    EXPRESS_PORT: process.env.EXPRESS_PORT,
    DB_PORT: DB_PORT,
    DB_NAME: process.env.DB_NAME,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_EXPIRATION: JWT_EXPIRATION,
    JWT_REFRESH_EXPIRATION: JWT_REFRESH_EXPIRATION,
    JWT_COOKIE_EXPIRATION: JWT_COOKIE_EXPIRATION,
  };
}

async function loadEnvironmentVariablesForDevelopment(): Promise<EnvironmentDevelopment> {
  const env = await loadEnvironmentVariables();
  if (!process.env.DB_HOST) {
    throw new Error('Missing environment variables');
  }
  return {
    ...env,
    DB_HOST: process.env.DB_HOST,
  } as EnvironmentDevelopment;
}
async function loadEnvironmentVariablesForProduction(): Promise<EnvironmentProduction> {
  const env = await loadEnvironmentVariables();
  if (
    !process.env.INSTANCE_UNIX_SOCKET ||
    !process.env.DB_NAME ||
    !process.env.DB_PORT ||
    !process.env.DB_USERNAME ||
    !process.env.DB_PASSWORD ||
    // Check if JWT secrets are set to avoid typing
    !process.env.JWT_SECRET ||
    !process.env.JWT_REFRESH_SECRET
  ) {
    throw new Error('Missing environment variables');
  }
  const DB_NAME = await loadSecret(process.env.DB_NAME);
  const DB_USERNAME = await loadSecret(process.env.DB_USERNAME);
  const DB_PASSWORD = await loadSecret(process.env.DB_PASSWORD);
  const JWT_SECRET = await loadSecret(process.env.JWT_SECRET);
  const JWT_REFRESH_SECRET = await loadSecret(process.env.JWT_REFRESH_SECRET);
  console.log('Loaded secrets for production environment');
  return {
    ...env,
    DB_NAME,
    DB_USERNAME,
    DB_PASSWORD,
    JWT_SECRET,
    JWT_REFRESH_SECRET,
    INSTANCE_UNIX_SOCKET: process.env.INSTANCE_UNIX_SOCKET,
  } as EnvironmentProduction;
}

let environment: EnvironmentDevelopment | EnvironmentProduction | null = null;
export default async function getEnvironment(): Promise<
  EnvironmentDevelopment | EnvironmentProduction
> {
  if (environment) {
    return environment;
  }
  try {
    // Determine the environment based on NODE_ENV
    const env = process.env.NODE_ENV || 'development';
    if (env === 'production') {
      environment = await loadEnvironmentVariablesForProduction();
    } else {
      environment = await loadEnvironmentVariablesForDevelopment();
    }
  } catch (error) {
    console.error('Error loading environment variables:', error);
    throw error;
  }
  return environment;
}
