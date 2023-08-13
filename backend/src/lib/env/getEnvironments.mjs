const env = Object.freeze({
  NODE_ENV: process.env.NODE_ENV || 'development',
  HOST: process.env.HOST || '127.0.0.1',
  PORT: process.env.PORT || '3000',
});

/**
 * Get environments
 * @returns {Readonly<{HOST: string, PORT: string, NODE_ENV: string}>}
 */
export default function getEnvironments() {
  return env;
}
