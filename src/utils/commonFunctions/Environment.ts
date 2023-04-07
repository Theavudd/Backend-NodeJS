import * as dotenv from 'dotenv';
dotenv.config();

const SYS_ERR = {
  NODE_ENV_INVALID: 100,
  BOOTSTRAP_ERROR: 101,
  MONGO_CONN_FAILED: 103,
};

const Config = {
  accessTokenSecret: <string>process.env.accessTokenSecret,
  PORT: <string>process.env.PORT,
  basicauth: <string>process.env.basicauth,
  MONGO_URI: <string>process.env.MONGO_URI,
  JWT_PASSWORD: 'qwertyuiop',
  ENCRYPTIONKEY: 'hhgghhggyyjjuuiikklloopp87tgfs54',
};

export {Config, SYS_ERR};