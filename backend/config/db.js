module.exports = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'art_user',
  password: process.env.DB_PASSWORD || 'sonam',
  database: process.env.DB_NAME || 'art_marketplace'
};