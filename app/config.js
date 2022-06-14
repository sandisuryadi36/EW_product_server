const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
module.exports = {
    rootPath: path.normalize(`${__dirname}/../`),
    secretKey: process.env.SECRET_KEY,
    serviceName: process.env.SERVICE_NAME,
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT,
    dbUser: process.env.DB_USER,
    dbPass: process.env.DB_PASS,
    dbName: process.env.DB_NAME,
    bucketName: process.env.BUCKET_NAME,
    clientEmail: process.env.CLIENT_EMAIL,
    privateKey: process.env.PRIVATE_KEY,
    projectId: process.env.PROJECT_ID
}