import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().port().default(3000),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().port().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_SSL: Joi.boolean().truthy('true').falsy('false').default(false),
  DB_LOGGING: Joi.boolean().truthy('true').falsy('false').default(false)
}).unknown(true);

const { error, value } = envSchema.validate(process.env, {
  abortEarly: false,
  convert: true
});

if (error) {
  throw new Error(`Environment validation error: ${error.message}`);
}

export const env = {
  nodeEnv: value.NODE_ENV as 'development' | 'test' | 'production',
  port: value.PORT as number,
  db: {
    host: value.DB_HOST as string,
    port: value.DB_PORT as number,
    username: value.DB_USERNAME as string,
    password: value.DB_PASSWORD as string,
    name: value.DB_NAME as string,
    ssl: value.DB_SSL as boolean,
    logging: value.DB_LOGGING as boolean
  }
};
