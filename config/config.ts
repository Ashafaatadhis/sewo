import dotenv from "dotenv";
import joi from "joi";

dotenv.config();

const envVarsSchema = joi
  .object()
  .keys({
    NODE_ENV: joi
      .string()
      .valid("production", "development", "test")
      .required(),
    PORT: joi.number().positive().required(),
    GOOGLE_CLIENT_ID: joi.string().required(),
    GOOGLE_CLIENT_SECRET: joi.string().required(),
    GITHUB_CLIENT_ID: joi.string().required(),
    GITHUB_CLIENT_SECRET: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    REFRESH_TOKEN_COOKIE_NAME: joi.string().required(),
    CLIENT_REDIRECT: joi.string().required(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  auth: {
    google: {
      google_client_id: envVars.GOOGLE_CLIENT_ID,
      google_client_secret: envVars.GOOGLE_CLIENT_SECRET,
    },
    github: {
      github_client_id: envVars.GITHUB_CLIENT_ID,
      github_client_secret: envVars.GITHUB_CLIENT_SECRET,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
  },
  redirect: envVars.CLIENT_REDIRECT,
  cookie: {
    refreshToken: {
      name: envVars.REFRESH_TOKEN_COOKIE_NAME,
    },
  },
};
