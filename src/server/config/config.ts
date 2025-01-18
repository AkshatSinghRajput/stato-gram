// Contains all the environment variables for the server. This file is used to store sensitive information like API keys, database credentials, and other configuration options. This file is not committed to the repository and is used to keep sensitive information secure.

const _config = {
  databaseURI: process.env.DATABASE_URL,
};

const config = Object.freeze(_config);

export default config;
