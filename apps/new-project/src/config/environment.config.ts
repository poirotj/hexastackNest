export interface EnvironmentConfig {
  port: number;
  nodeEnv: string;
  databaseUrl?: string;
  microserviceTransport: string;
  microserviceHost: string;
  microservicePort: number;
  eventStoreUrl?: string;
  eventStoreUsername?: string;
  eventStorePassword?: string;
  eventBusTransport: string;
  redisUrl?: string;
}

export const environmentConfig: EnvironmentConfig = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  microserviceTransport: process.env.MICROSERVICE_TRANSPORT || 'tcp',
  microserviceHost: process.env.MICROSERVICE_HOST || 'localhost',
  microservicePort: parseInt(process.env.MICROSERVICE_PORT || '3001', 10),
  eventStoreUrl: process.env.EVENT_STORE_URL,
  eventStoreUsername: process.env.EVENT_STORE_USERNAME,
  eventStorePassword: process.env.EVENT_STORE_PASSWORD,
  eventBusTransport: process.env.EVENT_BUS_TRANSPORT || 'redis',
  redisUrl: process.env.REDIS_URL
};
