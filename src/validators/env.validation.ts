import Joi from 'joi';

/**
 * @description This is the validation schema for the environment variables
 */
const envValidation = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test'),
  PORT: Joi.number().port(),
  DATABASE_URL: Joi.string().required(),

  JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
  JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
  JWT_ACCESS_TOKEN_EXPIRES_IN: Joi.number().required(),
  JWT_REFRESH_TOKEN_EXPIRES_IN: Joi.number().required(),
  COOKIE_REFRESH_TOKEN_MAX_AGE: Joi.number().required(),
});

export { envValidation };
