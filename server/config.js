const config = {
  development: {
    PORT: process.env.PORT || 5000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/twinkle-jewellery',
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
    UPLOAD_PATH: './uploads',
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  },
  production: {
    PORT: process.env.PORT || 5000,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    UPLOAD_PATH: './uploads',
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  },
  test: {
    PORT: 5001,
    MONGODB_URI: 'mongodb://localhost:27017/twinkle-jewellery-test',
    JWT_SECRET: 'test-secret',
    UPLOAD_PATH: './test-uploads',
    MAX_FILE_SIZE: 1 * 1024 * 1024, // 1MB
  }
};

const environment = process.env.NODE_ENV || 'development';

module.exports = config[environment];