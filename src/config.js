module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URL:
    process.env.DB_URL || 'postgresql://postgres@localhost/prayer-circles',
  TEST_DB_URL:
    process.env.TEST_DB_URL ||
    'postgresql://postgres@localhost/prayer-circles-test',
  region: process.env.region,
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
};
